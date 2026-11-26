import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { desc, eq } from 'drizzle-orm'
import { createDb } from '../db'
import { projects } from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { ok } from '../http/response'
import { projectSchema, recruitmentStatusOf } from '../projects/lib/project'

export const listOwnProjectsRoute = createRoute({
  method: 'get',
  path: '/auth/projects',
  middleware: [requireAuth, requireRole('owner')] as const,
  responses: {
    200: {
      description:
        '目前登入的負責人發布的全部專案（含已結束、已取消），依建立時間新到舊',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              items: z.array(
                projectSchema.pick({
                  id: true,
                  name: true,
                  summary: true,
                  test_mode: true,
                  test_city: true,
                  start_date: true,
                  end_date: true,
                  recruitment_status: true,
                  created_at: true,
                  engagement: true,
                })
              ),
            }),
            error: z.null(),
          }),
        },
      },
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是負責人）' },
  },
})

// Not paged: API.md pages only GET /api/projects
export const listOwnProjects: RouteHandler<
  typeof listOwnProjectsRoute,
  AuthEnv
> = async (c) => {
  const rows = await createDb(c.env)
    .select({
      id: projects.id,
      name: projects.name,
      summary: projects.summary,
      testMode: projects.testMode,
      testCity: projects.testCity,
      startDate: projects.startDate,
      endDate: projects.endDate,
      recruitmentStatus: projects.recruitmentStatus,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.ownerId, c.get('user').id))
    // Same order as GET /api/projects
    .orderBy(desc(projects.createdAt), desc(projects.id))

  return ok(c, {
    items: rows.map((project) => ({
      id: project.id,
      name: project.name,
      summary: project.summary,
      test_mode: project.testMode,
      test_city: project.testCity,
      start_date: project.startDate,
      end_date: project.endDate,
      // Past end_date it reads closed, but is still listed
      recruitment_status: recruitmentStatusOf(project),
      // 暫時: engagements do not exist yet, so no project has one
      engagement: null,
      created_at: project.createdAt,
    })),
  })
}
