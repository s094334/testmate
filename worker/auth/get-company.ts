import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { createDb } from '../db'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { companySchema, findCompany } from './lib/company'

export const getCompanyRoute = createRoute({
  method: 'get',
  path: '/auth/company',
  middleware: [requireAuth, requireRole('owner')] as const,
  responses: {
    200: {
      description: '目前登入的負責人的公司資料',
      content: {
        'application/json': {
          schema: z.object({ data: companySchema, error: z.null() }),
        },
      },
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是負責人）' },
    404: { description: 'NOT_FOUND（還沒填公司資料）' },
  },
})

export const getCompany: RouteHandler<typeof getCompanyRoute, AuthEnv> = async (
  c
) => {
  const company = await findCompany(createDb(c.env), c.get('user'))

  if (!company) {
    return fail(c, 404, 'NOT_FOUND', '還沒填公司資料')
  }

  return ok(c, company)
}
