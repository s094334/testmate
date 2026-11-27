import { useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router'
import {
  useDeclineApplication,
  useProjectApplications,
  useSelectApplication,
} from '@/api/applications'
import { ApiError } from '@/api/client'
import { useEngagement } from '@/api/engagements'
import { useProject } from '@/api/projects'
import { useSession } from '@/api/session'
import type { Application, Project, TesterCard } from '@/api/types'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { InfoIcon } from '@/components/icons/InfoIcon'
import { toast } from '@/components/ui/toast'
import {
  isMockOwnerProject,
  ownerEngagementDetails,
  ownerProjects,
  recruitCandidates,
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
  const { data: applications, isError: applicationsFailed } =
    useProjectApplications(
      id,
      !!project &&
        project.owner_id === user?.id &&
        !project.engagement &&
        project.recruitment_status === 'recruiting'
    )
  const select = useSelectApplication(id)
  const decline = useDeclineApplication(id)
  // One 選定 or 婉拒 at a time. isPending only shows on the next render, and a
  // second press can come first
  const sending = useRef(false)

  // Settles once the request and the refetch after it are done; a failure
  // is shown, not thrown, so the dialog can close either way
  async function send(request: () => Promise<unknown>) {
    if (sending.current) return
    sending.current = true
    try {
      await request()
    } catch (error) {
      toastError(error as Error)
    } finally {
      sending.current = false
    }
  }

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

      {project.engagement && (
        <EngagementProgress
          project={project}
          engagementId={project.engagement.id}
        />
      )}

      {!project.engagement &&
        project.recruitment_status === 'recruiting' &&
        (applications ? (
          <Recruiting
            projectId={project.id}
            candidates={applications.items.flatMap(candidateOf)}
            onChoose={(candidate) =>
              send(async () => {
                await select.mutateAsync(candidate.id)
                window.scrollTo(0, 0)
              })
            }
            onDecline={(candidate) =>
              send(() => decline.mutateAsync(candidate.id))
            }
            busy={select.isPending || decline.isPending}
          />
        ) : (
          <p className="text-ink-muted">
            {applicationsFailed
              ? '申請名單載入失敗，請重新整理再試一次。'
              : '載入中…'}
          </p>
        ))}

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

function toastError(error: Error) {
  toast.add({
    title: error instanceof ApiError ? error.message : '無法連線，請稍後再試',
    timeout: 4000,
  })
}

// 測試進度 of a real engagement. Only PENDING_NDA can happen for now: the
// other statuses show the mock flow's buttons, which do nothing yet
function EngagementProgress({
  project,
  engagementId,
}: {
  project: Project
  engagementId: string
}) {
  const { data: engagement, isError } = useEngagement(engagementId)

  if (!engagement) {
    return (
      <p className="text-ink-muted">
        {isError ? '測試進度載入失敗，請重新整理再試一次。' : '載入中…'}
      </p>
    )
  }

  return (
    <Progress
      project={{
        id: project.id,
        name: project.name,
        details: {
          testPeriod: `${project.start_date.replaceAll('-', '/')}–${project.end_date.replaceAll('-', '/')}`,
        },
      }}
      status={engagement.status}
      details={{
        tester: {
          ...testerOf(engagement.tester),
          // The real name and email only once the payment is in escrow
          fullName:
            engagement.disclosed?.tester_contact.real_name ??
            engagement.tester.nickname ??
            '未設定暱稱',
          email: engagement.disclosed?.tester_contact.email ?? '',
        },
        ndaSignedAt: engagement.nda_signed_at
          ? new Date(engagement.nda_signed_at).toLocaleDateString('zh-TW', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : undefined,
      }}
    />
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
        <Recruiting
          projectId={id}
          candidates={recruitCandidates[id] ?? []}
          onChoose={(candidate) => {
            setChosen(candidate)
            window.scrollTo(0, 0)
          }}
        />
      )}
    </div>
  )
}

// An application in the shape the mock candidates have
function candidateOf({
  id,
  source,
  status,
  tester,
}: Application): RecruitCandidate[] {
  if (!tester) return []

  return [
    {
      ...testerOf(tester),
      id,
      // Not the real name or a masked one; see TesterCard
      name: tester.nickname ?? '未設定暱稱',
      // Only known after payment; only the mock projects' 選定 reads them
      fullName: '',
      email: '',
      status:
        status === 'declined'
          ? 'declined'
          : source === 'invited'
            ? 'interest'
            : 'applied',
    },
  ]
}

// The card fields the applicant list and 測試進度 share
function testerOf(tester: TesterCard) {
  return {
    avatarShape: tester.avatar_shape,
    rating: tester.average_score,
    reviews: tester.rating_count,
    city: tester.city,
    // The same ranges as 最低年資 on 發布專案
    years:
      tester.qa_years === null
        ? '無 QA 經驗'
        : tester.qa_years === 0
          ? '未滿 1 年'
          : tester.qa_years <= 2
            ? '1–2 年'
            : tester.qa_years <= 5
              ? '3–5 年'
              : '超過 5 年',
    devices: deviceLinesOf(tester.devices),
    // （母語） as on the project info page
    languages: tester.languages.map(
      (language) => language.name + (language.native ? '（母語）' : '')
    ),
    interests: tester.interests,
  }
}

// One line a brand, in the order the tester saved them:
// iPhone（iPhone 16 Pro（iOS 27.2）、iPhone 12 Pro（iOS 26））.
// A custom device gets its own line: 自訂名稱（系統版本）
function deviceLinesOf(devices: TesterCard['devices']) {
  const lines: { brand: string | null; head: string; items: string[] }[] = []
  for (const device of devices) {
    const brand = device.custom_name ? null : device.brand
    const model = brand && device.model
    const item =
      model && device.os_version
        ? `${model}（${device.os_version}）`
        : model || device.os_version || ''
    const group = brand && lines.find((line) => line.brand === brand)
    if (group) group.items.push(item)
    else
      lines.push({
        brand,
        head: device.custom_name ?? device.brand ?? '',
        items: [item],
      })
  }
  return lines.map(({ head, items }) =>
    items.some(Boolean)
      ? `${head}（${items.filter(Boolean).join('、')}）`
      : head
  )
}
