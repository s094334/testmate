import { and, eq, gt, sql } from 'drizzle-orm'
import type { Db } from '../../db'
import { companies, sessions, testerProfiles, users } from '../../db/schema'

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

// The cookie holds the token; the database only keeps its SHA-256,
// so a leaked sessions table cannot be used to log in.
export async function hashToken(token: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(token)
  )
  return toHex(new Uint8Array(digest))
}

// A new 7-day session: `token` goes in the `session` cookie, and `insert` is the
// statement that saves it, not yet run, so signup can batch it with the account
export async function newSession(db: Db, userId: string) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))

  return {
    token,
    insert: db.insert(sessions).values({
      userId,
      tokenHash: await hashToken(token),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }),
  }
}

// Finds who a `session` cookie belongs to, shaped as API.md `User`.
// An expired session is treated the same as no session.
export async function findSessionUser(db: Db, token: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      // A tester has a tester profile, an owner has a company; never both
      display_name: sql<string>`coalesce(${testerProfiles.realName}, ${companies.realName})`,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .leftJoin(testerProfiles, eq(testerProfiles.userId, users.id))
    .leftJoin(companies, eq(companies.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, await hashToken(token)),
        gt(sessions.expiresAt, new Date())
      )
    )

  return user ?? null
}

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof findSessionUser>>
>
