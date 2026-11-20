import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
import { avatarShapes } from '../../../shared/avatar-shapes'
import { id, oneOf, timestamp } from './columns'

export const roles = ['owner', 'tester'] as const

export const users = sqliteTable(
  'users',
  {
    id: id(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    passwordSalt: text('password_salt').notNull(),
    passwordIterations: integer('password_iterations').notNull(),
    role: text('role', { enum: roles }).notNull(),
    // Picked at random at signup. No check constraint: adding one rebuilds the table,
    // and on D1 dropping the old users table cascades to every profile and session.
    // The default only fills accounts made before this column existed.
    avatarShape: text('avatar_shape', { enum: avatarShapes })
      .notNull()
      .default('sparkle'),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [check('users_role_values', oneOf(table.role, roles))]
)

export const sessions = sqliteTable('sessions', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
})

// Failed logins in a row for one email from one IP. The row is deleted on a successful login.
// The email does not have to belong to an account, so a guess at an unknown email is counted too.
export const loginAttempts = sqliteTable(
  'login_attempts',
  {
    // Lowercased, the same as users.email
    email: text('email').notNull(),
    // From the CF-Connecting-IP header
    ip: text('ip').notNull(),
    failedCount: integer('failed_count').notNull().default(0),
    // Set when failedCount reaches 10; failedCount starts again from 0 at the same time
    lockedUntil: timestamp('locked_until'),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.email, table.ip] })]
)

// Each time a user ticks 「我已閱讀並同意爭議處理流程」 (only at signup for now)
export const disputeAgreements = sqliteTable('dispute_agreements', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  agreedAt: timestamp('agreed_at')
    .notNull()
    .$defaultFn(() => new Date()),
})
