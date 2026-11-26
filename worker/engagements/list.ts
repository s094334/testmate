import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { createDb } from '../db'
import {
  companies,
  engagementStatuses,
  engagements,
  projectDevices,
  projects,
  tags,
  testerProfiles,
} from '../db/schema'
import { requireAuth, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { engagementSchema, isDisclosed, nextDueAtOf } from './lib/engagement'

export const listEngagementsRoute = createRoute({
  method: 'get',
  path: '/engagements',
  middleware: [requireAuth] as const,
  request: {
    query: z.object({
      project_id: z.uuid({ error: '專案 id 格式錯誤' }).optional(),
      // ?status=a arrives as a string, ?status=a&status=b as an array; both
      // become an array before validation, as in projects/list.ts
      status: z.preprocess(
        (value) => (value === undefined ? undefined : [value].flat()),
        z.array(z.enum(engagementStatuses, { error: '狀態不正確' })).optional()
      ),
    }),
  },
  responses: {
    200: {
      description:
        '負責人：自己專案底下的合作；測試人員：自己的合作。依 updated_at 新到舊',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              items: z.array(
                z.object({
                  id: z.uuid(),
                  project: z.object({
                    id: z.uuid(),
                    name: z.string(),
                    summary: z.string(),
                    devices: engagementSchema.shape.project.shape.devices,
                  }),
                  status: z.enum(engagementStatuses),
                  // null: the owner reading a tester with no nickname, before payment
                  counterpart_name: z.string().nullable(),
                  next_due_at: z.iso.datetime().nullable(),
                  updated_at: z.iso.datetime(),
                })
              ),
            }),
            error: z.null(),
          }),
        },
      },
    },
    400: {
      description: 'VALIDATION_FAILED（project_id 不是 UUID、status 不正確）',
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（負責人帶的 project_id 不是自己的專案）' },
  },
})

// Not paged: API.md pages only GET /api/projects
export const listEngagements: RouteHandler<
  typeof listEngagementsRoute,
  AuthEnv
> = async (c) => {
  const query = c.req.valid('query')
  const user = c.get('user')
  const db = createDb(c.env)

  // A project_id that does not exist counts as someone else's (API.md 共通錯誤).
  // A tester's list is already only their own, so their project_id just narrows it
  if (user.role === 'owner' && query.project_id) {
    const [project] = await db
      .select({ ownerId: projects.ownerId })
      .from(projects)
      .where(eq(projects.id, query.project_id))

    if (project?.ownerId !== user.id) {
      return fail(c, 403, 'FORBIDDEN', '沒有權限')
    }
  }

  const mine = and(
    user.role === 'owner'
      ? eq(projects.ownerId, user.id)
      : eq(engagements.testerId, user.id),
    query.project_id ? eq(engagements.projectId, query.project_id) : undefined,
    query.status ? inArray(engagements.status, query.status) : undefined
  )

  const rows = await db
    .select({
      engagement: engagements,
      projectName: projects.name,
      projectSummary: projects.summary,
      companyName: companies.name,
      testerRealName: testerProfiles.realName,
      testerNickname: testerProfiles.nickname,
    })
    .from(engagements)
    .innerJoin(projects, eq(projects.id, engagements.projectId))
    .innerJoin(companies, eq(companies.userId, projects.ownerId))
    .innerJoin(testerProfiles, eq(testerProfiles.userId, engagements.testerId))
    .where(mine)
    .orderBy(desc(engagements.updatedAt), desc(engagements.id))

  // A subquery instead of a list of ids: D1 binds at most 100 parameters per
  // query, and an owner's projects can go past that
  const devices = await db
    .select({
      projectId: projectDevices.projectId,
      id: projectDevices.id,
      // A custom device has no tag; drizzle turns the all-null object into null
      deviceTag: { id: tags.id, category: tags.category, name: tags.name },
      brand: projectDevices.brand,
      model: projectDevices.model,
      minOsVersion: projectDevices.minOsVersion,
      customName: projectDevices.customName,
    })
    .from(projectDevices)
    .leftJoin(tags, eq(tags.id, projectDevices.deviceTagId))
    .where(
      inArray(
        projectDevices.projectId,
        db
          .select({ id: engagements.projectId })
          .from(engagements)
          .innerJoin(projects, eq(projects.id, engagements.projectId))
          .where(mine)
      )
    )
    .orderBy(projectDevices.sortOrder)

  return ok(c, {
    items: rows.map((row) => ({
      id: row.engagement.id,
      project: {
        id: row.engagement.projectId,
        name: row.projectName,
        summary: row.projectSummary,
        devices: devices
          .filter((device) => device.projectId === row.engagement.projectId)
          .map((device) => ({
            id: device.id,
            device_tag: device.deviceTag,
            brand: device.brand,
            model: device.model,
            min_os_version: device.minOsVersion,
            custom_name: device.customName,
          })),
      },
      status: row.engagement.status,
      // The owner sees the tester's real name only once the payment is in
      // escrow, and the nickname before that, as on the applicant list;
      // the tester sees the company
      counterpart_name:
        user.role === 'tester'
          ? row.companyName
          : isDisclosed(row.engagement.status)
            ? row.testerRealName
            : row.testerNickname || null,
      next_due_at: nextDueAtOf(row.engagement),
      updated_at: row.engagement.updatedAt,
    })),
  })
}
