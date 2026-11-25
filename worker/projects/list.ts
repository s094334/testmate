import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { and, desc, eq, gte, inArray, lt, or, sql } from 'drizzle-orm'
import { createDb } from '../db'
import {
  companies,
  projectDevices,
  projectTags,
  projects,
  tags,
} from '../db/schema'
import { ok } from '../http/response'
import { decodeCursor, encodeCursor } from './lib/cursor'
import { projectSchema } from './lib/project'
import { taiwanToday } from './lib/today'

export const listProjectsRoute = createRoute({
  method: 'get',
  path: '/projects',
  request: {
    query: z.object({
      q: z
        .string({ error: '搜尋關鍵字只能有一個' })
        .trim()
        .max(50, '搜尋關鍵字最多 50 字')
        .optional()
        .transform((value) => value || undefined),
      // ?device=a arrives as a string, ?device=a&device=b as an array; both
      // become an array before validation. Not a union as in tags/list.ts:
      // a union hides the max message behind its own error.
      // At most 20 ids each: D1 binds at most 100 parameters per query, and
      // three lists of 20 plus the rest of the main query stay under it
      device: z.preprocess(
        (value) => (value === undefined ? undefined : [value].flat()),
        z
          .array(z.uuid({ error: '裝置標籤 id 格式錯誤' }))
          .max(20, '裝置最多選 20 個')
          .optional()
      ),
      industry: z.preprocess(
        (value) => (value === undefined ? undefined : [value].flat()),
        z
          .array(z.uuid({ error: '產業標籤 id 格式錯誤' }))
          .max(20, '產業最多選 20 個')
          .optional()
      ),
      interest: z.preprocess(
        (value) => (value === undefined ? undefined : [value].flat()),
        z
          .array(z.uuid({ error: '興趣標籤 id 格式錯誤' }))
          .max(20, '興趣最多選 20 個')
          .optional()
      ),
      // Not z.coerce.number(): it would also take 1e1, 0x10 and +5.
      // z.number's own error is for 309 digits or more, which Number makes Infinity
      limit: z
        .string({ error: '每頁筆數只能有一個' })
        .regex(/^\d+$/, '每頁筆數必須是整數')
        .transform(Number)
        .pipe(
          z
            .number({ error: '每頁筆數最多 10 筆' })
            .min(1, '每頁筆數最少 1 筆')
            .max(10, '每頁筆數最多 10 筆')
        )
        .default(10),
      cursor: z
        .string({ error: 'cursor 無效' })
        .optional()
        .transform((value, ctx) => {
          if (value === undefined) return undefined
          const cursor = decodeCursor(value)
          if (!cursor) ctx.addIssue({ code: 'custom', message: 'cursor 無效' })
          return cursor ?? z.NEVER
        }),
    }),
  },
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
    400: {
      description:
        'VALIDATION_FAILED（q 重複或超過 50 字、標籤 id 格式錯誤或超過 20 個、limit 不是 1 到 10 的整數、cursor 無效）',
    },
  },
})

export const listProjects: RouteHandler<
  typeof listProjectsRoute,
  { Bindings: Env }
> = async (c) => {
  const query = c.req.valid('query')
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
        gte(projects.endDate, taiwanToday()),
        // instr is SQLite's; PostgreSQL's is strpos, so these three lines
        // change with the database. Not LIKE: D1 caps a LIKE pattern at
        // 50 bytes, and instr needs no escaping of % and _.
        // tags here is the company's industry, joined above
        query.q
          ? or(
              sql`instr(lower(${projects.name}), lower(${query.q})) > 0`,
              sql`instr(lower(${companies.name}), lower(${query.q})) > 0`,
              sql`instr(lower(${tags.name}), lower(${query.q})) > 0`
            )
          : undefined,
        // Subqueries, not joins: a project with two matching devices would
        // otherwise come back twice
        query.device
          ? inArray(
              projects.id,
              db
                .select({ id: projectDevices.projectId })
                .from(projectDevices)
                .where(inArray(projectDevices.deviceTagId, query.device))
            )
          : undefined,
        query.industry
          ? inArray(companies.industryTagId, query.industry)
          : undefined,
        query.interest
          ? inArray(
              projects.id,
              db
                .select({ id: projectTags.projectId })
                .from(projectTags)
                .where(inArray(projectTags.tagId, query.interest))
            )
          : undefined,
        // Everything after the cursor in the order below. The cursor does not
        // carry the filters: a new filter starts again from the first page
        query.cursor
          ? or(
              lt(projects.createdAt, query.cursor.createdAt),
              and(
                eq(projects.createdAt, query.cursor.createdAt),
                lt(projects.id, query.cursor.id)
              )
            )
          : undefined
      )
    )
    // id breaks ties between projects created in the same millisecond,
    // so the order is fixed and a cursor can say where a page ends
    .orderBy(desc(projects.createdAt), desc(projects.id))
    // One more than the page, only to tell whether a next page exists
    .limit(query.limit + 1)

  const page = rows.slice(0, query.limit)

  // Each id is one bound parameter, and D1 allows 100 per query:
  // fine while a page has at most 10 projects
  const projectIds = page.map((row) => row.project.id)

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
    items: page.map(({ project, companyName, industry }) => ({
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
    next_cursor:
      rows.length > query.limit
        ? encodeCursor(rows[query.limit - 1].project)
        : null,
  })
}
