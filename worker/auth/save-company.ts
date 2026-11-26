import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { createDb } from '../db'
import { companies } from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import {
  companyFields,
  companySchema,
  findCompany,
  isIndustryTag,
} from './lib/company'

const saveCompanyBody = z.object(companyFields, { error: '請求格式錯誤' })

export const saveCompanyRoute = createRoute({
  method: 'put',
  path: '/auth/company',
  middleware: [requireAuth, requireRole('owner')] as const,
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: saveCompanyBody } },
    },
  },
  responses: {
    200: {
      description: '儲存成功，回傳儲存後的公司資料',
      content: {
        'application/json': {
          schema: z.object({ data: companySchema, error: z.null() }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（含產業標籤 id 不存在或分類不符）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是負責人，或 Origin 不是本站）' },
  },
})

export const saveCompany: RouteHandler<
  typeof saveCompanyRoute,
  AuthEnv
> = async (c) => {
  const body = c.req.valid('json')
  const user = c.get('user')
  const db = createDb(c.env)

  if (!(await isIndustryTag(db, body.industry_tag_id))) {
    return fail(c, 400, 'VALIDATION_FAILED', '請選擇產業', [
      { field: 'industry_tag_id', message: '請選擇產業' },
    ])
  }

  // The company is created at signup; insert anyway in case it is missing,
  // so saving never fails on an owner without one
  await db
    .insert(companies)
    .values({
      userId: user.id,
      realName: body.real_name,
      phone: body.phone,
      name: body.name,
      taxId: body.tax_id,
      industryTagId: body.industry_tag_id,
      address: body.address,
    })
    .onConflictDoUpdate({
      target: companies.userId,
      set: {
        realName: body.real_name,
        phone: body.phone,
        name: body.name,
        taxId: body.tax_id,
        industryTagId: body.industry_tag_id,
        address: body.address,
        updatedAt: new Date(),
      },
    })

  return ok(c, await findCompany(db, user))
}
