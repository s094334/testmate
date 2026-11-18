import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
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

export const recruitmentStatus = pgEnum('recruitment_status', [
  'recruiting',
  'closed',
  'cancelled',
])

export const testMode = pgEnum('test_mode', ['remote', 'onsite'])

// The options of 最低年資 on the 發布專案 form
export const minQaYears = pgEnum('min_qa_years', [
  'under_1',
  '1_to_2',
  '3_to_5',
  'over_5',
])

// Never edited after POST /api/projects. The industry is not stored:
// it is always read from the owner's company, so it follows company edits.
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // restrict, not cascade: payments and ledger entries will point at the project,
    // so deleting the owner's account must not take the project with it
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    name: text('name').notNull(),
    summary: text('summary').notNull(),
    // native_required: the tester has to be a native speaker of it
    languages: jsonb('languages')
      .$type<{ name: string; native_required: boolean }[]>()
      .notNull(),
    qaExperienceRequired: boolean('qa_experience_required').notNull(),
    minQaYears: minQaYears('min_qa_years'),
    testMode: testMode('test_mode').notNull(),
    testCity: text('test_city'),
    // Dates in Taiwan time, no time of day
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    // NT$, whole dollars
    reward: integer('reward').notNull(),
    // Days the tester has to hand in the report, counted from 開始測試 (or a rejection or extension)
    reportDays: integer('report_days').notNull(),
    howToTest: text('how_to_test').notNull(),
    successCriteria: text('success_criteria').notNull(),
    specialRequirements: text('special_requirements'),
    recruitmentStatus: recruitmentStatus('recruitment_status')
      .notNull()
      .default('recruiting'),
    // Confidential, like project_test_items. Optional until the form has a step for them.
    confidentialDetails: text('confidential_details'),
    environmentInfo: text('environment_info'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check('projects_reward_range', sql`${table.reward} between 1 and 100000`),
    check(
      'projects_report_days_range',
      sql`${table.reportDays} between 1 and 60`
    ),
    check(
      'projects_min_qa_years_only_with_experience',
      sql`(${table.minQaYears} is not null) = ${table.qaExperienceRequired}`
    ),
    check(
      'projects_test_city_only_onsite',
      sql`(${table.testCity} is not null) = (${table.testMode} = 'onsite')`
    ),
    check(
      'projects_end_date_after_start_date',
      sql`${table.endDate} >= ${table.startDate}`
    ),
  ]
)

// Like tester_devices: a listed device (tag, brand, min_os_version; no model means
// any model of the brand) or a custom one (custom_name, min_os_version optional)
export const projectDevices = pgTable(
  'project_devices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    // A tag in the device category
    deviceTagId: uuid('device_tag_id').references(() => tags.id),
    brand: text('brand'),
    model: text('model'),
    minOsVersion: text('min_os_version'),
    customName: text('custom_name'),
    // Position in the list the owner sent
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    check(
      'project_devices_listed_or_custom',
      sql`(${table.deviceTagId} is not null and ${table.brand} is not null and ${table.minOsVersion} is not null and ${table.customName} is null)
        or (${table.deviceTagId} is null and ${table.brand} is null and ${table.model} is null and ${table.customName} is not null)`
    ),
  ]
)

// A project's tags (the tag's own category says which); only interest tags for now
export const projectTags = pgTable(
  'project_tags',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.tagId] })]
)

// Confidential: shown to the tester only after payment is in escrow.
// A project can have none until the form has a step for them.
export const projectTestItems = pgTable('project_test_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  steps: text('steps').notNull(),
  expected: text('expected').notNull(),
  // Position in the list the owner sent
  sortOrder: integer('sort_order').notNull(),
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
