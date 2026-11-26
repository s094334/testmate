import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { createDb } from '../db'
import { applications, projects } from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findProject, projectCardOf } from '../projects/lib/project'
import { findTesterCard } from '../testers/lib/card'
import { applicationSchema } from './lib/application'

export const declineApplicationRoute = createRoute({
  method: 'post',
  path: '/applications/{id}/decline',
  middleware: [requireAuth, requireRole('owner')] as const,
  request: {
    params: z.object({ id: z.uuid({ error: '應徵 id 格式錯誤' }) }),
  },
  responses: {
    200: {
      description: '婉拒成功，應徵改為 declined；不通知測試人員',
      content: {
        'application/json': {
          schema: z.object({ data: applicationSchema, error: z.null() }),
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
    409: { description: 'INVALID_STATE（應徵不是 pending）' },
  },
})

// API.md checks only the application: the project's state does not matter
export const declineApplication: RouteHandler<
  typeof declineApplicationRoute,
  AuthEnv
> = async (c) => {
  const { id } = c.req.valid('param')
  const user = c.get('user')
  const db = createDb(c.env)

  const [row] = await db
    .select({
      projectId: applications.projectId,
      testerId: applications.testerId,
      source: applications.source,
      status: applications.status,
      createdAt: applications.createdAt,
      ownerId: projects.ownerId,
    })
    .from(applications)
    .innerJoin(projects, eq(projects.id, applications.projectId))
    .where(eq(applications.id, id))

  if (!row) {
    return fail(c, 404, 'NOT_FOUND', '找不到這筆應徵')
  }

  if (row.ownerId !== user.id) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  if (row.status !== 'pending') {
    return fail(c, 409, 'INVALID_STATE', '這位應徵者已經不能婉拒')
  }

  // The check above is read before the write: a 選定 in between must not be
  // turned into declined, so the update holds the same condition
  const [declined] = await db
    .update(applications)
    .set({ status: 'declined' })
    .where(and(eq(applications.id, id), eq(applications.status, 'pending')))
    .returning({ id: applications.id })

  if (!declined) {
    return fail(c, 409, 'INVALID_STATE', '這位應徵者已經不能婉拒')
  }

  const project = await findProject(db, row.projectId, user)
  if (!project) throw new Error(`Project ${row.projectId} disappeared`)

  return ok(c, {
    id,
    project: projectCardOf(project),
    source: row.source,
    status: 'declined' as const,
    created_at: row.createdAt,
    tester: await findTesterCard(db, row.testerId),
  })
}
