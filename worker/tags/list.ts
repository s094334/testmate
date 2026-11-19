import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { inArray, sql } from 'drizzle-orm'
import { createDb } from '../db'
import { tagCategories, tags } from '../db/schema'
import { ok } from '../http/response'

const category = z.enum(tagCategories)

export const listTagsRoute = createRoute({
  method: 'get',
  path: '/tags',
  request: {
    query: z.object({
      // ?category=a arrives as a string, ?category=a&category=b as an array;
      // both become an array here
      category: z
        // The message sits on the union: a bad value fails both branches,
        // and zod reports the union's error, not the enum's
        .union([category, z.array(category)], {
          error: 'category 須為 device、industry、interest 或 audience',
        })
        .optional()
        .transform((value) =>
          value === undefined ? undefined : [value].flat()
        ),
    }),
  },
  responses: {
    200: {
      description: '全部標籤；可用 category 篩選，每個分類依固定順序',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              items: z.array(
                z.object({
                  id: z.uuid(),
                  category,
                  name: z.string(),
                })
              ),
            }),
            error: z.null(),
          }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（category 不是四個值之一）' },
  },
})

// Public: signup needs the industry tags before anyone is logged in
export const listTags: RouteHandler<
  typeof listTagsRoute,
  { Bindings: Env }
> = async (c) => {
  const query = c.req.valid('query')
  const db = createDb(c.env)

  const items = await db
    .select({ id: tags.id, category: tags.category, name: tags.name })
    .from(tags)
    .where(query.category ? inArray(tags.category, query.category) : undefined)
    // Categories in the order of tagCategories, as the PostgreSQL enum sorted
    // them; ordering by the text alone would sort them alphabetically
    .orderBy(
      sql`case ${tags.category} ${sql.join(
        tagCategories.map((value, i) => sql`when ${value} then ${i}`),
        sql` `
      )} end`,
      tags.sortOrder
    )

  return ok(c, { items })
}
