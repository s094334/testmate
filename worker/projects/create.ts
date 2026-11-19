import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { cities } from '../../shared/cities'
import { createDb, insertRows, saveTogether } from '../db'
import {
  companies,
  minQaYearsOptions,
  projectDevices,
  projectTags,
  projectTestItems,
  projects,
  tags,
  testModes,
} from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findProject, projectSchema } from './lib/project'

// Days after 開始測試 to hand in the report. The form has no field for it yet,
// so every project gets this; projects.report_days stores it per project.
const REPORT_DAYS = 7

// Fields follow the 發布專案 form. confidential_details, environment_info and
// test_items are from API.md and optional until the form has a step for them.
const createProjectBody = z
  .object(
    {
      name: z
        .string({ error: '請填寫專案名稱' })
        .trim()
        .min(1, '請填寫專案名稱')
        .max(100, '專案名稱最多 100 字'),
      summary: z
        .string({ error: '請填寫簡介' })
        .trim()
        .min(1, '請填寫簡介')
        .max(500, '簡介最多 500 字'),
      devices: z
        .array(
          z
            .object(
              {
                device_tag_id: z.uuid({ error: '請選擇裝置類型' }).nullish(),
                brand: z
                  .string({ error: '請選擇品牌' })
                  .trim()
                  .max(100, '品牌最多 100 字')
                  .nullish(),
                model: z
                  .string({ error: '請選擇型號' })
                  .trim()
                  .max(100, '型號最多 100 字')
                  .nullish(),
                min_os_version: z
                  .string({ error: '請選擇最低系統版本' })
                  .trim()
                  .max(100, '最低系統版本最多 100 字')
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
            // With a tag it is a listed device and needs brand and min_os_version.
            // No model means any model of the brand: 不限型號, or a brand like
            // Windows that has no model list. Without a tag it is custom.
            .superRefine((device, ctx) => {
              if (device.device_tag_id) {
                if (!device.brand) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['brand'],
                    message: '請選擇品牌',
                  })
                }
                if (!device.min_os_version) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['min_os_version'],
                    message: '請選擇最低系統版本',
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
                if (
                  device.min_os_version &&
                  device.min_os_version.length > 30
                ) {
                  ctx.addIssue({
                    code: 'custom',
                    path: ['min_os_version'],
                    message: '最低系統版本最多 30 字',
                  })
                }
              }
            }),
          { error: '目標裝置格式錯誤' }
        )
        .max(50, '目標裝置最多 50 台')
        .default([]),
      languages: z
        .array(
          z.object(
            {
              // Same list as languageOptions in src/data/options.ts
              name: z.enum(
                [
                  '中文',
                  '英文',
                  '日語',
                  '韓文',
                  '泰文',
                  '越南文',
                  '德文',
                  '西班牙文',
                  '法文',
                  '葡萄牙文',
                  '義大利文',
                  '丹麥文',
                  '瑞典文',
                  '荷蘭文',
                  '土耳其文',
                ],
                { error: '請選擇測試語言' }
              ),
              native_required: z.boolean({ error: '請選擇是否需母語' }),
            },
            { error: '測試語言格式錯誤' }
          ),
          { error: '測試語言格式錯誤' }
        )
        .refine(
          (languages) =>
            new Set(languages.map(({ name }) => name)).size ===
            languages.length,
          '同一種語言只能選一次'
        )
        .default([]),
      interest_tag_ids: z
        .array(z.uuid({ error: '請選擇興趣' }), { error: '請選擇興趣' })
        .max(100, '興趣太多')
        .default([]),
      qa_experience_required: z.boolean({ error: '請選擇經驗要求' }),
      min_qa_years: z
        .enum(minQaYearsOptions, { error: '請選擇最低年資' })
        .nullish(),
      test_mode: z.enum(testModes, { error: '請選擇測試方式' }),
      test_city: z.enum(cities, { error: '請選擇測試地點' }).nullish(),
      start_date: z.iso.date({ error: '請選擇開始日期' }),
      end_date: z.iso.date({ error: '請選擇結束日期' }),
      reward: z
        .int({ error: '請填寫報酬金額' })
        .min(1, '報酬至少 1 元')
        .max(100000, '報酬最多 100,000 元'),
      how_to_test: z
        .string({ error: '請填寫如何測試' })
        .trim()
        .min(1, '請填寫如何測試')
        .max(2000, '如何測試最多 2,000 字'),
      success_criteria: z
        .string({ error: '請填寫成功標準' })
        .trim()
        .min(1, '請填寫成功標準')
        .max(2000, '成功標準最多 2,000 字'),
      special_requirements: z
        .string({ error: '特殊要求格式錯誤' })
        .trim()
        .max(2000, '特殊要求最多 2,000 字')
        .nullish()
        .transform((value) => value || null),
      confidential_details: z
        .string({ error: '完整測試內容格式錯誤' })
        .trim()
        .max(5000, '完整測試內容最多 5,000 字')
        .nullish()
        .transform((value) => value || null),
      environment_info: z
        .string({ error: '測試環境說明格式錯誤' })
        .trim()
        .max(5000, '測試環境說明最多 5,000 字')
        .nullish()
        .transform((value) => value || null),
      test_items: z
        .array(
          z.object(
            {
              title: z
                .string({ error: '請填寫測試項目標題' })
                .trim()
                .min(1, '請填寫測試項目標題')
                .max(100, '測試項目標題最多 100 字'),
              steps: z
                .string({ error: '請填寫操作說明' })
                .trim()
                .min(1, '請填寫操作說明')
                .max(2000, '操作說明最多 2,000 字'),
              expected: z
                .string({ error: '請填寫預期結果' })
                .trim()
                .min(1, '請填寫預期結果')
                .max(2000, '預期結果最多 2,000 字'),
            },
            { error: '測試項目格式錯誤' }
          ),
          { error: '測試項目格式錯誤' }
        )
        .max(50, '測試項目最多 50 項')
        .default([]),
      // Rejected instead of dropped, so a client still sending them
      // finds out they are not saved
      industry_tag_ids: z
        .never({ error: '專案的產業來自公司資料，不能另外選擇' })
        .optional(),
      audience_tag_ids: z.never({ error: '專案沒有族群標籤' }).optional(),
      report_days: z
        .never({
          error: `報告交付天數目前固定為 ${REPORT_DAYS} 天，不能填寫`,
        })
        .optional(),
    },
    { error: '請求格式錯誤' }
  )
  .superRefine((body, ctx) => {
    if (body.qa_experience_required && !body.min_qa_years) {
      ctx.addIssue({
        code: 'custom',
        path: ['min_qa_years'],
        message: '請選擇最低年資',
      })
    }
    if (!body.qa_experience_required && body.min_qa_years != null) {
      ctx.addIssue({
        code: 'custom',
        path: ['min_qa_years'],
        message: '不需要 QA 經驗時不能填寫最低年資',
      })
    }
    if (body.test_mode === 'onsite' && !body.test_city) {
      ctx.addIssue({
        code: 'custom',
        path: ['test_city'],
        message: '請選擇測試地點',
      })
    }
    if (body.test_mode === 'remote' && body.test_city != null) {
      ctx.addIssue({
        code: 'custom',
        path: ['test_city'],
        message: '遠端測試不能填寫測試地點',
      })
    }
    // Dates are Taiwan dates; en-CA writes today as 2026-11-18, so the
    // YYYY-MM-DD strings compare in date order
    if (
      body.start_date <
      new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['start_date'],
        message: '開始日期不能早於今天',
      })
    }
    if (body.end_date < body.start_date) {
      ctx.addIssue({
        code: 'custom',
        path: ['end_date'],
        message: '結束日期不能早於開始日期',
      })
    }
  })

