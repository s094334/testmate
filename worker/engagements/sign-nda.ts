import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { createDb } from '../db'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { engagementSchema } from './lib/engagement'
import { runTransition, transitions } from './lib/machine'

export const signNdaRoute = createRoute({
  method: 'post',
  path: '/engagements/{id}/sign-nda',
  middleware: [requireAuth, requireRole('tester')] as const,
  request: {
    params: z.object({ id: z.uuid({ error: '合作 id 格式錯誤' }) }),
  },
  responses: {
    200: {
      description:
        'PENDING_NDA → PENDING_PAYMENT；payment_due_at 為 3 天後，記錄簽署的條文版本與時間',
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
        'FORBIDDEN（不是測試人員、不是這筆合作的測試人員，或 Origin 不是本站）',
    },
    404: { description: 'NOT_FOUND（合作不存在）' },
    409: {
      description: 'INVALID_STATE（狀態不是 PENDING_NDA，或已過 nda_due_at）',
    },
  },
})

export const signNda: RouteHandler<typeof signNdaRoute, AuthEnv> = async (
  c
) => {
  const { id } = c.req.valid('param')
  const result = await runTransition(
    createDb(c.env),
    transitions.signNda,
    id,
    c.get('user').id
  )

  if ('error' in result) {
    const { status, code, message } = result.error
    return fail(c, status, code, message)
  }

  // TODO: email the owner to pay within 3 days (phase 4 notifier); there is no mailer yet

  return ok(c, result.engagement)
}
