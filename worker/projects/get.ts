import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { getCookie } from 'hono/cookie'
import { findSessionUser } from '../auth/lib/session'
import { createDb } from '../db'
import { fail, ok } from '../http/response'
import { findProject, projectSchema } from './lib/project'

export const getProjectRoute = createRoute({
  method: 'get',
  path: '/projects/{id}',
  request: {
    params: z.object({ id: z.uuid({ error: '專案 id 格式錯誤' }) }),
  },
  responses: {
    200: {
      description: '專案詳情；closed、cancelled 的專案也回傳',
      content: {
        'application/json': {
          schema: z.object({ data: projectSchema, error: z.null() }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（id 不是 UUID）' },
    404: { description: 'NOT_FOUND（專案不存在）' },
  },
})

// Public, so no requireAuth: a missing or expired session reads the project
// as a visitor instead of getting 401
export const getProject: RouteHandler<
  typeof getProjectRoute,
  { Bindings: Env }
> = async (c) => {
  const { id } = c.req.valid('param')
  const token = getCookie(c, 'session')
  const db = createDb(c.env)
  const viewer = token ? await findSessionUser(db, token) : null

  const project = await findProject(db, id, viewer)

  if (!project) {
    return fail(c, 404, 'NOT_FOUND', '找不到這個專案')
  }

  return ok(c, project)
}
