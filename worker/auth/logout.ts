import { createRoute, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { deleteCookie } from 'hono/cookie'
import { createDb } from '../db'
import { sessions } from '../db/schema'
import { requireAuth, type AuthEnv } from '../http/auth'
import { hashToken } from './lib/session'

export const logoutRoute = createRoute({
  method: 'post',
  path: '/auth/logout',
  middleware: [requireAuth] as const,
  responses: {
    204: { description: '登出成功，並清除 session cookie' },
    401: { description: 'UNAUTHENTICATED（未登入）' },
    403: { description: 'FORBIDDEN（Origin 不是本站）' },
  },
})

// Only this device's session is deleted; other devices stay logged in
export const logout: RouteHandler<typeof logoutRoute, AuthEnv> = async (c) => {
  const db = createDb(c.env)

  await db
    .delete(sessions)
    .where(eq(sessions.tokenHash, await hashToken(c.get('sessionToken'))))

  // path and secure must match the ones used when the cookie was set,
  // or the browser keeps it
  deleteCookie(c, 'session', { path: '/', secure: true })

  return c.body(null, 204)
}
