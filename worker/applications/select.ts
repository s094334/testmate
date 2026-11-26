import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { createDb, isUniqueViolation, saveTogether } from '../db'
import {
  applications,
  engagementEvents,
  engagements,
  projects,
} from '../db/schema'
import { engagementSchema, findEngagement } from '../engagements/lib/engagement'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { recruitmentStatusOf } from '../projects/lib/project'

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

export const selectApplication: RouteHandler<
  typeof selectApplicationRoute,
  AuthEnv
> = async (c) => {
  const { id } = c.req.valid('param')
  const user = c.get('user')
  const db = createDb(c.env)

  const [row] = await db
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

  if (!row) {
    return fail(c, 404, 'NOT_FOUND', '找不到這筆應徵')
  }

  const { application, project } = row

  if (project.ownerId !== user.id) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  if (project.recruitmentStatus !== 'recruiting') {
    return fail(c, 409, 'INVALID_STATE', '這個專案已經停止招募')
  }

  // Still recruiting in the table, but past end_date: the phase 9 job that
  // closes it does not exist yet
  if (recruitmentStatusOf(project) !== 'recruiting') {
    return fail(c, 409, 'RECRUITMENT_ENDED', '這個專案已經截止招募')
  }

  if (application.status !== 'pending') {
    return fail(c, 409, 'INVALID_STATE', '這位應徵者已經不能選定')
  }

  const engagementId = crypto.randomUUID()
  const now = new Date()

  // The checks above are read before the batch, so two presses at once can
  // both pass them. The unique indexes on engagements stop the second one:
  // one engagement that is not CANCELLED per project, one per application.
  // A failed insert rolls the whole batch back
  try {
    await saveTogether(db, [
      db.insert(engagements).values({
        id: engagementId,
        projectId: application.projectId,
        testerId: application.testerId,
        applicationId: id,
        status: 'PENDING_NDA',
        ndaDueAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      }),
      db.insert(engagementEvents).values({
        engagementId,
        fromStatus: null,
        toStatus: 'PENDING_NDA',
        actor: 'owner',
        createdAt: now,
      }),
      db
        .update(applications)
        .set({ status: 'selected' })
        .where(eq(applications.id, id)),
      db
        .update(projects)
        .set({ recruitmentStatus: 'closed' })
        .where(eq(projects.id, application.projectId)),
    ])
  } catch (err) {
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
  if (!engagement) throw new Error(`Engagement ${engagementId} disappeared`)

  return ok(c, engagement, 201)
}
