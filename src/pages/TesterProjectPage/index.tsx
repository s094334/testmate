import { Link, Navigate, useParams } from 'react-router'
import { InfoPopover } from '@/components/InfoPopover'
import { StatusTag } from '@/components/StatusTag'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { Countdown } from './Countdown'
import { LockedNotice } from './LockedNotice'

export function TesterProjectPage() {
  const { id = '' } = useParams()
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]

  if (!project || !detail) return <Navigate to="/tester" replace />

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <Link
        to="/tester"
        className="tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
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

      <div className="bg-role-soft text-role-text tablet:px-6 tablet:py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-md px-4 py-3">
        {tester.payout && (
          <p className="tablet:text-[18px] font-bold">請在期限內簽署保密協議</p>
        )}
        {!tester.payout && (
          <div className="flex flex-col gap-1">
            <p className="tablet:text-[18px] font-bold">請先設定收款帳戶</p>
            <p>設定完成後，即可簽署保密協議</p>
          </div>
        )}
        {detail.ndaDeadline && (
          <Countdown
            label="簽署期限"
            deadline={detail.ndaDeadline}
            className="tablet:flex ml-auto hidden flex-col items-end text-right"
          />
        )}
        {tester.payout && (
          <Link
            to={`/tester/projects/${project.id}/nda`}
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink tablet:inline-flex hidden min-h-12 min-w-40 items-center justify-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            簽署保密協議
          </Link>
        )}
        {!tester.payout && (
          <Link
            to="/tester/profile"
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink tablet:inline-flex hidden min-h-12 min-w-40 items-center justify-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            前往設定
          </Link>
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
          <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">如何測試</h2>
          <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-section-title">驗收與撥款</h2>
          <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
        </section>
      </article>

      <div className="border-line bg-surface tablet:hidden sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t px-4 py-3">
        {detail.ndaDeadline && (
          <Countdown
            label="簽署期限"
            deadline={detail.ndaDeadline}
            className="text-ink-subtle flex basis-full flex-wrap items-baseline justify-between gap-x-2"
          />
        )}
        <Link
          to="/tester"
          className="border-role bg-surface text-ink hover:bg-role hover:text-on-role inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          <ChevronDownIcon className="size-4.5 rotate-90" />
          上一頁
        </Link>
        {tester.payout && (
          <Link
            to={`/tester/projects/${project.id}/nda`}
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            簽署保密協議
          </Link>
        )}
        {!tester.payout && (
          <Link
            to="/tester/profile"
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            前往設定
          </Link>
        )}
      </div>
    </div>
  )
}
