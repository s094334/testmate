import { Link, Navigate, useParams } from 'react-router'
import { Avatar } from '@/components/Avatar'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ClockIcon } from '@/components/icons/ClockIcon'
import {
  ownerEngagementDetails,
  ownerProjects,
  ownerReports,
} from '@/data/owner'
import { BugReports } from './BugReports'
import { Decision } from './Decision'
import { TestResults } from './TestResults'

export function OwnerReportPage() {
  const { id = '' } = useParams()
  const project = ownerProjects.find((owned) => owned.id === id)
  const details = ownerEngagementDetails[id]
  const report = ownerReports[id]

  if (!project || !details) return <Navigate to="/owner" replace />
  if (project.engagement?.status !== 'SUBMITTED' || !report) {
    return <Navigate to={`/owner/projects/${id}`} replace />
  }

  return (
    <div className="max-w-page tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-6 pb-12">
      <Link
        to={`/owner/projects/${id}`}
        className="link inline-flex min-h-11 items-center gap-1.5 self-start"
      >
        <ChevronDownIcon className="rotate-90" />
        上一頁
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] leading-[1.3] font-bold">{project.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2.5">
            <Avatar
              shape={details.tester.avatarShape}
              role="tester"
              size={40}
            />
            <b className="text-[18px]">{details.tester.fullName}</b>
          </span>
          <span className="text-ink-subtle">提交 {details.submittedAt}</span>
          <span className="bg-status-pending-bg text-status-pending-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
            <ClockIcon />
            待驗收
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-subheading tablet:text-heading">測試環境</h2>
        <p className="bg-page border-line rounded-md border px-4 py-3.5">
          {report.env}
        </p>
      </section>

      <TestResults items={report.items} bugs={report.bugs} />

      <BugReports bugs={report.bugs} />

      <Decision
        projectId={id}
        testerName={details.tester.fullName}
        amount={report.amount}
      />
    </div>
  )
}
