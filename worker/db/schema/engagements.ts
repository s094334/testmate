import { sql } from 'drizzle-orm'
import {
  check,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { users } from './accounts'
import { applications } from './applications'
import { id, oneOf, timestamp } from './columns'
import { projects } from './projects'

// In the order of the flow. CHECKLIST (the tester writes the test items) is
// P1 and not here.
export const engagementStatuses = [
  'PENDING_NDA',
  'PENDING_PAYMENT',
  'FUNDED',
  'TESTING',
  'SUBMITTED',
  'DISPUTED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
] as const

// Who made a change: one of the two sides, or the deadline job
export const engagementActors = ['owner', 'tester', 'system'] as const

// One tester working on one project, created when the owner chooses an
// application. Its status only changes through the state machine.
// Every point in time the flow needs is here from the start, null until it
// happens, so later phases fill columns instead of adding them.
// Not stored because they can be worked out: nda_signed_at (nda_signatures),
// overdue_decision_due_at (report_overdue_at + 3 days), escrow_balance and
// settlement (the ledger), and when testing started or was completed
// (engagement_events).
export const engagements = sqliteTable(
  'engagements',
  {
    id: id(),
    // restrict, not cascade: payments and ledger entries will point at the
    // engagement, so nothing it hangs from may take it away
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'restrict' }),
    // The tester's user id. restrict for the same reason as projects.owner_id
    testerId: text('tester_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    // The application the owner chose; one engagement at most per application
    applicationId: text('application_id')
      .notNull()
      .unique()
      .references(() => applications.id, { onDelete: 'restrict' }),
    status: text('status', { enum: engagementStatuses }).notNull(),
    // Chosen + 7 days; past it an unsigned engagement is cancelled
    ndaDueAt: timestamp('nda_due_at').notNull(),
    // Signed + 3 days; past it an unpaid engagement is cancelled
    paymentDueAt: timestamp('payment_due_at'),
    // When the payment notice turned it FUNDED
    fundedAt: timestamp('funded_at'),
    // Funded + 7 days; past it without 開始測試, a full refund
    startDueAt: timestamp('start_due_at'),
    // The owner pressed 已提供環境 (the environment itself goes by email)
    environmentProvidedAt: timestamp('environment_provided_at'),
    // 開始測試 + the project's report_days; moved by an extension, and worked
    // out again after a rejection or a dispute's continue
    reportDueAt: timestamp('report_due_at'),
    // Set by the job when report_due_at passes; the report cannot be sent
    // until the owner extends. Cleared by an extension
    reportOverdueAt: timestamp('report_overdue_at'),
    // An engagement can be extended once only, never reset
    deadlineExtended: integer('deadline_extended', { mode: 'boolean' })
      .notNull()
      .default(false),
    // Times the owner sent the report back; one more at 2 starts a dispute
    rejectionCount: integer('rejection_count').notNull().default(0),
    // The later of end_date's last second in Taiwan and sent + 3 days,
    // worked out again on every send; past it the report counts as approved
    reviewDueAt: timestamp('review_due_at'),
    // Completed + 7 days; the ratings are made public then
    ratingDueAt: timestamp('rating_due_at'),
    // When each reminder email went out, so the job sends it only once.
    // An extension clears the report and overdue-decision ones
    startRemindedAt: timestamp('start_reminded_at'),
    reportRemindedAt: timestamp('report_reminded_at'),
    overdueDecisionRemindedAt: timestamp('overdue_decision_reminded_at'),
    reviewRemindedAt: timestamp('review_reminded_at'),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // A project has at most one engagement that is not CANCELLED: choosing
    // twice at the same moment makes the second insert fail. A REFUNDED or
    // COMPLETED one also counts, as the project never recruits again after it.
    // A partial unique index; PostgreSQL has the same (CREATE UNIQUE INDEX … WHERE)
    uniqueIndex('engagements_one_active_per_project')
      .on(table.projectId)
      .where(sql`${table.status} <> 'CANCELLED'`),
    check('engagements_status_values', oneOf(table.status, engagementStatuses)),
    check(
      'engagements_rejection_count_not_negative',
      sql`${table.rejectionCount} >= 0`
    ),
  ]
)

// One row per change of an engagement, written in the same batch as the
// change itself. from_status is null for the row made when it was created.
export const engagementEvents = sqliteTable(
  'engagement_events',
  {
    id: id(),
    // cascade: the rows only describe their engagement
    engagementId: text('engagement_id')
      .notNull()
      .references(() => engagements.id, { onDelete: 'cascade' }),
    fromStatus: text('from_status', { enum: engagementStatuses }),
    // The same as from_status for a change that keeps the status,
    // such as 已提供環境 or an extension
    toStatus: text('to_status', { enum: engagementStatuses }).notNull(),
    actor: text('actor', { enum: engagementActors }).notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    check(
      'engagement_events_from_status_values',
      oneOf(table.fromStatus, engagementStatuses)
    ),
    check(
      'engagement_events_to_status_values',
      oneOf(table.toStatus, engagementStatuses)
    ),
    check(
      'engagement_events_actor_values',
      oneOf(table.actor, engagementActors)
    ),
  ]
)

// The tester signing the NDA of one engagement. The text of both documents
// (受測者同意書 and 保密協議) lives in the frontend; one press of 同意並簽署
// signs both, so one row records it.
export const ndaSignatures = sqliteTable('nda_signatures', {
  id: id(),
  // restrict: a signature is a record that has to stay
  engagementId: text('engagement_id')
    .notNull()
    .unique()
    .references(() => engagements.id, { onDelete: 'restrict' }),
  // The tester's user id. restrict for the same reason as projects.owner_id
  testerId: text('tester_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  // Which version of the frontend's text was signed, e.g. '2026-1'
  version: text('version').notNull(),
  signedAt: timestamp('signed_at')
    .notNull()
    .$defaultFn(() => new Date()),
})
