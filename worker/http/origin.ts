import { createMiddleware } from 'hono/factory'
import { fail } from './response'

export const checkOrigin = createMiddleware(async (c, next) => {
  if (
    (c.req.method === 'POST' || c.req.method === 'PUT') &&
    c.req.header('Origin') !== new URL(c.req.url).origin
  ) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }
  await next()
})
