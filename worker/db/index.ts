import { Client } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

// One client per request; Hyperdrive keeps the real pool to Postgres.
export async function createDb(env: Env) {
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  })
  await client.connect()
  return drizzle(client)
}

export type Db = Awaited<ReturnType<typeof createDb>>

// What db.transaction() hands to its callback
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
