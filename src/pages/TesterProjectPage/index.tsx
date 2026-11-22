import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { StatusTag } from '@/components/StatusTag'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { joinedProjectDetails, joinedProjects } from '@/data/tester'
import { DisputeDialog } from './DisputeDialog'
import { MobileActionBar } from './MobileActionBar'
import { ProjectContent } from './ProjectContent'
import { RateDialog, type Rating } from './RateDialog'
import { ReceivedEnvDialog } from './ReceivedEnvDialog'
import { StatusBanner } from './StatusBanner'

export function TesterProjectPage() {
  const { id = '' } = useParams()
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]
  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [rating, setRating] = useState<Rating | null>(null)

  if (!project || !detail) return <Navigate to="/tester" replace />

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
        <StatusTag status={project.status} needsAction={false} />
        <h1 className="text-subtitle">{project.name}</h1>
        <p className="text-ink-subtle flex flex-wrap items-center gap-1.5">
          {project.owner}、
          <span className="text-star flex">
            <StarIcon />
          </span>
          <b className="text-ink">{detail.rating}</b>
          公司評價（{detail.reviews} 則）
        </p>
      </div>

      <StatusBanner
        project={project}
        detail={detail}
        rating={rating}
        onOpenEnvDialog={() => setEnvDialogOpen(true)}
        onOpenDisputeDialog={() => setDisputeDialogOpen(true)}
        onOpenRateDialog={() => setRateDialogOpen(true)}
      />

      <ProjectContent project={project} detail={detail} />

      <MobileActionBar
        project={project}
        detail={detail}
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
