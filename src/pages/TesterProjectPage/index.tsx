import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { InfoPopover } from '@/components/InfoPopover'
import { StatusTag } from '@/components/StatusTag'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { Countdown } from './Countdown'
import { DisputeDialog } from './DisputeDialog'
import { LockedNotice } from './LockedNotice'
import { RateDialog, type Rating } from './RateDialog'
import { ReceivedEnvDialog } from './ReceivedEnvDialog'

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

      <div
        className={`tablet:px-6 tablet:py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md px-4 py-3 ${
          {
            PENDING_NDA: 'bg-role-soft text-role-text',
            PENDING_PAYMENT: 'bg-role-soft text-role-text',
            FUNDED: 'bg-role-soft text-role-text',
            TESTING: 'bg-role-soft text-role-text',
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
        {project.status === 'TESTING' && (
          <p className="tablet:text-[18px] font-bold">
            依測試說明進行測試，完成後提交測試報告
          </p>
        )}
        {project.status === 'SUBMITTED' && (
          <p className="tablet:text-[18px] font-bold">已送出，等負責人驗收</p>
        )}
        {project.status === 'DISPUTED' && (
          <p className="tablet:text-[18px] font-bold">
            驗收結果有爭議，平台正在協調
          </p>
        )}
        {project.status === 'COMPLETED' && (
          <p className="tablet:text-[18px] font-bold">
            驗收通過，報酬已撥款給你
          </p>
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
            onClick={() => setEnvDialogOpen(true)}
            className="btn btn-primary tablet:inline-flex hidden min-w-40"
          >
            開始測試
          </button>
        )}
        {project.status === 'TESTING' && (
          <button
            type="button"
            className="btn btn-primary tablet:inline-flex hidden min-w-40"
          >
            提交報告
          </button>
        )}
        {project.status === 'DISPUTED' && (
          <button
            type="button"
            onClick={() => setDisputeDialogOpen(true)}
            className="btn border-status-dispute-text bg-status-dispute-text text-surface tablet:inline-flex hidden min-w-40"
          >
            爭議處理
          </button>
        )}
        {project.status === 'COMPLETED' && (
          <button
            type="button"
            onClick={() => setRateDialogOpen(true)}
            className="btn btn-primary tablet:inline-flex hidden min-w-40"
          >
            {rating ? '編輯評價' : '評價'}
          </button>
        )}
      </div>

      <article className="bg-surface border-ink tablet:p-8 flex flex-col gap-8 rounded-md border px-4 py-5">
        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">簡介</h2>
          <p className="text-body-large text-ink-muted">{detail.intro}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">特殊要求</h2>
          <ul className="bg-page border-line flex flex-col gap-3 rounded-md border px-6 py-5">
            {detail.requirements.map((requirement) => (
              <li
                key={requirement}
                className="text-body-large leading-[1.8] whitespace-pre-line"
              >
                {requirement}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">項目詳情</h2>
          <dl className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-6 gap-y-4">
            <div className="flex flex-col gap-0.5">
              <dt className="text-ink-subtle">地點</dt>
              <dd className="text-body-large font-bold">{detail.place}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-ink-subtle">設備</dt>
              <dd className="text-body-large font-bold">
                {project.devices.join('、')}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-ink-subtle">測試期間</dt>
              <dd className="text-body-large font-bold">
                {detail.startDate}–{detail.endDate}
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-section-title">收益</h2>
            <InfoPopover label="收益說明">
              開工前由平台代管，驗收通過後撥款
            </InfoPopover>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-role text-[18px] font-bold">
              {detail.pay}
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">聯絡方式</h2>
          {project.status === 'PENDING_NDA' && (
            <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
          )}
          {project.status === 'PENDING_PAYMENT' && (
            <LockedNotice>負責人付款後開放</LockedNotice>
          )}
          {(project.status === 'CANCELLED' ||
            project.status === 'REFUNDED') && (
            <LockedNotice>專案已結束</LockedNotice>
          )}
          {['FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED'].includes(
            project.status
          ) && (
            <div className="flex flex-col gap-0.5">
              <span className="text-ink-subtle">公司信箱</span>
              <a
                href={`mailto:${detail.ownerEmail}`}
                className="link text-role text-body-large self-start font-bold wrap-anywhere"
              >
                {detail.ownerEmail}
              </a>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">如何測試</h2>
          {project.status === 'PENDING_NDA' && (
            <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
          )}
          {project.status === 'PENDING_PAYMENT' && (
            <LockedNotice>負責人付款後開放</LockedNotice>
          )}
          {(project.status === 'CANCELLED' ||
            project.status === 'REFUNDED') && (
            <LockedNotice>專案已結束</LockedNotice>
          )}
          {['FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED'].includes(
            project.status
          ) && (
            <ol>
              {detail.testItems?.map((item, index) => (
                <li
                  key={item}
                  className="border-line flex min-h-12 items-center gap-3 border-t py-3 first:border-t-0"
                >
                  <span className="font-num text-num-heading text-ink-subtle">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="tablet:text-body-large">{item}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">驗收與撥款</h2>
          {project.status === 'PENDING_NDA' && (
            <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
          )}
          {project.status === 'PENDING_PAYMENT' && (
            <LockedNotice>負責人付款後開放</LockedNotice>
          )}
          {project.status === 'FUNDED' && (
            <LockedNotice>測試開始後開放</LockedNotice>
          )}
          {(project.status === 'CANCELLED' ||
            project.status === 'REFUNDED') && (
            <LockedNotice>專案已結束</LockedNotice>
          )}
          {project.status === 'TESTING' && (
            <p className="bg-status-progress-bg tablet:px-6 tablet:py-5 rounded-md p-4 font-bold">
              測試進行中，完成後提交測試報告
            </p>
          )}
          {project.status === 'SUBMITTED' && (
            <p className="bg-status-pending-bg text-status-pending-text tablet:px-6 tablet:py-5 rounded-md p-4 font-bold">
              {detail.submittedAt} 送出，負責人逐項確認中
            </p>
          )}
          {project.status === 'DISPUTED' && (
            <p className="bg-status-dispute-bg text-status-dispute-text tablet:px-6 tablet:py-5 rounded-md p-4 font-bold">
              驗收結果有爭議，平台會在 3 個工作天內回覆
            </p>
          )}
          {project.status === 'COMPLETED' && (
            <p className="border-line tablet:px-6 tablet:py-5 rounded-md border p-4 font-bold">
              {detail.paidAt} 已撥款 {detail.pay}
            </p>
          )}
        </section>
      </article>

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
            onClick={() => setEnvDialogOpen(true)}
            className="btn btn-primary flex-1 px-4"
          >
            開始測試
          </button>
        )}
        {project.status === 'TESTING' && (
          <button type="button" className="btn btn-primary flex-1 px-4">
            提交報告
          </button>
        )}
        {project.status === 'DISPUTED' && (
          <button
            type="button"
            onClick={() => setDisputeDialogOpen(true)}
            className="btn border-status-dispute-text bg-status-dispute-text text-surface flex-1 px-4"
          >
            爭議處理
          </button>
        )}
        {project.status === 'COMPLETED' && (
          <button
            type="button"
            onClick={() => setRateDialogOpen(true)}
            className="btn btn-primary flex-1 px-4"
          >
            {rating ? '編輯評價' : '評價'}
          </button>
        )}
      </div>

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
          pay={detail.pay}
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
