import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, eq, inArray } from 'drizzle-orm'
import { cities } from '../../shared/cities'
import { createDb, insertRows, saveTogether } from '../db'
import {
  minQaYearsOptions,
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
} from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import {
  findTesterProfile,
  nicknameField,
  phoneField,
  qaYearsOf,
  testerProfileSchema,
} from './lib/profile'

const saveProfileBody = z
  .object(
    {
      real_name: z
        .string({ error: '請輸入真實姓名' })
        .trim()
        .min(1, '請輸入真實姓名')
        .max(50, '真實姓名最多 50 字'),
      nickname: nicknameField,
      city: z.enum(cities, { error: '請選擇縣市' }),
      phone: phoneField,
      has_qa_experience: z
        .boolean({ error: '請選擇是否有 QA 經驗' })
        .default(false),
      experiences: z
        .array(
          z.object(
            {
              company: z
                .string({ error: '請輸入公司名稱' })
                .trim()
                .min(1, '請輸入公司名稱')
                .max(100, '公司名稱最多 100 字'),
              years: z.enum(minQaYearsOptions, { error: '請選擇年資' }),
            },
            { error: '經驗格式錯誤' }
          ),
          { error: '經驗格式錯誤' }
        )
        .max(20, 'QA 經驗最多 20 筆')
        .default([]),
      languages: z
        .array(
          z.object(
            {
              name: z
                .string({ error: '請輸入語言' })
                .trim()
                .min(1, '請輸入語言')
                .max(50, '語言最多 50 字'),
              native: z.boolean({ error: '請選擇是否為母語' }),
            },
            { error: '語言格式錯誤' }
          ),
          { error: '語言格式錯誤' }
        )
        .default([]),
      devices: z
        .array(
          z
            .object(
              {
                device_tag_id: z.uuid({ error: '請選擇裝置類型' }).nullish(),
                brand: z
                  .string({ error: '請輸入品牌' })
                  .trim()
                  .max(100, '品牌最多 100 字')
                  .nullish(),
                model: z
                  .string({ error: '請輸入型號' })
                  .trim()
                  .max(100, '型號最多 100 字')
                  .nullish(),
                os_version: z
                  .string({ error: '請輸入系統版本' })
                  .trim()
                  .max(100, '系統版本最多 100 字')
                  .nullish(),
                // maxLength on the custom device form
                custom_name: z
                  .string({ error: '請輸入裝置名稱' })
                  .trim()
                  .max(40, '裝置名稱最多 40 字')
                  .nullish(),
              },
              { error: '裝置格式錯誤' }
            )
            // With a tag it is a listed device and needs brand and os_version;
            // model is optional because some brands (Windows, Linux) have no model list.
            // Without a tag it is custom and only takes custom_name and os_version.
            .superRefine((device, ctx) => {
              if (device.device_tag_id) {
                if (!device.brand) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['brand'],
                    message: '請輸入品牌',
                  })
                }
                if (!device.os_version) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['os_version'],
                    message: '請輸入系統版本',
                  })
                }
                if (device.custom_name != null) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['custom_name'],
                    message: '選了裝置類型時不能填寫自訂名稱',
                  })
                }
              } else {
                if (!device.custom_name) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['custom_name'],
                    message: '請輸入裝置名稱',
                  })
                }
                if (device.brand != null) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['brand'],
                    message: '自訂裝置不能填寫品牌',
                  })
                }
                if (device.model != null) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['model'],
                    message: '自訂裝置不能填寫型號',
                  })
                }
                // maxLength on the custom device form; listed devices allow 100
                if (device.os_version && device.os_version.length > 30) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['os_version'],
                    message: '系統版本最多 30 字',
                  })
                }
              }
            }),
          { error: '裝置格式錯誤' }
        )
        .default([]),
      interest_tag_ids: z
        .array(z.uuid({ error: '請選擇興趣' }), { error: '請選擇興趣' })
        .default([]),
      // Fields the request used to have. Rejected instead of dropped,
      // so a client still sending them finds out they are not saved.
      qa_years: z
        .never({ error: 'QA 年資會依經驗自動加總，不能填寫' })
        .optional(),
      industry_tag_ids: z
        .never({ error: '個人檔案已經沒有產業標籤' })
        .optional(),
      audience_tag_ids: z
        .never({ error: '個人檔案已經沒有族群標籤' })
        .optional(),
    },
    { error: '請求格式錯誤' }
  )
  .superRefine((body, ctx) => {
    if (body.has_qa_experience && body.experiences.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['experiences'],
        message: '請填寫至少一筆 QA 經驗',
      })
    }
    if (!body.has_qa_experience && body.experiences.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['experiences'],
        message: '沒有 QA 經驗時不能填寫經驗',
      })
    }
  })

