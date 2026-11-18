import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { users } from './accounts'
import { tags } from './tags'

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
