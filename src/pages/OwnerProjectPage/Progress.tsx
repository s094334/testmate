import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '@/components/Avatar'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { ClockIcon } from '@/components/icons/ClockIcon'
import { MailIcon } from '@/components/icons/MailIcon'
import { MinusCircleIcon } from '@/components/icons/MinusCircleIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import type { EngagementDetails, OwnerProject } from '@/data/owner'
import { statusLabels, type ProjectStatus } from '@/data/tester'
import { Countdown } from '@/pages/TesterProjectPage/Countdown'
import { OverdueDialog } from './OverdueDialog'
import { RateDialog, type Rating } from './RateDialog'
import { SendEnvDialog } from './SendEnvDialog'

export function Progress({
  project,
  status,
  details,
}: {
  project: OwnerProject
  status: ProjectStatus
  details: EngagementDetails
}) {
  const [envDialogOpen, setEnvDialogOpen] = useState(false)
  const [envProvided, setEnvProvided] = useState(false)
  const [overdueDialogOpen, setOverdueDialogOpen] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [rating, setRating] = useState<Rating | null>(null)
  const [now] = useState(() => Date.now())
  const { tester } = details
  const deadline = details.submitDeadline
    ? new Date(details.submitDeadline)
    : null
  const overdue =
    status === 'TESTING' && deadline !== null && deadline.getTime() < now

  return (
    <>
      <div className="tablet:justify-between tablet:gap-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-section-title">測試進度</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap ${
            overdue
              ? 'bg-status-dispute-bg text-status-dispute-text'
              : {
                  FUNDED: 'bg-platform-soft text-platform-strong',
                  TESTING: 'bg-status-progress-bg text-status-progress-text',
                  SUBMITTED: 'bg-status-pending-bg text-status-pending-text',
                  PENDING_NDA: 'bg-status-pending-bg text-status-pending-text',
                  PENDING_PAYMENT:
                    'bg-status-pending-bg text-status-pending-text',
                  DISPUTED: 'bg-status-dispute-bg text-status-dispute-text',
                  COMPLETED: 'border-ink bg-surface text-ink border',
                  CANCELLED: 'border-ink bg-surface text-ink border',
                  REFUNDED: 'border-ink bg-surface text-ink border',
                }[status]
          }`}
        >
          {(status === 'PENDING_NDA' ||
            status === 'PENDING_PAYMENT' ||
            status === 'SUBMITTED') && <ClockIcon />}
          {(status === 'FUNDED' || (status === 'TESTING' && !overdue)) && (
            <MinusCircleIcon className="size-4" />
          )}
          {(overdue || status === 'DISPUTED') && <WarningIcon />}
          {status === 'COMPLETED' && <CheckIcon />}
          {overdue ? '報告逾期' : statusLabels[status]}
        </span>
      </div>

      {status === 'FUNDED' && envProvided && (
        <div className="bg-status-progress-bg flex gap-2.5 rounded-md px-5 py-4">
          <CheckIcon className="text-status-progress-text mt-[3px] size-5 flex-none" />
          <p className="flex flex-col">
            <b>已提供測試環境</b>等{tester.fullName}確認收到後就會開始測試。
          </p>
        </div>
      )}

      {status === 'FUNDED' && !envProvided && (
        <div className="bg-status-pending-bg flex gap-2.5 rounded-md px-5 py-4">
          <WarningIcon className="text-status-pending-text mt-[3px] size-5 flex-none" />
          <p className="flex flex-col">
            <b className="text-status-pending-text">已付款，還沒寄送測試環境</b>
            對方收到 Email 後才能開始測試，請盡快寄出測試版下載方式與測試帳號。
          </p>
        </div>
      )}

      {overdue && deadline && (
        <div className="bg-status-dispute-bg flex gap-2.5 rounded-md px-5 py-4">
          <ClockIcon className="text-status-dispute-text mt-[3px] size-5 flex-none" />
          <p className="flex flex-col">
            <b className="text-status-dispute-text">
              報告已逾期{' '}
              {Math.max(1, Math.ceil((now - deadline.getTime()) / 86400000))}{' '}
              天（期限 {deadline.getFullYear()}/
              {String(deadline.getMonth() + 1).padStart(2, '0')}/
              {String(deadline.getDate()).padStart(2, '0')}）
            </b>
            請決定是否延後 3 天，或選擇不延後取消專案。
          </p>
        </div>
      )}

      {status === 'DISPUTED' && (
        <div className="bg-status-dispute-bg flex gap-2.5 rounded-md px-5 py-4">
          <WarningIcon className="text-status-dispute-text mt-[3px] size-5 flex-none" />
          <p className="flex flex-col">
            <b className="text-status-dispute-text">驗收結果有爭議</b>
            請和{tester.fullName}協商後，回到平台選擇結果。
          </p>
        </div>
      )}

      <div className="bg-surface tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 tablet:px-7 tablet:py-6 flex flex-col gap-4 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <Avatar shape={tester.avatarShape} role="tester" size={48} />
            <div className="flex flex-col">
              <h3 className="text-[20px] leading-[1.4]">{tester.fullName}</h3>
              <p className="text-ink-muted inline-flex items-center gap-1">
                <span className="text-star flex">
                  <StarIcon />
                </span>
                <b className="text-ink">{tester.rating}</b>
                <button type="button" className="min-h-8 cursor-pointer">
                  （{tester.reviews} 則評論）
                </button>
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-1">
            <div className="flex gap-2">
              <dt className="text-ink-subtle w-18 flex-none">所在地</dt>
              <dd>{tester.city}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-subtle w-18 flex-none">QA 年資</dt>
              <dd>{tester.years}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-subtle w-18 flex-none">裝置</dt>
              <dd>{tester.devices.join('、')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-subtle w-18 flex-none">語言</dt>
              <dd>{tester.languages.join('、')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-subtle w-18 flex-none">Email</dt>
              <dd className="min-w-0 wrap-anywhere">
                <a
                  href={`mailto:${tester.email}`}
                  className="text-role underline"
                >
                  {tester.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="tablet:items-end tablet:max-w-90 flex flex-none flex-col gap-2.5">
          {status === 'PENDING_PAYMENT' && (
            <button type="button" className="btn btn-primary">
              付款
            </button>
          )}
          {status === 'FUNDED' && (
            <button
              type="button"
              onClick={() => setEnvDialogOpen(true)}
              className="btn btn-primary"
            >
              <MailIcon className="size-4.5" />
              寄送測試環境
            </button>
          )}
          {overdue && (
            <button
              type="button"
              onClick={() => setOverdueDialogOpen(true)}
              className="btn border-status-dispute-text bg-status-dispute-text text-surface"
            >
              處理逾期
            </button>
          )}
          {status === 'SUBMITTED' && (
            <Link
              to={`/owner/projects/${project.id}/report`}
              className="btn btn-primary"
            >
              查看報告
            </Link>
          )}
          {status === 'COMPLETED' && (
            <button
              type="button"
              onClick={() => setRateDialogOpen(true)}
              className="btn btn-primary"
            >
              {rating ? '編輯評價' : '評價'}
            </button>
          )}

          {status === 'PENDING_NDA' && (
            <p className="text-ink-subtle tablet:text-right">
              剛選定，等對方簽署
            </p>
          )}
          {status === 'PENDING_PAYMENT' && (
            <p className="text-ink-subtle tablet:text-right">
              {details.ndaSignedAt} 已簽署保密協議，請在 3 天內付款
            </p>
          )}
          {status === 'TESTING' && !overdue && (
            <p className="text-ink-subtle tablet:text-right">
              {details.startedAt} 開始測試
            </p>
          )}
          {status === 'SUBMITTED' && (
            <p className="text-ink-subtle tablet:text-right">
              {details.submittedAt} 已提交報告
            </p>
          )}
          {status === 'COMPLETED' && !rating && details.rateDeadline && (
            <Countdown
              label="評價期限"
              deadline={details.rateDeadline}
              className="text-ink-subtle tablet:items-end tablet:text-right flex flex-col"
            />
          )}
          {status === 'COMPLETED' && rating && (
            <Countdown
              label="可修改至"
              deadline={rating.editableUntil}
              className="text-ink-subtle tablet:items-end tablet:text-right flex flex-col"
            />
          )}
        </div>
      </div>

      {status === 'FUNDED' && (
        <SendEnvDialog
          open={envDialogOpen}
          onOpenChange={setEnvDialogOpen}
          testerName={tester.fullName}
          testerEmail={tester.email}
          projectName={project.name}
          testPeriod={project.details.testPeriod}
          onProvided={() => {
            setEnvProvided(true)
            setEnvDialogOpen(false)
          }}
        />
      )}

      {overdue && deadline && (
        <OverdueDialog
          open={overdueDialogOpen}
          onOpenChange={setOverdueDialogOpen}
          testerName={tester.fullName}
          deadline={deadline}
        />
      )}

      {rateDialogOpen && details.rateDeadline && (
        <RateDialog
          onClose={() => setRateDialogOpen(false)}
          testerName={tester.fullName}
          testerEmail={tester.email}
          rateDeadline={details.rateDeadline}
          saved={rating}
          onSave={setRating}
        />
      )}
    </>
  )
}
