import { Link } from 'react-router'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { Countdown } from './Countdown'
import { type Rating } from './RateDialog'

export function StatusBanner({
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
    <div
      className={`tablet:px-6 tablet:py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md px-4 py-3 ${
        {
          PENDING_NDA: 'bg-role-soft text-role-text',
          PENDING_PAYMENT: 'bg-role-soft text-role-text',
          FUNDED: 'bg-role-soft text-role-text',
          TESTING: overdue
            ? 'bg-status-dispute-bg text-status-dispute-text'
            : 'bg-role-soft text-role-text',
          SUBMITTED: 'bg-role-soft text-role-text',
          DISPUTED: 'bg-status-dispute-bg text-status-dispute-text',
          COMPLETED: 'bg-role-soft text-role-text',
          CANCELLED: 'bg-status-progress-bg text-ink-muted',
          REFUNDED: 'bg-status-progress-bg text-ink-muted',
        }[project.status]
      }`}
    >
      {project.status === 'PENDING_NDA' && tester.payout && (
        <p className="tablet:text-[18px] font-bold">請在期限內簽署保密協議</p>
      )}
      {project.status === 'PENDING_NDA' && !tester.payout && (
        <div className="flex flex-col gap-1">
          <p className="tablet:text-[18px] font-bold">請先設定收款帳戶</p>
          <p>設定完成後，即可簽署保密協議</p>
        </div>
      )}
      {project.status === 'PENDING_PAYMENT' && (
        <div className="flex flex-col gap-1">
          <p className="tablet:text-[18px] font-bold">
            已簽署保密協議，待負責人付款
          </p>
          {detail.payDeadline && (
            <p>
              負責人需在{' '}
              <time dateTime={detail.payDeadline}>
                {new Date(detail.payDeadline).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </time>{' '}
              前付款，如逾期則合作會自動取消。
            </p>
          )}
        </div>
      )}
      {project.status === 'FUNDED' && (
        <p className="tablet:text-[18px] font-bold">
          報酬已由平台代管，收到測試環境後就能開始測試
        </p>
      )}
      {project.status === 'TESTING' && !overdue && (
        <p className="tablet:text-[18px] font-bold">
          依測試說明進行測試，完成後提交測試報告
        </p>
      )}
      {overdue && (
        <div className="flex flex-col gap-1">
          <p className="tablet:text-[18px] font-bold">
            已超過提交期限，現在無法繳交，待負責人決定是否延期。
          </p>
          <p className="text-ink">
            如果之前有儲存測試報告內容，會暫時保留，待確認延期後，可以繼續填寫。
          </p>
        </div>
      )}
      {project.status === 'SUBMITTED' && (
        <p className="tablet:text-[18px] font-bold">已送出，等負責人驗收</p>
      )}
      {project.status === 'DISPUTED' && (
        <p className="tablet:text-[18px] font-bold">
          驗收結果有爭議，請和負責人協商後，回平台選擇結果
        </p>
      )}
      {project.status === 'COMPLETED' && (
        <p className="tablet:text-[18px] font-bold">驗收通過，報酬已撥款給你</p>
      )}
      {project.status === 'CANCELLED' && (
        <p className="tablet:text-[18px] font-bold">這筆媒合已取消</p>
      )}
      {project.status === 'REFUNDED' && (
        <p className="tablet:text-[18px] font-bold">
          未完成，代管款已退回負責人
        </p>
      )}

      {project.status === 'PENDING_NDA' && detail.ndaDeadline && (
        <Countdown
          label="簽署期限"
          deadline={detail.ndaDeadline}
          className="tablet:flex ml-auto hidden flex-col items-end text-right"
        />
      )}
      {project.status === 'TESTING' && detail.submitDeadline && (
        <Countdown
          label="提交期限"
          deadline={detail.submitDeadline}
          className="tablet:flex ml-auto hidden flex-col items-end text-right"
        />
      )}
      {project.status === 'DISPUTED' && detail.disputeDeadline && (
        <Countdown
          label="選擇期限"
          deadline={detail.disputeDeadline}
          urgent
          className="tablet:flex ml-auto hidden flex-col items-end text-right"
        />
      )}
      {project.status === 'COMPLETED' && !rating && detail.rateDeadline && (
        <Countdown
          label="評價期限"
          deadline={detail.rateDeadline}
          className="tablet:flex ml-auto hidden flex-col items-end text-right"
        />
      )}
      {project.status === 'COMPLETED' && rating && (
        <Countdown
          label="可修改至"
          deadline={rating.editableUntil}
          className="tablet:flex ml-auto hidden flex-col items-end text-right"
        />
      )}

      {project.status === 'PENDING_NDA' && tester.payout && (
        <Link
          to={`/tester/projects/${project.id}/nda`}
          className="btn btn-primary tablet:inline-flex hidden min-w-40"
        >
          簽署保密協議
        </Link>
      )}
      {project.status === 'PENDING_NDA' && !tester.payout && (
        <Link
          to="/tester/profile"
          className="btn btn-primary tablet:inline-flex hidden min-w-40"
        >
          前往設定
        </Link>
      )}
      {project.status === 'FUNDED' && (
        <button
          type="button"
          onClick={onOpenEnvDialog}
          className="btn btn-primary tablet:inline-flex hidden min-w-40"
        >
          開始測試
        </button>
      )}
      {project.status === 'TESTING' && !overdue && (
        <Link
          to={`/tester/projects/${project.id}/report`}
          className="btn btn-primary tablet:inline-flex hidden min-w-40"
        >
          提交報告
        </Link>
      )}
      {project.status === 'DISPUTED' && (
        <button
          type="button"
          onClick={onOpenDisputeDialog}
          className="btn border-status-dispute-text bg-status-dispute-text text-surface tablet:inline-flex hidden min-w-40"
        >
          爭議處理
        </button>
      )}
      {project.status === 'COMPLETED' && (
        <button
          type="button"
          onClick={onOpenRateDialog}
          className="btn btn-primary tablet:inline-flex hidden min-w-40"
        >
          {rating ? '編輯評價' : '評價'}
        </button>
      )}
    </div>
  )
}
