import type { Db, Tx } from '../db'
import { sessions } from '../db/schema'

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

// Saves a new 7-day session and returns the token to put in the `session` cookie
export async function createSession(db: Db | Tx, userId: string) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))

  await db.insert(sessions).values({
    userId,
    tokenHash: await hashToken(token),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  return token
}
