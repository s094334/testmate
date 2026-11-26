import { z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { testerCardSchema } from '../../applications/lib/application'
import type { Db } from '../../db'
import {
  companies,
  engagementStatuses,
  engagements,
  ndaSignatures,
  projectDevices,
  projectTestItems,
  projects,
  tagCategories,
  tags,
  testerProfiles,
  users,
} from '../../db/schema'
import { findTesterCard } from '../../testers/lib/card'
import { isDisclosed } from './disclosure'

// EngagementSummary's next_due_at: the deadline the current status is waiting on
export function nextDueAtOf(engagement: typeof engagements.$inferSelect) {
  switch (engagement.status) {
    case 'PENDING_NDA':
      return engagement.ndaDueAt
    case 'PENDING_PAYMENT':
      return engagement.paymentDueAt
    case 'FUNDED':
      return engagement.startDueAt
    case 'TESTING':
      return engagement.reportOverdueAt
        ? overdueDecisionDueAtOf(engagement.reportOverdueAt)
        : engagement.reportDueAt
    case 'SUBMITTED':
      return engagement.reviewDueAt
    case 'COMPLETED':
      return engagement.ratingDueAt
    // DISPUTED waits on dispute_due_at, which comes with the disputes table
    default:
      return null
  }
}

function overdueDecisionDueAtOf(reportOverdueAt: Date) {
  return new Date(reportOverdueAt.getTime() + 3 * 24 * 60 * 60 * 1000)
}

const device = z.object({
  id: z.uuid(),
  device_tag: z
    .object({
      id: z.uuid(),
      category: z.enum(tagCategories),
      name: z.string(),
    })
    .nullable(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  min_os_version: z.string().nullable(),
  custom_name: z.string().nullable(),
})

const contact = z.object({
  real_name: z.string(),
  phone: z.string(),
  email: z.string(),
})

// API.md `Engagement`
export const engagementSchema = z.object({
  id: z.uuid(),
  status: z.enum(engagementStatuses),
  project: z.object({
    id: z.uuid(),
    name: z.string(),
    reward: z.int(),
    report_days: z.int(),
    devices: z.array(device),
  }),
  owner: z.object({ company_name: z.string() }),
  tester: testerCardSchema,
  nda_due_at: z.iso.datetime(),
  nda_signed_at: z.iso.datetime().nullable(),
  payment_due_at: z.iso.datetime().nullable(),
  funded_at: z.iso.datetime().nullable(),
  escrow_balance: z.int(),
  latest_payment: z
    .object({ status: z.enum(['pending', 'paid', 'failed']) })
    .nullable(),
  settlement: z
    .object({
      type: z.enum(['full_payout', 'full_refund', 'split']),
      platform_fee: z.int(),
      payout: z.int(),
      refund: z.int(),
    })
    .nullable(),
  start_due_at: z.iso.datetime().nullable(),
  environment_provided_at: z.iso.datetime().nullable(),
  report_due_at: z.iso.datetime().nullable(),
  report_overdue_at: z.iso.datetime().nullable(),
  overdue_decision_due_at: z.iso.datetime().nullable(),
  deadline_extended: z.boolean(),
  rejection_count: z.int(),
  review_due_at: z.iso.datetime().nullable(),
  rating_due_at: z.iso.datetime().nullable(),
  my_rating: z
    .object({
      id: z.uuid(),
      engagement_id: z.uuid(),
      score: z.int(),
      comment: z.string(),
      submitted_at: z.iso.datetime(),
      published_at: z.iso.datetime().nullable(),
    })
    .nullable(),
  counterpart_rated: z.boolean(),
  created_at: z.iso.datetime(),
  disclosed: z
    .object({
      how_to_test: z.string(),
      success_criteria: z.string(),
      confidential_details: z.string().nullable(),
      test_items: z.array(
        z.object({
          id: z.uuid(),
          title: z.string(),
          steps: z.string(),
          expected: z.string(),
        })
      ),
      owner_contact: contact,
      tester_contact: contact,
    })
    .nullable(),
})

// Two joins on users, one for each side's email
const ownerUsers = alias(users, 'owner_users')
const testerUsers = alias(users, 'tester_users')

// The same for both sides: neither sees anything the other does not.
// Whether the reader is one of the two is checked by the caller
export async function findEngagement(db: Db, id: string) {
  const [row] = await db
    .select({
      engagement: engagements,
      project: {
        name: projects.name,
        reward: projects.reward,
        reportDays: projects.reportDays,
        howToTest: projects.howToTest,
        successCriteria: projects.successCriteria,
        confidentialDetails: projects.confidentialDetails,
      },
      company: {
        name: companies.name,
        realName: companies.realName,
        phone: companies.phone,
      },
      ownerEmail: ownerUsers.email,
      tester: {
        realName: testerProfiles.realName,
        phone: testerProfiles.phone,
      },
      testerEmail: testerUsers.email,
      ndaSignedAt: ndaSignatures.signedAt,
    })
    .from(engagements)
    .innerJoin(projects, eq(projects.id, engagements.projectId))
    .innerJoin(companies, eq(companies.userId, projects.ownerId))
    .innerJoin(ownerUsers, eq(ownerUsers.id, projects.ownerId))
    .innerJoin(testerProfiles, eq(testerProfiles.userId, engagements.testerId))
    .innerJoin(testerUsers, eq(testerUsers.id, engagements.testerId))
    .leftJoin(ndaSignatures, eq(ndaSignatures.engagementId, engagements.id))
    .where(eq(engagements.id, id))

  if (!row) return null

  const { engagement, project } = row

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
    .where(eq(projectDevices.projectId, engagement.projectId))
    .orderBy(projectDevices.sortOrder)

  const tester = await findTesterCard(db, engagement.testerId)
  if (!tester) {
    throw new Error(`Tester ${engagement.testerId} has no profile`)
  }

  return {
    id: engagement.id,
    status: engagement.status,
    project: {
      id: engagement.projectId,
      name: project.name,
      reward: project.reward,
      report_days: project.reportDays,
      devices,
    },
    owner: { company_name: row.company.name },
    tester,
    nda_due_at: engagement.ndaDueAt,
    nda_signed_at: row.ndaSignedAt,
    payment_due_at: engagement.paymentDueAt,
    funded_at: engagement.fundedAt,
    // 暫時: the ledger does not exist yet, so nothing is held in escrow
    escrow_balance: 0,
    // 暫時: payments, ratings and the ledger do not exist yet
    latest_payment: null,
    settlement: null,
    start_due_at: engagement.startDueAt,
    environment_provided_at: engagement.environmentProvidedAt,
    report_due_at: engagement.reportDueAt,
    report_overdue_at: engagement.reportOverdueAt,
    overdue_decision_due_at: engagement.reportOverdueAt
      ? overdueDecisionDueAtOf(engagement.reportOverdueAt)
      : null,
    deadline_extended: engagement.deadlineExtended,
    rejection_count: engagement.rejectionCount,
    review_due_at: engagement.reviewDueAt,
    rating_due_at: engagement.ratingDueAt,
    my_rating: null,
    counterpart_rated: false,
    created_at: engagement.createdAt,
    disclosed: isDisclosed(engagement.status)
      ? {
          how_to_test: project.howToTest,
          success_criteria: project.successCriteria,
          confidential_details: project.confidentialDetails,
          test_items: await db
            .select({
              id: projectTestItems.id,
              title: projectTestItems.title,
              steps: projectTestItems.steps,
              expected: projectTestItems.expected,
            })
            .from(projectTestItems)
            .where(eq(projectTestItems.projectId, engagement.projectId))
            .orderBy(projectTestItems.sortOrder),
          owner_contact: {
            real_name: row.company.realName,
            phone: row.company.phone,
            email: row.ownerEmail,
          },
          tester_contact: {
            real_name: row.tester.realName,
            phone: row.tester.phone,
            email: row.testerEmail,
          },
        }
      : null,
  }
}