export const saveProfileRoute = createRoute({
  method: 'put',
  path: '/auth/profile',
  middleware: [requireAuth, requireRole('tester')] as const,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: saveProfileBody } },
    },
  },
  responses: {
    200: {
      description: '儲存成功，回傳儲存後的整份檔案',
      content: {
        'application/json': {
          schema: z.object({ data: testerProfileSchema, error: z.null() }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（含標籤 id 不存在或分類不符）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是測試人員，或 Origin 不是本站）' },
  },
})

// Overwrites the whole profile: a list left out of the body is saved as empty
export const saveProfile: RouteHandler<
  typeof saveProfileRoute,
  AuthEnv
> = async (c) => {
  const body = c.req.valid('json')
  const user = c.get('user')
  const db = createDb(c.env)

  const tagFields = [
    ...body.devices.flatMap((device, i) =>
      device.device_tag_id
        ? [
            {
              field: `devices[${i}].device_tag_id`,
              id: device.device_tag_id,
              category: 'device',
              message: '請選擇裝置類型',
            },
          ]
        : []
    ),
    ...body.interest_tag_ids.map((id, i) => ({
      field: `interest_tag_ids[${i}]`,
      id,
      category: 'interest',
      message: '請選擇興趣',
    })),
  ]

  // All of them rather than `id in (...)`: the sent ids could go over D1's
  // limit of 100 bound parameters, and the whole list is only 80 rows.
  // Tags are seed data that no API changes, so nothing read here can change
  // before the batch below runs.
  const foundTags =
    tagFields.length > 0
      ? await db.select({ id: tags.id, category: tags.category }).from(tags)
      : []

  // A tag id that does not exist, or belongs to another category
  const wrongTags = tagFields
    .filter(
      (tagField) =>
        foundTags.find((tag) => tag.id === tagField.id)?.category !==
        tagField.category
    )
    .map(({ field, message }) => ({ field, message }))

  if (wrongTags.length > 0) {
    return fail(c, 400, 'VALIDATION_FAILED', wrongTags[0].message, wrongTags)
  }

  const qaYears = qaYearsOf(body.experiences)

  // Profile, devices and tags are saved together or not at all
  await saveTogether(db, [
    // The profile is created at signup; insert anyway in case it is missing,
    // so saving never fails on a tester without one
    db
      .insert(testerProfiles)
      .values({
        userId: user.id,
        realName: body.real_name,
        nickname: body.nickname,
        phone: body.phone,
        city: body.city,
        hasQaExperience: body.has_qa_experience,
        experiences: body.experiences,
        qaYears,
        languages: body.languages,
      })
      .onConflictDoUpdate({
        target: testerProfiles.userId,
        set: {
          realName: body.real_name,
          nickname: body.nickname,
          phone: body.phone,
          city: body.city,
          hasQaExperience: body.has_qa_experience,
          experiences: body.experiences,
          qaYears,
          languages: body.languages,
          updatedAt: new Date(),
        },
      }),

    db.delete(testerDevices).where(eq(testerDevices.userId, user.id)),
    ...insertRows(
      db,
      testerDevices,
      body.devices.map((device, i) => ({
        userId: user.id,
        deviceTagId: device.device_tag_id ?? null,
        brand: device.brand ?? null,
        // An empty model (listed device) or os_version (custom device)
        // means it was left blank
        model: device.model || null,
        osVersion: device.os_version || null,
        customName: device.custom_name ?? null,
        sortOrder: i,
      }))
    ),

    // Only interest rows are replaced; industry and audience rows saved
    // before those fields were removed are left as they are
    db
      .delete(testerProfileTags)
      .where(
        and(
          eq(testerProfileTags.userId, user.id),
          inArray(
            testerProfileTags.tagId,
            db
              .select({ id: tags.id })
              .from(tags)
              .where(eq(tags.category, 'interest'))
          )
        )
      ),
    // The same id sent twice would break the (user_id, tag_id) primary key
    ...insertRows(
      db,
      testerProfileTags,
      [...new Set(body.interest_tag_ids)].map((tagId) => ({
        userId: user.id,
        tagId,
      }))
    ),
  ])

  return ok(c, await findTesterProfile(db, user))
}
