import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { avatarShapes } from '../../shared/avatar-shapes'
import { cities } from '../../shared/cities'
import { createDb, isUniqueViolation, saveTogether } from '../db'
import {
  companies,
  disputeAgreements,
  testerProfiles,
  users,
} from '../db/schema'
import { fail, ok } from '../http/response'
import { companyFields, isIndustryTag } from './lib/company'
import { hashPassword } from './lib/password'
import { nicknameField, phoneField, realNameField } from './lib/profile'

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

// A field of the other role is rejected, not ignored
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
          real_name: realNameField,
          phone: phoneField,
          nickname: nicknameField,
          city: z.enum(cities, { error: '請選擇縣市' }),
        },
        { error: profileError }
      ),
    }),
    z.object({
      ...account,
      role: z.literal('owner'),
      profile: z.strictObject(companyFields, { error: profileError }),
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
      description: '註冊成功（不會登入，要另外呼叫 POST /api/auth/login）',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              id: z.uuid(),
              email: z.string(),
              role: z.enum(['owner', 'tester']),
              display_name: z.string(),
              avatar_shape: z.enum(avatarShapes),
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

  if (
    body.role === 'owner' &&
    !(await isIndustryTag(db, body.profile.industry_tag_id))
  ) {
    return fail(c, 400, 'VALIDATION_FAILED', '請選擇產業', [
      { field: 'profile.industry_tag_id', message: '請選擇產業' },
    ])
  }

  const password = await hashPassword(body.password)
  const userId = crypto.randomUUID()
  const avatarShape =
    avatarShapes[Math.floor(Math.random() * avatarShapes.length)]

  try {
    // Account, profile and agreement are saved together or not at all.
    // No session: signing up does not log in, the user logs in afterwards.
    // A taken email is not looked up first: the unique index on users.email
    // fails the batch, so two signups with one email at the same time cannot both pass.
    await saveTogether(db, [
      db.insert(users).values({
        id: userId,
        email: body.email,
        passwordHash: password.hash,
        passwordSalt: password.salt,
        passwordIterations: password.iterations,
        role: body.role,
        avatarShape,
      }),
      body.role === 'tester'
        ? db.insert(testerProfiles).values({
            userId,
            realName: body.profile.real_name,
            nickname: body.profile.nickname,
            phone: body.profile.phone,
            city: body.profile.city,
          })
        : db.insert(companies).values({
            userId,
            realName: body.profile.real_name,
            phone: body.profile.phone,
            name: body.profile.name,
            taxId: body.profile.tax_id,
            industryTagId: body.profile.industry_tag_id,
            address: body.profile.address,
          }),
      db.insert(disputeAgreements).values({ userId }),
    ])

    return ok(
      c,
      {
        id: userId,
        email: body.email,
        role: body.role,
        // Same as displayName in lib/session.ts; a tester's nickname is never '' here
        display_name:
          body.role === 'tester'
            ? body.profile.nickname
            : body.profile.real_name,
        avatar_shape: avatarShape,
      },
      201
    )
  } catch (err) {
    if (isUniqueViolation(err, users.email)) {
      return fail(c, 409, 'EMAIL_TAKEN', '這個 email 已經註冊')
    }
    throw err
  }
}
