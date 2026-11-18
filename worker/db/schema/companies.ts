import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './accounts'
import { tags } from './tags'

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
