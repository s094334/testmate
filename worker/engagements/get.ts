import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { createDb } from '../db'
import { requireAuth, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { engagementSchema, findEngagement } from './lib/engagement'
import { findParties, sideOf } from './lib/parties'

export const getEngagementRoute = createRoute({
  method: 'get',
  path: '/engagements/{id}',
  middleware: [requireAuth] as const,
  request: {
    params: z.object({ id: z.uuid({ error: '合作 id 格式錯誤' }) }),
  },
  responses: {
    200: {
      description:
        '合作詳情；FUNDED 以後（不含 CANCELLED）disclosed 才有保密內容與雙方聯絡資料',
      content: {
        'application/json': {
          schema: z.object({ data: engagementSchema, error: z.null() }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（id 不是 UUID）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是這筆合作的負責人或測試人員）' },
    404: { description: 'NOT_FOUND（合作不存在）' },
  },
})

export const getEngagement: RouteHandler<
  typeof getEngagementRoute,
  AuthEnv
> = async (c) => {
  const { id } = c.req.valid('param')
  const user = c.get('user')
  const db = createDb(c.env)

  const parties = await findParties(db, id)

  if (!parties) {
    return fail(c, 404, 'NOT_FOUND', '找不到這筆合作')
  }

  if (!sideOf(parties, user.id)) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  const engagement = await findEngagement(db, id)
  if (!engagement) throw new Error(`Engagement ${id} disappeared`)

  return ok(c, engagement)
}
