import { getTableColumns, getTableName } from 'drizzle-orm'
import type { BatchItem } from 'drizzle-orm/batch'
import { drizzle } from 'drizzle-orm/d1'
import type {
  SQLiteColumn,
  SQLiteInsertValue,
  SQLiteTable,
} from 'drizzle-orm/sqlite-core'

export function createDb(env: Env) {
  return drizzle(env.DB)
}

export type Db = ReturnType<typeof createDb>

// D1 has no interactive transaction: each statement sent on its own commits
// at once, so db.transaction() is not used. A batch runs as one transaction
// instead: every statement is saved, or none is.
// Nothing can be read in the middle, so ids that later statements point at
// are made in code beforehand.
export async function saveTogether(db: Db, statements: BatchItem<'sqlite'>[]) {
  const [first, ...rest] = statements
  if (first) await db.batch([first, ...rest])
}

// Insert statements for a list of rows, none of them over D1's limit of
// 100 bound parameters (one per column per row). An empty list gives none.
export function insertRows<T extends SQLiteTable>(
  db: Db,
  table: T,
  rows: SQLiteInsertValue<T>[]
) {
  const size = Math.floor(100 / Object.keys(getTableColumns(table)).length)
  return Array.from({ length: Math.ceil(rows.length / size) }, (_, i) =>
    db.insert(table).values(rows.slice(i * size, (i + 1) * size))
  )
}

// D1 errors have no error code or constraint name, only a message such as
// "UNIQUE constraint failed: users.email: SQLITE_CONSTRAINT". A failed batch
// throws the D1 error itself; a single query wraps it in DrizzleQueryError.cause.
export function isUniqueViolation(err: unknown, column: SQLiteColumn) {
  return [err, err instanceof Error ? err.cause : null].some(
    (e) =>
      e instanceof Error &&
      e.message.includes(
        `UNIQUE constraint failed: ${getTableName(column.table)}.${column.name}`
      )
  )
}
