import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['owner', 'tester'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  passwordSalt: text('password_salt').notNull(),
  passwordIterations: integer('password_iterations').notNull(),
  role: role('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Failed logins in a row for one email from one IP. The row is deleted on a successful login.
// The email does not have to belong to an account, so a guess at an unknown email is counted too.
export const loginAttempts = pgTable(
  'login_attempts',
  {
    // Lowercased, the same as users.email
    email: text('email').notNull(),
    // From the CF-Connecting-IP header
    ip: text('ip').notNull(),
    failedCount: integer('failed_count').notNull().default(0),
    // Set when failedCount reaches 10; failedCount starts again from 0 at the same time
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.email, table.ip] })]
)

// Each time a user ticks 「我已閱讀並同意爭議處理流程」 (only at signup for now)
export const disputeAgreements = pgTable('dispute_agreements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  agreedAt: timestamp('agreed_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
