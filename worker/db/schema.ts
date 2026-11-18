import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
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

export const tagCategory = pgEnum('tag_category', [
  'device',
  'industry',
  'interest',
  'audience',
])

// Fixed list chosen by users, never created by them. Rows come from seed migrations.
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    category: tagCategory('category').notNull(),
    name: text('name').notNull(),
    // GET /api/tags returns each category in this order
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [unique().on(table.category, table.name)]
)

// One per tester, created at signup with real_name, phone and city.
// The rest is filled in later with PUT /api/auth/profile.
export const testerProfiles = pgTable('tester_profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  realName: text('real_name').notNull(),
  // 10 digits starting with 09, dashes and spaces already removed
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  hasQaExperience: boolean('has_qa_experience').notNull().default(false),
  experiences: jsonb('experiences')
    .$type<{ company: string; years: number }[]>()
    .notNull()
    .default([]),
  // The sum of experiences[].years, written on every save so SQL can use it
  // (match_score in phase 8). Profiles saved before experiences existed keep
  // their old value until the next save.
  qaYears: integer('qa_years').notNull().default(0),
  languages: jsonb('languages')
    .$type<{ name: string; native: boolean }[]>()
    .notNull()
    .default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// A tester's tags (the tag's own category says which). PUT /api/auth/profile
// now only saves interest tags; industry and audience rows saved earlier are kept.
export const testerProfileTags = pgTable(
  'tester_profile_tags',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => testerProfiles.userId, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tagId] })]
)

// Either a listed device (tag, brand, os_version, model optional) or a custom one
// (custom_name, os_version optional); the check keeps the two from mixing
export const testerDevices = pgTable(
  'tester_devices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => testerProfiles.userId, { onDelete: 'cascade' }),
    // A tag in the device category
    deviceTagId: uuid('device_tag_id').references(() => tags.id),
    brand: text('brand'),
    model: text('model'),
    osVersion: text('os_version'),
    customName: text('custom_name'),
    // Position in the list the tester sent, so GET returns them in that order
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [
    check(
      'tester_devices_listed_or_custom',
      sql`(${table.deviceTagId} is not null and ${table.brand} is not null and ${table.osVersion} is not null and ${table.customName} is null)
        or (${table.deviceTagId} is null and ${table.brand} is null and ${table.model} is null and ${table.customName} is not null)`
    ),
  ]
)

// One per owner, created at signup, edited later with PUT /api/auth/company
export const companies = pgTable('companies', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  // The owner's own name and phone, not the company's
  realName: text('real_name').notNull(),
  phone: text('phone').notNull(),
  // Company name
  name: text('name').notNull(),
  taxId: text('tax_id'),
  // A tag in the industry category
  industryTagId: uuid('industry_tag_id')
    .notNull()
    .references(() => tags.id),
  address: text('address').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

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
