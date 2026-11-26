import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { asc, eq } from 'drizzle-orm'
import { createDb } from '../db'
import { applications } from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findProject, projectCardOf } from '../projects/lib/project'
import { findTesterCards } from '../testers/lib/card'
import { applicationSchema } from './lib/application'

// Only the owner's side of API.md「16. GET /api/applications」for now.
// A tester's own applications are not shown anywhere yet, so testers get 403
export const listApplicationsRoute = createRoute({
  method: 'get',
  path: '/applications',
  middleware: [requireAuth, requireRole('owner')] as const,
  request: {
    query: z.object({
      project_id: z.uuid({ error: '專案 id 格式錯誤' }),
    }),
  },
  responses: {
    200: {
      description:
        '這個專案的申請者，依申請時間舊到新；測試人員只有暱稱等公開資料',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({ items: z.array(applicationSchema) }),
            error: z.null(),
          }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（沒有 project_id，或不是 UUID）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: {
      description: 'FORBIDDEN（不是負責人，或專案不存在、不是自己的專案）',
    },
  },
})

export const listApplications: RouteHandler<
  typeof listApplicationsRoute,
  AuthEnv
> = async (c) => {
  const { project_id: projectId } = c.req.valid('query')
  const user = c.get('user')
  const db = createDb(c.env)

  const project = await findProject(db, projectId, user)

  // API.md: an id in the query that does not exist counts as not yours
  if (!project || project.owner_id !== user.id) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  const rows = await db
    .select({
      id: applications.id,
      source: applications.source,
      status: applications.status,
      createdAt: applications.createdAt,
      testerId: applications.testerId,
    })
    .from(applications)
    .where(eq(applications.projectId, projectId))
    .orderBy(asc(applications.createdAt), asc(applications.id))

  const testers = await findTesterCards(
    db,
    db
      .select({ id: applications.testerId })
      .from(applications)
      .where(eq(applications.projectId, projectId))
  )

  const card = projectCardOf(project)

  return ok(c, {
    items: rows.map((row) => ({
      id: row.id,
      project: card,
      source: row.source,
      status: row.status,
      created_at: row.createdAt,
      tester:
        testers.find((tester) => tester.tester_id === row.testerId) ?? null,
    })),
  })
}
