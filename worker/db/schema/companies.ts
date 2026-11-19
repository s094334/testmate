import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './accounts'
import { timestamp } from './columns'
import { tags } from './tags'

// One per owner, created at signup, edited later with PUT /api/auth/company
export const companies = sqliteTable('companies', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  // The owner's own name and phone, not the company's
  realName: text('real_name').notNull(),
  phone: text('phone').notNull(),
  // Company name
  name: text('name').notNull(),
  taxId: text('tax_id'),
  // A tag in the industry category
  industryTagId: text('industry_tag_id')
    .notNull()
    .references(() => tags.id),
  address: text('address').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})
