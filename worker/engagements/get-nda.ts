import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { createDb } from '../db'
import { companies, ndaSignatures, testerProfiles } from '../db/schema'
import { requireAuth, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { testerNameOf } from './lib/disclosure'
import { findParties, sideOf } from './lib/parties'

export const getNdaRoute = createRoute({
  method: 'get',
  path: '/engagements/{id}/nda',
  middleware: [requireAuth] as const,
  request: {
    params: z.object({ id: z.uuid({ error: '合作 id 格式錯誤' }) }),
  },
  responses: {
    200: {
      description:
        '保密協議要帶入的值（條文在前端）；FUNDED 之前（含 CANCELLED）負責人讀到的 tester_name 是暱稱，之後是真實姓名；測試人員一直讀到自己的真實姓名',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              company_name: z.string(),
              // null: the owner reading a tester with no nickname, before FUNDED
              tester_name: z.string().nullable(),
              signed_at: z.iso.datetime().nullable(),
            }),
            error: z.null(),
          }),
        },
      },
    },
    400: { description: 'VALIDATION_FAILED（id 不是 UUID）' },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是這筆合作的負責人或測試人員）' },
    404: { description: 'NOT_FOUND（合作不存在）' },
  },
})

export const getNda: RouteHandler<typeof getNdaRoute, AuthEnv> = async (c) => {
  const { id } = c.req.valid('param')
  const user = c.get('user')
  const db = createDb(c.env)

  const parties = await findParties(db, id)

  if (!parties) {
    return fail(c, 404, 'NOT_FOUND', '找不到這筆合作')
  }

  const side = sideOf(parties, user.id)
  if (!side) {
    return fail(c, 403, 'FORBIDDEN', '沒有權限')
  }

  const { engagement } = parties
  const [company] = await db
    .select({ name: companies.name })
    .from(companies)
    .where(eq(companies.userId, parties.ownerId))
  const [tester] = await db
    .select({
      realName: testerProfiles.realName,
      nickname: testerProfiles.nickname,
    })
    .from(testerProfiles)
    .where(eq(testerProfiles.userId, engagement.testerId))
  const [signature] = await db
    .select({ signedAt: ndaSignatures.signedAt })
    .from(ndaSignatures)
    .where(eq(ndaSignatures.engagementId, id))

  if (!company || !tester) {
    throw new Error(`Engagement ${id} has no company or tester profile`)
  }

  return ok(c, {
    company_name: company.name,
    tester_name:
      side === 'owner'
        ? testerNameOf(engagement.status, tester)
        : tester.realName,
    signed_at: signature?.signedAt ?? null,
  })
}
