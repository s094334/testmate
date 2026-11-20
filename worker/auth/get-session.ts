import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { avatarShapes } from '../../shared/avatar-shapes'
import { requireAuth, type AuthEnv } from '../http/auth'
import { ok } from '../http/response'

export const getSessionRoute = createRoute({
  method: 'get',
  path: '/auth/session',
  middleware: [requireAuth] as const,
  responses: {
    200: {
      description: '目前登入者',
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
    // The frontend reads this as "visitor", not as "go to the login page"
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
  },
})

export const getSession: RouteHandler<typeof getSessionRoute, AuthEnv> = (c) =>
  ok(c, c.get('user'))
