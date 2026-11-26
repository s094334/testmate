import { createRoute, z, type RouteHandler } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { createDb, isUniqueViolation } from '../db'
import {
  applications,
  projects,
  testerDevices,
  testerProfiles,
} from '../db/schema'
import { requireAuth, requireRole, type AuthEnv } from '../http/auth'
import { fail, ok } from '../http/response'
import { findProject, recruitmentStatusOf } from '../projects/lib/project'
import { applicationSchema } from './lib/application'

export const createApplicationRoute = createRoute({
  method: 'post',
  path: '/applications',
  middleware: [requireAuth, requireRole('tester')] as const,
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object(
            { project_id: z.uuid({ error: '專案 id 格式錯誤' }) },
            { error: '請求格式錯誤' }
          ),
        },
      },
    },
  },
  responses: {
    201: {
      description: '申請成功，回傳應徵（tester 為 null）',
      content: {
        'application/json': {
          schema: z.object({ data: applicationSchema, error: z.null() }),
        },
      },
    },
    400: {
      description:
        'VALIDATION_FAILED（project_id 不是 UUID）、PROFILE_REQUIRED（檔案缺語言或裝置）',
    },
    401: { description: 'UNAUTHENTICATED（未登入或 session 過期）' },
    403: { description: 'FORBIDDEN（不是測試人員，或 Origin 不是本站）' },
    404: { description: 'NOT_FOUND（專案不存在）' },
    409: {
      description:
        'INVALID_STATE（專案不是招募中）、RECRUITMENT_ENDED（已過 end_date）、ALREADY_APPLIED（已經申請過）',
    },
  },
})

export const createApplication: RouteHandler<
  typeof createApplicationRoute,
  AuthEnv
> = async (c) => {
  const { project_id: projectId } = c.req.valid('json')
  const user = c.get('user')
  const db = createDb(c.env)

  const [project] = await db
    .select({
      recruitmentStatus: projects.recruitmentStatus,
      endDate: projects.endDate,
    })
    .from(projects)
    .where(eq(projects.id, projectId))

  if (!project) {
    return fail(c, 404, 'NOT_FOUND', '找不到這個專案')
  }

  const [profile] = await db
    .select({
      languages: testerProfiles.languages,
      deviceCount: db.$count(
        testerDevices,
        eq(testerDevices.userId, testerProfiles.userId)
      ),
    })
    .from(testerProfiles)
    .where(eq(testerProfiles.userId, user.id))

  if (!profile || profile.languages.length === 0 || profile.deviceCount === 0) {
    return fail(c, 400, 'PROFILE_REQUIRED', '請先到我的檔案補上語言與裝置')
  }

  if (project.recruitmentStatus !== 'recruiting') {
    return fail(c, 409, 'INVALID_STATE', '這個專案已經停止招募')
  }

  // Still recruiting in the table, but past end_date: the phase 9 job that
  // closes it does not exist yet
  if (recruitmentStatusOf(project) !== 'recruiting') {
    return fail(c, 409, 'RECRUITMENT_ENDED', '這個專案已經截止申請')
  }

  const applicationId = crypto.randomUUID()
  const createdAt = new Date()

  // The unique (project_id, tester_id) index tells a second application
  // apart, so two presses at once cannot both get in
  try {
    await db.insert(applications).values({
      id: applicationId,
      projectId,
      testerId: user.id,
      source: 'applied',
      createdAt,
      updatedAt: createdAt,
    })
  } catch (err) {
    if (isUniqueViolation(err, applications.projectId)) {
      return fail(c, 409, 'ALREADY_APPLIED', '已經申請過這個專案')
    }
    throw err
  }

  // TODO: email the owner that someone applied (phase 4 notifier); there is no mailer yet

  const card = await findProject(db, projectId, user)
  if (!card) throw new Error(`Project ${projectId} disappeared after applying`)

  return ok(
    c,
    {
      id: applicationId,
      project: {
        id: card.id,
        name: card.name,
        summary: card.summary,
        company: card.company,
        industry: card.industry,
        interests: card.interests,
        devices: card.devices,
        end_date: card.end_date,
        reward: card.reward,
        report_days: card.report_days,
        created_at: card.created_at,
      },
      source: 'applied' as const,
      status: 'pending' as const,
      created_at: createdAt,
      tester: null,
    },
    201
  )
}
