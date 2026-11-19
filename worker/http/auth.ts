import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { findSessionUser, type SessionUser } from '../auth/lib/session'
import { createDb } from '../db'
import { fail } from './response'

// Routes behind requireAuth can read the logged-in user with c.get('user'),
// and the raw cookie token (needed by logout) with c.get('sessionToken')
export type AuthEnv = {
  Bindings: Env
  Variables: { user: SessionUser; sessionToken: string }
}

// Put in a route's `middleware` so it runs before the zod validation:
// API.md wants 401 before 400.
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const token = getCookie(c, 'session')
  const user = token ? await findSessionUser(createDb(c.env), token) : null

  if (!token || !user) {
    return fail(c, 401, 'UNAUTHENTICATED', '請先登入')
  }

  c.set('user', user)
  c.set('sessionToken', token)
  await next()
})

// Always after requireAuth: middleware: [requireAuth, requireRole('owner')]
export const requireRole = (role: SessionUser['role']) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    if (c.get('user').role !== role) {
      return fail(c, 403, 'FORBIDDEN', '沒有權限')
    }
    await next()
  })
