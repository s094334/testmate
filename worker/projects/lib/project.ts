import { z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import type { SessionUser } from '../../auth/lib/session'
import type { Db } from '../../db'
import {
  companies,
  minQaYearsOptions,
  projectDevices,
  projectTags,
  projectTestItems,
  projects,
  recruitmentStatuses,
  tagCategories,
  tags,
  testModes,
} from '../../db/schema'
import { taiwanToday } from './today'

const tag = z.object({
  id: z.uuid(),
  category: z.enum(tagCategories),
  name: z.string(),
})

// The project as the 發布專案 form describes it, not API.md `Project`.
// `industry` is one tag from the owner's company.
export const projectSchema = z.object({
  id: z.uuid(),
  owner_id: z.uuid(),
  name: z.string(),
  summary: z.string(),
  company: z.object({
    name: z.string(),
    average_score: z.number().nullable(),
    rating_count: z.int(),
  }),
  industry: tag,
  devices: z.array(
    z.object({
      id: z.uuid(),
      device_tag: tag.nullable(),
      brand: z.string().nullable(),
      model: z.string().nullable(),
      min_os_version: z.string().nullable(),
      custom_name: z.string().nullable(),
    })
  ),
  languages: z.array(
    z.object({ name: z.string(), native_required: z.boolean() })
  ),
  interests: z.array(tag),
  qa_experience_required: z.boolean(),
  min_qa_years: z.enum(minQaYearsOptions).nullable(),
  test_mode: z.enum(testModes),
  test_city: z.string().nullable(),
  start_date: z.iso.date(),
  end_date: z.iso.date(),
  report_days: z.int(),
  reward: z.int(),
  special_requirements: z.string().nullable(),
  recruitment_status: z.enum(recruitmentStatuses),
  application_count: z.int(),
  created_at: z.iso.datetime(),
  viewer: z.object({ applied: z.boolean() }).nullable(),
  // The latest engagement that is not CANCELLED, only for the project's owner.
  // Also on GET /api/auth/projects
  engagement: z
    .object({
      id: z.uuid(),
      status: z.enum([
        'PENDING_NDA',
        'PENDING_PAYMENT',
        'FUNDED',
        'TESTING',
        'SUBMITTED',
        'DISPUTED',
        'COMPLETED',
        'REFUNDED',
      ]),
      tester_name: z.string(),
    })
    .nullable(),
  confidential: z
    .object({
      how_to_test: z.string(),
      success_criteria: z.string(),
      confidential_details: z.string().nullable(),
      environment_info: z.string().nullable(),
      test_items: z.array(
        z.object({
          id: z.uuid(),
          title: z.string(),
          steps: z.string(),
          expected: z.string(),
        })
      ),
    })
    .nullable(),
})

// end_date is the last day to apply. The phase 9 job that sets closed past
// it does not exist yet, so the detail and the owner's own list work it out
// themselves, the same way GET /api/projects leaves those projects out
export function recruitmentStatusOf(project: {
  recruitmentStatus: (typeof recruitmentStatuses)[number]
  endDate: string
}) {
  return project.recruitmentStatus === 'recruiting' &&
    project.endDate < taiwanToday()
    ? 'closed'
    : project.recruitmentStatus
}

// `viewer` is who is reading: only the project's owner gets `confidential`
export async function findProject(
  db: Db,
  id: string,
  viewer: SessionUser | null
) {
  const [row] = await db
    .select({
      project: projects,
      companyName: companies.name,
      industry: { id: tags.id, category: tags.category, name: tags.name },
    })
    .from(projects)
    .innerJoin(companies, eq(companies.userId, projects.ownerId))
    .innerJoin(tags, eq(tags.id, companies.industryTagId))
    .where(eq(projects.id, id))

  if (!row) return null

  const { project } = row

  const devices = await db
    .select({
      id: projectDevices.id,
      // A custom device has no tag; drizzle turns the all-null object into null
      device_tag: { id: tags.id, category: tags.category, name: tags.name },
      brand: projectDevices.brand,
      model: projectDevices.model,
      min_os_version: projectDevices.minOsVersion,
      custom_name: projectDevices.customName,
    })
    .from(projectDevices)
    .leftJoin(tags, eq(tags.id, projectDevices.deviceTagId))
    .where(eq(projectDevices.projectId, id))
    .orderBy(projectDevices.sortOrder)

  const interests = await db
    .select({ id: tags.id, category: tags.category, name: tags.name })
    .from(projectTags)
    .innerJoin(tags, eq(tags.id, projectTags.tagId))
    .where(and(eq(projectTags.projectId, id), eq(tags.category, 'interest')))
    .orderBy(tags.sortOrder)

  return {
    id: project.id,
    owner_id: project.ownerId,
    name: project.name,
    summary: project.summary,
    // Ratings do not exist yet
    company: { name: row.companyName, average_score: null, rating_count: 0 },
    industry: row.industry,
    devices,
    languages: project.languages,
    interests,
    qa_experience_required: project.qaExperienceRequired,
    min_qa_years: project.minQaYears,
    test_mode: project.testMode,
    test_city: project.testCity,
    start_date: project.startDate,
    end_date: project.endDate,
    report_days: project.reportDays,
    reward: project.reward,
    special_requirements: project.specialRequirements,
    recruitment_status: recruitmentStatusOf(project),
    // Applications do not exist yet, so nobody has applied
    application_count: 0,
    created_at: project.createdAt,
    viewer: viewer?.role === 'tester' ? { applied: false } : null,
    // 暫時: engagements do not exist yet, so no project has one
    engagement: null,
    confidential:
      viewer?.id === project.ownerId
        ? {
            how_to_test: project.howToTest,
            success_criteria: project.successCriteria,
            confidential_details: project.confidentialDetails,
            environment_info: project.environmentInfo,
            test_items: await db
              .select({
                id: projectTestItems.id,
                title: projectTestItems.title,
                steps: projectTestItems.steps,
                expected: projectTestItems.expected,
              })
              .from(projectTestItems)
              .where(eq(projectTestItems.projectId, id))
              .orderBy(projectTestItems.sortOrder),
          }
        : null,
  }
}
