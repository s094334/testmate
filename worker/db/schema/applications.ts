import { check, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { users } from './accounts'
import { id, oneOf, timestamp } from './columns'
import { projects } from './projects'

// applied: the tester pressed 申請; invited: made by accepting an invitation
export const applicationSources = ['applied', 'invited'] as const

// Other applicants stay pending when someone is chosen. A chosen one turns
// declined if the engagement is cancelled before payment.
export const applicationStatuses = ['pending', 'selected', 'declined'] as const

// A tester saying they want to work on a project (POST /api/applications)
export const applications = sqliteTable(
  'applications',
  {
    id: id(),
    // restrict, not cascade: engagements point at the application, and
    // payments will point at the engagement
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'restrict' }),
    // The tester's user id. restrict for the same reason as projects.owner_id
    testerId: text('tester_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    source: text('source', { enum: applicationSources }).notNull(),
    status: text('status', { enum: applicationStatuses })
      .notNull()
      .default('pending'),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // A tester applies to a project once, ever: a declined application
    // cannot be sent again (409 ALREADY_APPLIED)
    unique().on(table.projectId, table.testerId),
    check(
      'applications_source_values',
      oneOf(table.source, applicationSources)
    ),
    check(
      'applications_status_values',
      oneOf(table.status, applicationStatuses)
    ),
  ]
)
