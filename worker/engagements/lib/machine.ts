// engagementMachine: the only place that writes engagements.status.
// Each transition says the status it starts from, the side that may ask for
// it and the status it ends in, as in PRD's table of transitions.
import { and, eq, exists, gt, type SQL } from 'drizzle-orm'
import type { BatchItem } from 'drizzle-orm/batch'
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { insertWhere, isUniqueViolation, saveTogether, type Db } from '../../db'
import {
  engagementEvents,
  engagements,
  ndaSignatures,
  type engagementStatuses,
} from '../../db/schema'
import { findEngagement } from './engagement'
import { findParties, sideOf, type Side } from './parties'

type EngagementStatus = (typeof engagementStatuses)[number]
type EngagementRow = typeof engagements.$inferSelect

const day = 24 * 60 * 60 * 1000

type Transition = {
  from: EngagementStatus
  to: EngagementStatus
  by: Side
  // The 409 message when the status is not `from`
  notAllowed: string
  // A deadline the transition must come before; from that moment the
  // deadline job (phase 9) takes the engagement elsewhere
  before?: { column: 'ndaDueAt'; passed: string }
  // Columns changed along with the status
  set?: (now: Date) => Partial<typeof engagements.$inferInsert>
  // Other rows written in the same batch. Each one has to hold `happened`,
  // so it is written only when the transition is
  alsoWrite?: (args: {
    db: Db
    engagement: EngagementRow
    now: Date
    happened: SQL
  }) => BatchItem<'sqlite'>[]
  // Unique columns among those rows: a clash is a 409, not a 500
  uniqueColumns?: SQLiteColumn[]
}

export const transitions = {
  signNda: {
    from: 'PENDING_NDA',
    to: 'PENDING_PAYMENT',
    by: 'tester',
    notAllowed: '這筆合作目前不能簽署保密協議',
    before: { column: 'ndaDueAt', passed: '已經超過簽署期限' },
    set: (now) => ({ paymentDueAt: new Date(now.getTime() + 3 * day) }),
    alsoWrite: ({ db, engagement, now, happened }) => [
      insertWhere(
        db,
        ndaSignatures,
        {
          engagementId: engagement.id,
          testerId: engagement.testerId,
          // The text is in the frontend (src/pages/TesterNdaPage/); change
          // this along with it. Only stored, the API never returns it
          version: '2026-1',
          signedAt: now,
        },
        happened
      ),
    ],
    uniqueColumns: [ndaSignatures.engagementId],
  },
} satisfies Record<string, Transition>

function conflictOf(
  transition: Transition,
  engagement: EngagementRow,
  now: Date
) {
  if (engagement.status !== transition.from) return transition.notAllowed
  if (
    transition.before &&
    engagement[transition.before.column].getTime() <= now.getTime()
  ) {
    return transition.before.passed
  }
  return null
}

function refused(
  status: 403 | 404 | 409,
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'INVALID_STATE',
  message: string
) {
  return { error: { status, code, message } }
}

// Gives the engagement after the transition, or the error to answer with
export async function runTransition(
  db: Db,
  transition: Transition,
  id: string,
  userId: string
) {
  const now = new Date()
  const parties = await findParties(db, id)

  if (!parties) return refused(404, 'NOT_FOUND', '找不到這筆合作')
  if (sideOf(parties, userId) !== transition.by) {
    return refused(403, 'FORBIDDEN', '沒有權限')
  }

  const conflict = conflictOf(transition, parties.engagement, now)
  if (conflict) return refused(409, 'INVALID_STATE', conflict)

  // The check above is read before the batch, and the status can change in
  // between: a second press, the deadline job. So the event goes first, only
  // if the engagement is still as checked; every other write holds that the
  // event is there, which a fresh id can only be when this batch wrote it.
  // Either all of them happen or none: a batch is one transaction
  const eventId = crypto.randomUUID()
  const happened = exists(
    db
      .select({ id: engagementEvents.id })
      .from(engagementEvents)
      .where(eq(engagementEvents.id, eventId))
  )

  try {
    await saveTogether(db, [
      insertWhere(
        db,
        engagementEvents,
        {
          id: eventId,
          engagementId: id,
          fromStatus: transition.from,
          toStatus: transition.to,
          actor: transition.by,
          createdAt: now,
        },
        exists(
          db
            .select({ id: engagements.id })
            .from(engagements)
            .where(
              and(
                eq(engagements.id, id),
                eq(engagements.status, transition.from),
                transition.before &&
                  gt(engagements[transition.before.column], now)
              )
            )
        )
      ),
      ...(transition.alsoWrite?.({
        db,
        engagement: parties.engagement,
        now,
        happened,
      }) ?? []),
      db
        .update(engagements)
        .set({
          ...transition.set?.(now),
          status: transition.to,
          updatedAt: now,
        })
        .where(
          and(
            eq(engagements.id, id),
            eq(engagements.status, transition.from),
            happened
          )
        ),
    ])
  } catch (err) {
    if (
      transition.uniqueColumns?.some((column) => isUniqueViolation(err, column))
    ) {
      return refused(409, 'INVALID_STATE', transition.notAllowed)
    }
    throw err
  }

  const [event] = await db
    .select({ id: engagementEvents.id })
    .from(engagementEvents)
    .where(eq(engagementEvents.id, eventId))

  // Nothing was written: something changed after the check above
  if (!event) {
    const latest = await findParties(db, id)
    return refused(
      409,
      'INVALID_STATE',
      (latest && conflictOf(transition, latest.engagement, now)) ||
        transition.notAllowed
    )
  }

  const engagement = await findEngagement(db, id)
  if (!engagement) throw new Error(`Engagement ${id} disappeared`)
  return { engagement }
}

// Choosing an application (API.md 17) makes the engagement, so its first
// status and event come from here too. Both are written only if `condition`
// holds; the caller adds its own writes to the same batch
export function createEngagement(
  db: Db,
  engagement: Pick<
    typeof engagements.$inferInsert,
    'id' | 'projectId' | 'testerId' | 'applicationId'
  > & { id: string },
  now: Date,
  condition: SQL
) {
  return [
    insertWhere(
      db,
      engagements,
      {
        ...engagement,
        status: 'PENDING_NDA',
        ndaDueAt: new Date(now.getTime() + 7 * day),
        createdAt: now,
        updatedAt: now,
      },
      condition
    ),
    insertWhere(
      db,
      engagementEvents,
      {
        engagementId: engagement.id,
        fromStatus: null,
        toStatus: 'PENDING_NDA',
        actor: 'owner',
        createdAt: now,
      },
      exists(
        db
          .select({ id: engagements.id })
          .from(engagements)
          .where(eq(engagements.id, engagement.id))
      )
    ),
  ]
}
