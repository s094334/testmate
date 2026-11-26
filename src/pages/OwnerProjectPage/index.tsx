import { useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useProject } from '@/api/projects'
import { useSession } from '@/api/session'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { InfoIcon } from '@/components/icons/InfoIcon'
import {
  isMockOwnerProject,
  ownerEngagementDetails,
  ownerProjects,
  type RecruitCandidate,
} from '@/data/owner'
import { Progress } from './Progress'
import { Recruiting } from './Recruiting'

export function OwnerProjectPage() {
  const { id = '' } = useParams()

  return isMockOwnerProject(id) ? (
    <MockProject id={id} />
  ) : (
    <ApiProject id={id} />
  )
}

function ApiProject({ id }: { id: string }) {
  const { data: project, isPending, error } = useProject(id)
  const { data: user } = useSession()

  if (!project) {
    return (
      <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
        <Link
          to="/owner"
          className="link inline-flex min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          專案列表
        </Link>

        <div className="bg-surface border-ink rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {isPending
              ? '載入中…'
              : error instanceof ApiError &&
                  (error.status === 404 || error.status === 400)
                ? '找不到這個專案。'
                : '專案載入失敗，請重新整理再試一次。'}
          </p>
        </div>
      </div>
    )
  }

  // GET /api/projects/{id} is public, so another owner's project loads too
  if (project.owner_id !== user?.id) return <Navigate to="/owner" replace />

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1">
        <Link
          to="/owner"
          className="link inline-flex min-h-11 items-center gap-1.5 self-start justify-self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          專案列表
        </Link>
        <h1 className="text-subtitle tablet:col-span-1 col-span-2 row-start-2">
          {project.name}
        </h1>
        <Link
          to={`/owner/projects/${project.id}/info`}
          className="link underline-offset-5 text-role group tablet:row-start-2 col-start-2 row-start-1 inline-flex min-h-11 items-center gap-1.5 font-bold whitespace-nowrap"
        >
          <InfoIcon className="size-5 flex-none" />
          專案資訊
          <ChevronDownIcon className="size-4.5 flex-none -rotate-90 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 測試進度 waits for the engagement API; until then engagement is always null */}
      {!project.engagement && project.recruitment_status === 'recruiting' && (
        // Nobody can be chosen until applications exist
        <Recruiting projectId={project.id} onChoose={() => {}} />
      )}

      {/* Past end_date, or cancelled, with nobody chosen */}
      {!project.engagement && project.recruitment_status !== 'recruiting' && (
        <>
          <h2 className="text-section-title">已結束</h2>
          <p className="text-ink-muted">招募已截止，沒有選定測試人員</p>
        </>
      )}
    </div>
  )
}

function MockProject({ id }: { id: string }) {
  const { state } = useLocation()
  const [chosen, setChosen] = useState<RecruitCandidate | null>(null)
  const project = ownerProjects.find((owned) => owned.id === id)
  const details = ownerEngagementDetails[id]

  if (!project || (project.recruitmentStatus !== 'recruiting' && !details)) {
    return <Navigate to="/owner" replace />
  }

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1">
        <Link
          to="/owner"
          className="link inline-flex min-h-11 items-center gap-1.5 self-start justify-self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          專案列表
        </Link>
        <h1 className="text-subtitle tablet:col-span-1 col-span-2 row-start-2">
          {project.name}
        </h1>
        <Link
          to={`/owner/projects/${project.id}/info`}
          className="link underline-offset-5 text-role group tablet:row-start-2 col-start-2 row-start-1 inline-flex min-h-11 items-center gap-1.5 font-bold whitespace-nowrap"
        >
          <InfoIcon className="size-5 flex-none" />
          專案資訊
          <ChevronDownIcon className="size-4.5 flex-none -rotate-90 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </Link>
      </div>

      {project.engagement && details && (
        <Progress
          project={project}
          status={state?.disputed ? 'DISPUTED' : project.engagement.status}
          details={details}
        />
      )}

      {!project.engagement && chosen && (
        <Progress
          project={project}
          status="PENDING_NDA"
          details={{ tester: chosen }}
        />
      )}

      {!project.engagement && !chosen && (
        <Recruiting projectId={id} onChoose={setChosen} />
      )}
    </div>
  )
}
