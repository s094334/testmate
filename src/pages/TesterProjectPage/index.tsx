import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useEngagement } from '@/api/engagements'
import { useProject } from '@/api/projects'
import type { Engagement, Project } from '@/api/types'
import { StatusTag } from '@/components/StatusTag'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { joinedProjectDetails, joinedProjects } from '@/data/tester'
import { DisputeDialog } from './DisputeDialog'
import { MobileActionBar } from './MobileActionBar'
import { ProjectContent } from './ProjectContent'
import { RateDialog, type Rating } from './RateDialog'
import { ReceivedEnvDialog } from './ReceivedEnvDialog'
import { StatusBanner } from './StatusBanner'

// The mock projects, /tester/projects/:id
export function TesterProjectPage() {
  const { id = '' } = useParams()
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]

  if (!project || !detail) return <Navigate to="/tester" replace />

  return <ProjectPage project={project} detail={detail} />
}

// A real engagement, /tester/engagements/:id. The project's public fields
// (簡介, 地點, 測試期間, the company's rating) come from GET /api/projects/{id}
export function TesterEngagementPage() {
  const { id = '' } = useParams()
  const engagementQuery = useEngagement(id)
  const engagement = engagementQuery.data
  const projectQuery = useProject(engagement?.project.id ?? '', !!engagement)
  const error = engagementQuery.error ?? projectQuery.error

  if (!engagement || !projectQuery.data) {
    return (
      <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
        <Link
          to="/tester"
          className="link inline-flex min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="bg-surface border-ink rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {!error
              ? '載入中…'
              : error instanceof ApiError &&
                  [400, 403, 404].includes(error.status)
                ? '找不到這個專案。'
                : '專案載入失敗，請重新整理再試一次。'}
          </p>
        </div>
      </div>
    )
  }

  return <ProjectPage {...mockShapeOf(engagement, projectQuery.data)} />
}

// The engagement in the shape the mock projects have, so both use one page
function mockShapeOf(engagement: Engagement, project: Project) {
  return {
    project: {
      id: engagement.id,
      name: engagement.project.name,
      owner: engagement.owner.company_name,
      // Only the home page list reads these two
      due: '',
      needsAction: false,
      // Same wording as 設備 on the project detail
      devices:
        engagement.project.devices.length === 0
          ? ['不限裝置']
          : engagement.project.devices.map(
              (device) =>
                [
                  device.device_tag?.name,
                  device.brand,
                  device.model,
                  device.custom_name,
                ]
                  .filter(Boolean)
                  .join('、') +
                (device.min_os_version ? `、${device.min_os_version} 以上` : '')
            ),
      status: engagement.status,
    },
    detail: {
      rating: project.company.average_score,
      reviews: project.company.rating_count,
      intro: project.summary,
      requirements: project.special_requirements?.trim()
        ? [project.special_requirements]
        : [],
      place:
        project.test_mode === 'remote' ? '遠端' : (project.test_city ?? ''),
      startDate: project.start_date.replaceAll('-', '/'),
      endDate: project.end_date.replaceAll('-', '/'),
      pay: `NT$ ${engagement.project.reward.toLocaleString('zh-TW')}`,
      ndaDeadline: engagement.nda_due_at,
      payDeadline: engagement.payment_due_at ?? undefined,
      // Only once the payment is in escrow
      ownerName: engagement.disclosed?.owner_contact.real_name,
      ownerEmail: engagement.disclosed?.owner_contact.email,
      howToTest: engagement.disclosed?.how_to_test,
      successCriteria: engagement.disclosed?.success_criteria,
      submitDeadline: engagement.report_due_at ?? undefined,
      rateDeadline: engagement.rating_due_at ?? undefined,
    },
  }
}

function ProjectPage({
  project,
  detail,
}: {
  project: (typeof joinedProjects)[number]
  detail: (typeof joinedProjectDetails)[string]
}) {
  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [rating, setRating] = useState<Rating | null>(null)
  const [now] = useState(() => Date.now())

  const overdue =
    project.status === 'TESTING' &&
    !!detail.submitDeadline &&
    new Date(detail.submitDeadline).getTime() < now

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <Link
        to="/tester"
        className="link tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start"
      >
        <ChevronDownIcon className="rotate-90" />
        上一頁
      </Link>

      <div className="flex flex-col items-start gap-3">
        {overdue ? (
          <span className="bg-status-dispute-bg text-status-dispute-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
            <WarningIcon />
            報告逾期
          </span>
        ) : (
          <StatusTag status={project.status} />
        )}
        <h1 className="text-subtitle">{project.name}</h1>
        <p className="text-ink-subtle flex flex-wrap items-center gap-1.5">
          {project.owner}、
          {detail.rating === null ? (
            '尚無評價'
          ) : (
            <>
              <span className="text-star flex">
                <StarIcon />
              </span>
              <b className="text-ink">{detail.rating}</b>
              公司評價（{detail.reviews} 則）
            </>
          )}
        </p>
      </div>

      <StatusBanner
        project={project}
        detail={detail}
        overdue={overdue}
        rating={rating}
        onOpenEnvDialog={() => setEnvDialogOpen(true)}
        onOpenDisputeDialog={() => setDisputeDialogOpen(true)}
        onOpenRateDialog={() => setRateDialogOpen(true)}
      />

      <ProjectContent project={project} detail={detail} />

      <MobileActionBar
        project={project}
        detail={detail}
        overdue={overdue}
        rating={rating}
        onOpenEnvDialog={() => setEnvDialogOpen(true)}
        onOpenDisputeDialog={() => setDisputeDialogOpen(true)}
        onOpenRateDialog={() => setRateDialogOpen(true)}
      />

      {detail.ownerEmail && (
        <ReceivedEnvDialog
          open={envDialogOpen}
          onOpenChange={setEnvDialogOpen}
          ownerEmail={detail.ownerEmail}
        />
      )}
      {detail.ownerName && detail.ownerEmail && detail.disputeDeadline && (
        <DisputeDialog
          open={disputeDialogOpen}
          onOpenChange={setDisputeDialogOpen}
          ownerName={detail.ownerName}
          company={project.owner}
          ownerEmail={detail.ownerEmail}
          deadline={detail.disputeDeadline}
        />
      )}
      {rateDialogOpen &&
        detail.ownerName &&
        detail.ownerEmail &&
        detail.rateDeadline && (
          <RateDialog
            onClose={() => setRateDialogOpen(false)}
            ownerName={detail.ownerName}
            company={project.owner}
            ownerEmail={detail.ownerEmail}
            rateDeadline={detail.rateDeadline}
            saved={rating}
            onSave={setRating}
          />
        )}
    </div>
  )
}
