import { InfoPopover } from '@/components/InfoPopover'
import { joinedProjectDetails, joinedProjects } from '@/data/tester'
import { LockedNotice } from './LockedNotice'

export function ProjectContent({
  project,
  detail,
}: {
  project: (typeof joinedProjects)[number]
  detail: (typeof joinedProjectDetails)[string]
}) {
  return (
    <article className="bg-surface border-ink tablet:p-8 flex flex-col gap-8 rounded-md border px-4 py-5">
      <section className="flex flex-col gap-3">
        <h2 className="text-section-title">簡介</h2>
        <p className="text-body-large text-ink-muted">{detail.intro}</p>
      </section>

      {/* A real project may have none, as on the project detail */}
      {detail.requirements.length > 0 && (
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
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-section-title">項目詳情</h2>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-6 gap-y-4">
          <div className="flex flex-col gap-0.5">
            <dt className="text-ink-subtle">地點</dt>
            <dd className="text-body-large font-bold">{detail.place}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-ink-subtle">設備</dt>
            {/* One device a line, like 設備 on the project detail: a real
                device is already joined with 、 */}
            <dd className="text-body-large font-bold">
              {project.devices.map((device, i) => (
                <span key={i} className="block">
                  {device}
                </span>
              ))}
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
          <span className="text-role text-[18px] font-bold">{detail.pay}</span>
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
        {(project.status === 'CANCELLED' || project.status === 'REFUNDED') && (
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
        {(project.status === 'CANCELLED' || project.status === 'REFUNDED') && (
          <LockedNotice>專案已結束</LockedNotice>
        )}
        {['FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED'].includes(
          project.status
        ) && (
          <p className="bg-page border-line text-body-large rounded-md border px-6 py-5 leading-[1.8] whitespace-pre-line">
            {detail.howToTest}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-section-title">成功標準</h2>
        {project.status === 'PENDING_NDA' && (
          <LockedNotice>待簽署保密協議及負責人付款後開放</LockedNotice>
        )}
        {project.status === 'PENDING_PAYMENT' && (
          <LockedNotice>負責人付款後開放</LockedNotice>
        )}
        {(project.status === 'CANCELLED' || project.status === 'REFUNDED') && (
          <LockedNotice>專案已結束</LockedNotice>
        )}
        {['FUNDED', 'TESTING', 'SUBMITTED', 'DISPUTED', 'COMPLETED'].includes(
          project.status
        ) && (
          <p className="bg-page border-line text-body-large rounded-md border px-6 py-5 leading-[1.8] whitespace-pre-line">
            {detail.successCriteria}
          </p>
        )}
      </section>
    </article>
  )
}
