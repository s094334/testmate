import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { createDb } from '../db'
import {
  applications,
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
  users,
} from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findProject, projectCardOf } from '../projects/lib/project'
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
      nickname: testerProfiles.nickname,
      avatarShape: users.avatarShape,
      city: testerProfiles.city,
      hasQaExperience: testerProfiles.hasQaExperience,
      qaYears: testerProfiles.qaYears,
      languages: testerProfiles.languages,
    })
    .from(applications)
    .innerJoin(testerProfiles, eq(testerProfiles.userId, applications.testerId))
    .innerJoin(users, eq(users.id, applications.testerId))
    .where(eq(applications.projectId, projectId))
    .orderBy(asc(applications.createdAt), asc(applications.id))

  // Subqueries, not a list of tester ids: a project can have more applicants
  // than D1's 100 bound parameters per query
  const applicantIds = db
    .select({ id: applications.testerId })
    .from(applications)
    .where(eq(applications.projectId, projectId))

  const devices = await db
    .select({
      userId: testerDevices.userId,
      deviceTagName: tags.name,
      brand: testerDevices.brand,
      model: testerDevices.model,
      osVersion: testerDevices.osVersion,
      customName: testerDevices.customName,
    })
    .from(testerDevices)
    .leftJoin(tags, eq(tags.id, testerDevices.deviceTagId))
    .where(inArray(testerDevices.userId, applicantIds))
    .orderBy(testerDevices.sortOrder, testerDevices.id)

  const interests = await db
    .select({ userId: testerProfileTags.userId, name: tags.name })
    .from(testerProfileTags)
    .innerJoin(tags, eq(tags.id, testerProfileTags.tagId))
    .where(
      and(
        inArray(testerProfileTags.userId, applicantIds),
        eq(tags.category, 'interest')
      )
    )
    .orderBy(tags.sortOrder)

  const card = projectCardOf(project)

  return ok(c, {
    items: rows.map((row) => ({
      id: row.id,
      project: card,
      source: row.source,
      status: row.status,
      created_at: row.createdAt,
      tester: {
        tester_id: row.testerId,
        nickname: row.nickname || null,
        avatar_shape: row.avatarShape,
        city: row.city,
        qa_years: row.hasQaExperience ? row.qaYears : null,
        languages: row.languages,
        devices: devices
          .filter((device) => device.userId === row.testerId)
          .map((device) => ({
            device_tag_name: device.deviceTagName,
            brand: device.brand,
            model: device.model,
            os_version: device.osVersion,
            custom_name: device.customName,
          })),
        interests: interests
          .filter((interest) => interest.userId === row.testerId)
          .map((interest) => interest.name),
        // Ratings do not exist yet
        average_score: null,
        rating_count: 0,
      },
    })),
  })
}
