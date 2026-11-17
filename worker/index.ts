import { Hono } from 'hono'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'

const app = new Hono<{ Bindings: Env }>().basePath('/api')

app.get('/health', async (c) => {
  const db = drizzle(postgres(c.env.HYPERDRIVE.connectionString))
  await db.execute(sql`select 1`)
  return c.json({ ok: true, db: true })
})

export default app
