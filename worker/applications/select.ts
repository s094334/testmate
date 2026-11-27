import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, eq, exists, gte } from 'drizzle-orm'
import { createDb, isUniqueViolation, saveTogether, type Db } from '../db'
import { applications, engagements, projects } from '../db/schema'
import { engagementSchema, findEngagement } from '../engagements/lib/engagement'
import { createEngagement } from '../engagements/lib/machine'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { recruitmentStatusOf } from '../projects/lib/project'
import { taiwanToday } from '../projects/lib/today'

export const selectApplicationRoute = createRoute({
  method: 'post',
  path: '/applications/{id}/select',
  middleware: [requireAuth, requireRole('owner')] as const,
  request: {
    params: z.object({ id: z.uuid({ error: '應徵 id 格式錯誤' }) }),
  },
  responses: {
    201: {
      description:
        '建立 PENDING_NDA 的合作；應徵改為 selected，專案改為 closed',
      content: {
        'application/json': {
          schema: z.object({ data: engagementSchema, error: z.null() }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（id 不是 UUID）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: {
      description:
        'FORBIDDEN（不是負責人、不是自己的專案，或 Origin 不是本站）',
    },
    404: { description: 'NOT_FOUND（應徵不存在）' },
    409: {
      description:
        'INVALID_STATE（專案不是招募中，或應徵不是 pending）、RECRUITMENT_ENDED（已過 end_date）',
    },
  },
})

// What the checks before the batch read. Read again when the batch writes
// nothing, to say what changed in between
function findSelection(db: Db, id: string) {
  return db
    .select({
      application: {
        projectId: applications.projectId,
        testerId: applications.testerId,
        status: applications.status,
      },
      project: {
        ownerId: projects.ownerId,
        recruitmentStatus: projects.recruitmentStatus,
        endDate: projects.endDate,
      },
    })
    .from(applications)
    .innerJoin(projects, eq(projects.id, applications.projectId))
    .where(eq(applications.id, id))
}

// The 409 for a selection that cannot be made, or null when it can
function conflictOf({
  application,
  project,
}: Awaited<ReturnType<typeof findSelection>>[number]) {
  if (project.recruitmentStatus !== 'recruiting') {
    return { code: 'INVALID_STATE', message: '這個專案已經停止招募' } as const
  }
  // Still recruiting in the table, but past end_date: the phase 9 job that
  // closes it does not exist yet
  if (recruitmentStatusOf(project) !== 'recruiting') {
    return {
      code: 'RECRUITMENT_ENDED',
      message: '這個專案已經截止招募',
    } as const
  }
  if (application.status !== 'pending') {
    return { code: 'INVALID_STATE', message: '這位應徵者已經不能選定' } as const
  }
  return null
}

export const selectApplication: RouteHandler<
  typeof selectApplicationRoute,
  AuthEnv
> = async (c) => {
  const { id } = c.req.valid('param')
  const user = c.get('user')
  const db = createDb(c.env)

  const [row] = await findSelection(db, id)

  if (!row) {
    return fail(c, 404, 'NOT_FOUND', '找不到這筆應徵')
  }

  if (row.project.ownerId !== user.id) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  const conflict = conflictOf(row)
  if (conflict) return fail(c, 409, conflict.code, conflict.message)

  const { application } = row
  const engagementId = crypto.randomUUID()
  const now = new Date()

  // The checks above are read before the batch, and anything can change in
  // between: a second 選定, a cancel, a decline, the job closing the project.
  // So every write in the batch holds the same conditions. The engagement
  // goes in only if the application is still pending and the project still
  // recruiting and open; the other three only if that engagement is there,
  // which a fresh id can only be when this batch made it. Either all four
  // happen or none: a batch is one transaction
  const selectable = exists(
    db
      .select({ id: applications.id })
      .from(applications)
      .innerJoin(projects, eq(projects.id, applications.projectId))
      .where(
        and(
          eq(applications.id, id),
          eq(applications.status, 'pending'),
          eq(projects.recruitmentStatus, 'recruiting'),
          // The same day recruitmentStatusOf() closes it
          gte(projects.endDate, taiwanToday())
        )
      )
  )
  const created = exists(
    db
      .select({ id: engagements.id })
      .from(engagements)
      .where(eq(engagements.id, engagementId))
  )

  try {
    await saveTogether(db, [
      ...createEngagement(
        db,
        {
          id: engagementId,
          projectId: application.projectId,
          testerId: application.testerId,
          applicationId: id,
        },
        now,
        selectable
      ),
      db
        .update(applications)
        .set({ status: 'selected' })
        .where(
          and(
            eq(applications.id, id),
            eq(applications.status, 'pending'),
            created
          )
        ),
      db
        .update(projects)
        .set({ recruitmentStatus: 'closed' })
        .where(
          and(
            eq(projects.id, application.projectId),
            eq(projects.recruitmentStatus, 'recruiting'),
            created
          )
        ),
    ])
  } catch (err) {
    // The indexes still stop what the conditions cannot see: another
    // engagement on the project that is not CANCELLED, or one already made
    // from this application
    if (
      isUniqueViolation(err, engagements.projectId) ||
      isUniqueViolation(err, engagements.applicationId)
    ) {
      return fail(c, 409, 'INVALID_STATE', '這個專案已經選定人選')
    }
    throw err
  }

  // TODO: expire the project's pending invitation; there is no invitations table yet (phase 8)
  // TODO: email the tester to sign the NDA within 7 days (phase 4 notifier); there is no mailer yet

  const engagement = await findEngagement(db, engagementId)

  // Nothing was written: something changed after the checks above
  if (!engagement) {
    const [latest] = await findSelection(db, id)
    const latestConflict = latest && conflictOf(latest)
    return fail(
      c,
      409,
      latestConflict ? latestConflict.code : 'INVALID_STATE',
      latestConflict ? latestConflict.message : '這位應徵者已經不能選定'
    )
  }

  return ok(c, engagement, 201)
}
