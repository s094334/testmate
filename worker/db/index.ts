import { getTableColumns, getTableName, is, SQL, sql } from 'drizzle-orm'
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

// INSERT … SELECT … WHERE: the row goes in only if `condition` holds when the
// statement runs, so in a batch an insert can depend on the statements before
// it, as a conditional UPDATE does. A SELECT with WHERE and no FROM runs on
// PostgreSQL too. Missing values get their defaults, as .values() gives them
export function insertWhere<T extends SQLiteTable>(
  db: Db,
  table: T,
  row: SQLiteInsertValue<T>,
  condition: SQL
) {
  const values = Object.entries(getTableColumns(table))
    // Generated columns are left out of the column list drizzle writes
    .filter(([, column]) => !column.generated)
    .map(([key, column]) => {
      const value = (row as Record<string, unknown>)[key]
      if (is(value, SQL)) return value
      if (value !== undefined) return sql.param(value, column)
      if (column.default !== undefined) {
        return is(column.default, SQL)
          ? column.default
          : sql.param(column.default, column)
      }
      if (column.defaultFn) return sql.param(column.defaultFn(), column)
      if (column.onUpdateFn) return sql.param(column.onUpdateFn(), column)
      return sql`null`
    })

  return db
    .insert(table)
    .select(sql`select ${sql.join(values, sql`, `)} where ${condition}`)
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
