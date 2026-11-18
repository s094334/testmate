import {
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

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
