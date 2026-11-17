import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

// One connection per request; Hyperdrive keeps the real pool to Postgres.
export function createDb(env: Env) {
  return drizzle(postgres(env.HYPERDRIVE.connectionString))
}

export type Db = ReturnType<typeof createDb>

// What db.transaction() hands to its callback
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
