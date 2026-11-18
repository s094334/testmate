import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { createDb } from '../db'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findTesterProfile, testerProfileSchema } from './lib/profile'

export const getProfileRoute = createRoute({
  method: 'get',
  path: '/auth/profile',
  middleware: [requireAuth, requireRole('tester')] as const,
  responses: {
    200: {
      description: '目前登入的測試人員的檔案',
      content: {
        'application/json': {
          schema: z.object({ data: testerProfileSchema, error: z.null() }),
        },
      },
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是測試人員）' },
    404: { description: 'NOT_FOUND（還沒建立檔案）' },
  },
})

export const getProfile: RouteHandler<typeof getProfileRoute, AuthEnv> = async (
  c
) => {
  const profile = await findTesterProfile(await createDb(c.env), c.get('user'))

  if (!profile) {
    return fail(c, 404, 'NOT_FOUND', '還沒建立檔案')
  }

  return ok(c, profile)
}
