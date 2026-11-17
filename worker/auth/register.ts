import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'
import postgres from 'postgres'
import { createDb } from '../db'
import {
  companies,
  disputeAgreements,
  tags,
  testerProfiles,
  users,
} from '../db/schema'
import { fail, ok } from '../http/response'
import { hashPassword } from './password'
import { createSession } from './session'

// Fields both roles send. `role` decides which profile comes with them.
const account = {
  email: z
    .string({ error: '請輸入 Email' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Email 格式錯誤' })),
  password: z
    .string({ error: '請輸入密碼' })
    .min(8, '密碼至少 8 碼')
    .max(128, '密碼最多 128 碼')
    .regex(/[A-Za-z]/, '密碼需包含英文')
    .regex(/[0-9]/, '密碼需包含數字'),
  agreed: z.literal(true, { error: '請同意爭議處理流程' }),
}

// Every profile has a name and phone. A field of the other role is rejected, not ignored.
const profileFields = {
  real_name: z
    .string({ error: '請輸入姓名' })
    .trim()
    .min(1, '請輸入姓名')
    .max(50, '姓名最多 50 字'),
  // 0912-345-678 and 0912 345 678 are accepted and saved as 0912345678
  phone: z
    .string({ error: '請輸入手機號碼' })
    .overwrite((value) => value.replace(/[\s-]/g, ''))
    .regex(/^09[0-9]{8}$/, '手機號碼須為 09 開頭的 10 碼數字'),
}

const profileError = (issue: { code?: string }) =>
  issue.code === 'unrecognized_keys' ? '這個角色沒有這個欄位' : '請填寫基本資料'

const registerBody = z.discriminatedUnion(
  'role',
  [
    z.object({
      ...account,
      role: z.literal('tester'),
      profile: z.strictObject(
        {
          ...profileFields,
          city: z.enum(
            [
              '臺北市',
              '新北市',
              '桃園市',
              '臺中市',
              '臺南市',
              '高雄市',
              '基隆市',
              '新竹市',
              '嘉義市',
              '新竹縣',
              '苗栗縣',
              '彰化縣',
              '南投縣',
              '雲林縣',
              '嘉義縣',
              '屏東縣',
              '宜蘭縣',
              '花蓮縣',
              '臺東縣',
              '澎湖縣',
              '金門縣',
              '連江縣',
              '海外',
            ],
            { error: '請選擇縣市' }
          ),
        },
        { error: profileError }
      ),
    }),
    z.object({
      ...account,
      role: z.literal('owner'),
      profile: z.strictObject(
        {
          ...profileFields,
          name: z
            .string({ error: '請輸入公司名稱' })
            .trim()
            .min(1, '請輸入公司名稱')
            .max(100, '公司名稱最多 100 字'),
          tax_id: z
            .string({ error: '統一編號須為 8 碼數字' })
            .regex(/^([0-9]{8})?$/, '統一編號須為 8 碼數字')
            .nullish()
            .transform((value) => value || null),
          industry_tag_id: z.uuid({ error: '請選擇產業' }),
          address: z
            .string({ error: '請輸入地址' })
            .trim()
            .min(1, '請輸入地址')
            .max(200, '地址最多 200 字'),
        },
        { error: profileError }
      ),
    }),
  ],
  { error: '請選擇角色' }
)

export const registerRoute = createRoute({
  method: 'post',
  path: '/auth/register',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: registerBody } },
    },
  },
  responses: {
    201: {
      description: '註冊成功，並設定 session cookie',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              id: z.uuid(),
              email: z.string(),
              role: z.enum(['owner', 'tester']),
              display_name: z.string(),
            }),
            error: z.null(),
          }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED' },
    403: { description: 'FORBIDDEN（Origin 不是本站）' },
    409: { description: 'EMAIL_TAKEN' },
  },
})

export const register: RouteHandler<
  typeof registerRoute,
  { Bindings: Env }
> = async (c) => {
  const body = c.req.valid('json')
  const db = createDb(c.env)

  if (body.role === 'owner') {
    const [tag] = await db
      .select({ category: tags.category })
      .from(tags)
      .where(eq(tags.id, body.profile.industry_tag_id))

    if (tag?.category !== 'industry') {
      return fail(c, 400, 'VALIDATION_FAILED', '請選擇產業', [
        { field: 'profile.industry_tag_id', message: '請選擇產業' },
      ])
    }
  }

  const password = await hashPassword(body.password)

  try {
    // Account, profile, agreement and session are saved together or not at all
    const { user, token } = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: body.email,
          passwordHash: password.hash,
          passwordSalt: password.salt,
          passwordIterations: password.iterations,
          role: body.role,
        })
        .returning({ id: users.id, email: users.email, role: users.role })

      if (body.role === 'tester') {
        await tx.insert(testerProfiles).values({
          userId: user.id,
          realName: body.profile.real_name,
          phone: body.profile.phone,
          city: body.profile.city,
        })
      } else {
        await tx.insert(companies).values({
          userId: user.id,
          realName: body.profile.real_name,
          phone: body.profile.phone,
          name: body.profile.name,
          taxId: body.profile.tax_id,
          industryTagId: body.profile.industry_tag_id,
          address: body.profile.address,
        })
      }

      await tx.insert(disputeAgreements).values({ userId: user.id })

      return { user, token: await createSession(tx, user.id) }
    })

    setCookie(c, 'session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return ok(
      c,
      {
        id: user.id,
        email: user.email,
        role: user.role,
        display_name: body.profile.real_name,
      },
      201
    )
  } catch (err) {
    if (
      err instanceof Error &&
      err.cause instanceof postgres.PostgresError &&
      err.cause.constraint_name === 'users_email_unique'
    ) {
      return fail(c, 409, 'EMAIL_TAKEN', '這個 email 已經註冊')
    }
    throw err
  }
}