export const createProjectRoute = createRoute({
  method: 'post',
  path: '/projects',
  middleware: [requireAuth, requireRole('owner')] as const,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: createProjectBody } },
    },
  },
  responses: {
    201: {
      description: '發布成功，回傳專案（含保密內容）',
      content: {
        'application/json': {
          schema: z.object({ data: projectSchema, error: z.null() }),
        },
      },
    },
    400: {
      description:
        'VALIDATION_FAILED（含標籤 id 不存在或分類不符）、COMPANY_REQUIRED',
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是負責人，或 Origin 不是本站）' },
  },
})

export const createProject: RouteHandler<
  typeof createProjectRoute,
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

  // All of them rather than `id in (...)`: up to 150 sent ids would go over
  // D1's limit of 100 bound parameters, and the whole list is only 80 rows.
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

  // Created at signup in the same batch as the account, and no API deletes it,
  // so this only fails for an owner whose company row was removed by hand
  const [company] = await db
    .select({ userId: companies.userId })
    .from(companies)
    .where(eq(companies.userId, user.id))

  if (!company) {
    return fail(c, 400, 'COMPANY_REQUIRED', '請先填寫公司資料')
  }

  const projectId = crypto.randomUUID()

  // The project and everything under it are saved together or not at all
  await saveTogether(db, [
    db.insert(projects).values({
      id: projectId,
      ownerId: user.id,
      name: body.name,
      summary: body.summary,
      languages: body.languages,
      qaExperienceRequired: body.qa_experience_required,
      minQaYears: body.min_qa_years ?? null,
      testMode: body.test_mode,
      testCity: body.test_city ?? null,
      startDate: body.start_date,
      endDate: body.end_date,
      reportDays: REPORT_DAYS,
      reward: body.reward,
      howToTest: body.how_to_test,
      successCriteria: body.success_criteria,
      specialRequirements: body.special_requirements,
      confidentialDetails: body.confidential_details,
      environmentInfo: body.environment_info,
    }),

    ...insertRows(
      db,
      projectDevices,
      body.devices.map((device, i) => ({
        projectId,
        deviceTagId: device.device_tag_id ?? null,
        brand: device.brand ?? null,
        // An empty model (listed device) or min_os_version (custom device)
        // means it was left blank
        model: device.model || null,
        minOsVersion: device.min_os_version || null,
        customName: device.custom_name ?? null,
        sortOrder: i,
      }))
    ),

    // The same id sent twice would break the (project_id, tag_id) primary key
    ...insertRows(
      db,
      projectTags,
      [...new Set(body.interest_tag_ids)].map((tagId) => ({
        projectId,
        tagId,
      }))
    ),

    ...insertRows(
      db,
      projectTestItems,
      body.test_items.map((item, i) => ({
        projectId,
        title: item.title,
        steps: item.steps,
        expected: item.expected,
        sortOrder: i,
      }))
    ),
  ])

  return ok(c, await findProject(db, projectId, user), 201)
}
