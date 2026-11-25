import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, desc, eq, gte, inArray } from 'drizzle-orm'
import { createDb } from '../db'
import {
  companies,
  projectDevices,
  projectTags,
  projects,
  tags,
} from '../db/schema'
import { ok } from '../http/response'
import { projectSchema } from './lib/project'
import { taiwanToday } from './lib/today'

export const listProjectsRoute = createRoute({
  method: 'get',
  path: '/projects',
  responses: {
    200: {
      description: '招募中的專案，依建立時間新到舊',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              items: z.array(
                projectSchema.pick({
                  id: true,
                  name: true,
                  summary: true,
                  company: true,
                  industry: true,
                  interests: true,
                  devices: true,
                  end_date: true,
                  reward: true,
                  report_days: true,
                  application_count: true,
                  created_at: true,
                })
              ),
              next_cursor: z.string().nullable(),
            }),
            error: z.null(),
          }),
        },
      },
    },
  },
})

export const listProjects: RouteHandler<
  typeof listProjectsRoute,
  { Bindings: Env }
> = async (c) => {
  const db = createDb(c.env)

  const rows = await db
    .select({
      project: projects,
      companyName: companies.name,
      industry: { id: tags.id, category: tags.category, name: tags.name },
    })
    .from(projects)
    .innerJoin(companies, eq(companies.userId, projects.ownerId))
    .innerJoin(tags, eq(tags.id, companies.industryTagId))
    // end_date is the last day to apply. The phase 9 job that closes projects
    // past it does not exist yet, so the list leaves them out itself; findProject
    // does the same for the detail
    .where(
      and(
        eq(projects.recruitmentStatus, 'recruiting'),
        gte(projects.endDate, taiwanToday())
      )
    )
    // id breaks ties between projects created in the same millisecond,
    // so the order is fixed and a cursor can say where a page ends
    .orderBy(desc(projects.createdAt), desc(projects.id))
    // limit's maximum in API.md, until the limit query parameter exists
    .limit(50)

  // Each id is one bound parameter, and D1 allows 100 per query:
  // fine while a page has at most 50 projects
  const projectIds = rows.map((row) => row.project.id)

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
    .where(inArray(projectDevices.projectId, projectIds))
    .orderBy(projectDevices.sortOrder)

  const interests = await db
    .select({
      projectId: projectTags.projectId,
      tag: { id: tags.id, category: tags.category, name: tags.name },
    })
    .from(projectTags)
    .innerJoin(tags, eq(tags.id, projectTags.tagId))
    .where(
      and(
        inArray(projectTags.projectId, projectIds),
        eq(tags.category, 'interest')
      )
    )
    .orderBy(tags.sortOrder)

  return ok(c, {
    items: rows.map(({ project, companyName, industry }) => ({
      id: project.id,
      name: project.name,
      summary: project.summary,
      // Ratings do not exist yet
      company: { name: companyName, average_score: null, rating_count: 0 },
      industry,
      interests: interests
        .filter((interest) => interest.projectId === project.id)
        .map((interest) => interest.tag),
      devices: devices
        .filter((device) => device.projectId === project.id)
        .map((device) => ({
          id: device.id,
          device_tag: device.deviceTag,
          brand: device.brand,
          model: device.model,
          min_os_version: device.minOsVersion,
          custom_name: device.customName,
        })),
      end_date: project.endDate,
      reward: project.reward,
      report_days: project.reportDays,
      // Applications do not exist yet, so nobody has applied
      application_count: 0,
      created_at: project.createdAt,
    })),
    // Fixed until cursor pagination exists, even when there are more than 50
    next_cursor: null,
  })
}
