import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, eq, sql } from 'drizzle-orm'
import { setCookie } from 'hono/cookie'
import { createDb } from '../db'
import { companies, loginAttempts, testerProfiles, users } from '../db/schema'
import { fail, ok } from '../http/response'
import { hashPassword, verifyPassword } from './password'
import { createSession } from './session'

const loginBody = z.object({
  email: z
    .string({ error: '請輸入 Email' })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Email 格式錯誤' })),
  // Only checks that a password was sent. The signup rules (8–128, letters and digits)
  // are left out, so an account made under older rules can still log in.
  password: z.string({ error: '請輸入密碼' }).min(1, '請輸入密碼'),
})

export const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: loginBody } },
    },
  },
  responses: {
    200: {
      description: '登入成功，並設定 session cookie',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              id: z.uuid(),
              email: z.string(),
              role: z.enum(['owner', 'tester']),
              display_name: z.string(),
            }),
            error: z.null(),
          }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED' },
    401: { description: 'INVALID_CREDENTIALS（email 不存在或密碼錯誤）' },
    403: { description: 'FORBIDDEN（Origin 不是本站）' },
    429: { description: 'TOO_MANY_ATTEMPTS，帶 Retry-After header（秒）' },
  },
})

export const login: RouteHandler<typeof loginRoute, { Bindings: Env }> = async (
  c
) => {
  const body = c.req.valid('json')
  const db = await createDb(c.env)
  // Cloudflare always sets this header; local wrangler dev may not
  const ip = c.req.header('CF-Connecting-IP') ?? 'local'

  // Locked: 429 even when the password is right
  const [attempt] = await db
    .select({ lockedUntil: loginAttempts.lockedUntil })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.email, body.email), eq(loginAttempts.ip, ip)))

  if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) {
    c.header(
      'Retry-After',
      String(Math.ceil((attempt.lockedUntil.getTime() - Date.now()) / 1000))
    )
    return fail(
      c,
      429,
      'TOO_MANY_ATTEMPTS',
      '登入失敗次數過多，請 15 分鐘後再試'
    )
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      passwordHash: users.passwordHash,
      passwordSalt: users.passwordSalt,
      passwordIterations: users.passwordIterations,
      // A tester has a tester profile, an owner has a company; never both
      displayName: sql<string>`coalesce(${testerProfiles.realName}, ${companies.realName})`,
    })
    .from(users)
    .leftJoin(testerProfiles, eq(testerProfiles.userId, users.id))
    .leftJoin(companies, eq(companies.userId, users.id))
    .where(eq(users.email, body.email))

  // No such email: hash once anyway, so the reply takes as long as a wrong password
  // and the response time does not tell whether the email is registered
  if (!user) {
    await hashPassword(body.password)
  }

  // Wrong email or password: count the failure; the 10th in a row locks for 15 minutes
  if (
    !user ||
    !(await verifyPassword(body.password, {
      hash: user.passwordHash,
      salt: user.passwordSalt,
      iterations: user.passwordIterations,
    }))
  ) {
    const [{ failedCount }] = await db
      .insert(loginAttempts)
      .values({ email: body.email, ip, failedCount: 1 })
      .onConflictDoUpdate({
        target: [loginAttempts.email, loginAttempts.ip],
        set: {
          failedCount: sql`${loginAttempts.failedCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ failedCount: loginAttempts.failedCount })

    if (failedCount >= 10) {
      // Counting starts again from 0 once the lock is over
      await db
        .update(loginAttempts)
        .set({
          failedCount: 0,
          lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
        })
        .where(
          and(eq(loginAttempts.email, body.email), eq(loginAttempts.ip, ip))
        )
    }

    return fail(c, 401, 'INVALID_CREDENTIALS', 'Email 或密碼錯誤')
  }

  // Right password: forget the failures and start a new session.
  // Sessions on other devices are left as they are.
  await db
    .delete(loginAttempts)
    .where(and(eq(loginAttempts.email, body.email), eq(loginAttempts.ip, ip)))

  setCookie(c, 'session', await createSession(db, user.id), {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return ok(c, {
    id: user.id,
    email: user.email,
    role: user.role,
    display_name: user.displayName,
  })
}
