import {
  check,
  integer,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'
import { id, oneOf } from './columns'

// GET /api/tags lists the categories in this order
export const tagCategories = [
  'device',
  'industry',
  'interest',
  'audience',
] as const

// Fixed list chosen by users, never created by them. Rows come from the seed
// migration, which gives each one a fixed id.
export const tags = sqliteTable(
  'tags',
  {
    id: id(),
    category: text('category', { enum: tagCategories }).notNull(),
    name: text('name').notNull(),
    // GET /api/tags returns each category in this order
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    unique().on(table.category, table.name),
    check('tags_category_values', oneOf(table.category, tagCategories)),
  ]
)
