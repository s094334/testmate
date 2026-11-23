import { Link } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { Countdown } from './Countdown'
import { type Rating } from './RateDialog'

export function MobileActionBar({
  project,
  detail,
  overdue,
  rating,
  onOpenEnvDialog,
  onOpenDisputeDialog,
  onOpenRateDialog,
}: {
  project: (typeof joinedProjects)[number]
  detail: (typeof joinedProjectDetails)[string]
  overdue: boolean
  rating: Rating | null
  onOpenEnvDialog: () => void
  onOpenDisputeDialog: () => void
  onOpenRateDialog: () => void
}) {
  return (
    <div className="border-line bg-surface tablet:hidden sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t px-4 py-3">
      {project.status === 'PENDING_NDA' && detail.ndaDeadline && (
        <Countdown
          label="簽署期限"
          deadline={detail.ndaDeadline}
          className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
        />
      )}
      {project.status === 'TESTING' && detail.submitDeadline && (
        <Countdown
          label="提交期限"
          deadline={detail.submitDeadline}
          className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
        />
      )}
      {project.status === 'DISPUTED' && detail.disputeDeadline && (
        <Countdown
          label="選擇期限"
          deadline={detail.disputeDeadline}
          urgent
          className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
        />
      )}
      {project.status === 'COMPLETED' && !rating && detail.rateDeadline && (
        <Countdown
          label="評價期限"
          deadline={detail.rateDeadline}
          className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
        />
      )}
      {project.status === 'COMPLETED' && rating && (
        <Countdown
          label="可修改至"
          deadline={rating.editableUntil}
          className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
        />
      )}
      <Link to="/tester" className="btn btn-secondary flex-1 gap-1.5 px-4">
        <ChevronDownIcon className="size-4.5 rotate-90" />
        上一頁
      </Link>
      {project.status === 'PENDING_NDA' && tester.payout && (
        <Link
          to={`/tester/projects/${project.id}/nda`}
          className="btn btn-primary flex-1 px-4"
        >
          簽署保密協議
        </Link>
      )}
      {project.status === 'PENDING_NDA' && !tester.payout && (
        <Link to="/tester/profile" className="btn btn-primary flex-1 px-4">
          前往設定
        </Link>
      )}
      {project.status === 'FUNDED' && (
        <button
          type="button"
          onClick={onOpenEnvDialog}
          className="btn btn-primary flex-1 px-4"
        >
          開始測試
        </button>
      )}
      {project.status === 'TESTING' && !overdue && (
        <Link
          to={`/tester/projects/${project.id}/report`}
          className="btn btn-primary flex-1 px-4"
        >
          提交報告
        </Link>
      )}
      {project.status === 'DISPUTED' && (
        <button
          type="button"
          onClick={onOpenDisputeDialog}
          className="btn border-status-dispute-text bg-status-dispute-text text-surface flex-1 px-4"
        >
          爭議處理
        </button>
      )}
      {project.status === 'COMPLETED' && (
        <button
          type="button"
          onClick={onOpenRateDialog}
          className="btn btn-primary flex-1 px-4"
        >
          {rating ? '編輯評價' : '評價'}
        </button>
      )}
    </div>
  )
}
