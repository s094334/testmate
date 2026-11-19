import { sql } from 'drizzle-orm'
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
import { users } from './accounts'
import { id, oneOf, timestamp } from './columns'
import { tags } from './tags'

export const recruitmentStatuses = [
  'recruiting',
  'closed',
  'cancelled',
] as const

export const testModes = ['remote', 'onsite'] as const

// The options of 最低年資 on the 發布專案 form
export const minQaYearsOptions = [
  'under_1',
  '1_to_2',
  '3_to_5',
  'over_5',
] as const

// Never edited after POST /api/projects. The industry is not stored:
// it is always read from the owner's company, so it follows company edits.
export const projects = sqliteTable(
  'projects',
  {
    id: id(),
    // restrict, not cascade: payments and ledger entries will point at the project,
    // so deleting the owner's account must not take the project with it
    ownerId: text('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    name: text('name').notNull(),
    summary: text('summary').notNull(),
    // native_required: the tester has to be a native speaker of it
    languages: text('languages', { mode: 'json' })
      .$type<{ name: string; native_required: boolean }[]>()
      .notNull(),
    qaExperienceRequired: integer('qa_experience_required', {
      mode: 'boolean',
    }).notNull(),
    minQaYears: text('min_qa_years', { enum: minQaYearsOptions }),
    testMode: text('test_mode', { enum: testModes }).notNull(),
    testCity: text('test_city'),
    // Dates in Taiwan time, no time of day, written as YYYY-MM-DD
    // (so comparing the text compares the dates)
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    // NT$, whole dollars
    reward: integer('reward').notNull(),
    // Days the tester has to hand in the report, counted from 開始測試 (or a rejection or extension)
    reportDays: integer('report_days').notNull(),
    howToTest: text('how_to_test').notNull(),
    successCriteria: text('success_criteria').notNull(),
    specialRequirements: text('special_requirements'),
    recruitmentStatus: text('recruitment_status', {
      enum: recruitmentStatuses,
    })
      .notNull()
      .default('recruiting'),
    // Confidential, like project_test_items. Optional until the form has a step for them.
    confidentialDetails: text('confidential_details'),
    environmentInfo: text('environment_info'),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
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
    check(
      'projects_min_qa_years_values',
      oneOf(table.minQaYears, minQaYearsOptions)
    ),
    check('projects_test_mode_values', oneOf(table.testMode, testModes)),
    check(
      'projects_recruitment_status_values',
      oneOf(table.recruitmentStatus, recruitmentStatuses)
    ),
  ]
)

// Like tester_devices: a listed device (tag, brand, min_os_version; no model means
// any model of the brand) or a custom one (custom_name, min_os_version optional)
export const projectDevices = sqliteTable(
  'project_devices',
  {
    id: id(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    // A tag in the device category
    deviceTagId: text('device_tag_id').references(() => tags.id),
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
export const projectTags = sqliteTable(
  'project_tags',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.tagId] })]
)

// Confidential: shown to the tester only after payment is in escrow.
// A project can have none until the form has a step for them.
export const projectTestItems = sqliteTable('project_test_items', {
  id: id(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  steps: text('steps').notNull(),
  expected: text('expected').notNull(),
  // Position in the list the owner sent
  sortOrder: integer('sort_order').notNull(),
})
