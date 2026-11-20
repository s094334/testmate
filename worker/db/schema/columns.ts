import { sql } from 'drizzle-orm'
import { integer, text, type SQLiteColumn } from 'drizzle-orm/sqlite-core'

// A uuid string made in code. SQLite has no uuid type, and a batch has to know
// a row's id before the row is written so the next statements can point at it.
export const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())

// Every point in time is stored as UTC milliseconds since 1970 (an integer);
// code reads and writes it as a Date
export const timestamp = (name: string) =>
  integer(name, { mode: 'timestamp_ms' })

// The check behind a column limited to a list of values (an enum type in PostgreSQL).
// The values are written into the SQL: a check in CREATE TABLE cannot take parameters.
export const oneOf = (column: SQLiteColumn, values: readonly string[]) =>
  sql`${column} in (${sql.raw(values.map((value) => `'${value}'`).join(', '))})`
