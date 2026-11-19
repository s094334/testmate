import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ClockIcon } from '@/components/icons/ClockIcon'
import { CrossIcon } from '@/components/icons/CrossIcon'
import { ExclamationIcon } from '@/components/icons/ExclamationIcon'
import { HeartIcon } from '@/components/icons/HeartIcon'
import { InfoIcon } from '@/components/icons/InfoIcon'
import { SendIcon } from '@/components/icons/SendIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { ownerProjects, recruitCandidates } from '@/data/owner'

export function OwnerProjectPage() {
  const { id = '' } = useParams()
  const [tab, setTab] = useState('candidates')
  const [candidates, setCandidates] = useState(recruitCandidates[id] ?? [])
  const [chosenId, setChosenId] = useState<string | null>(null)
  const project = ownerProjects.find((owned) => owned.id === id)
  const chosen = candidates.find((candidate) => candidate.id === chosenId)

  if (!project || project.recruitmentStatus !== 'recruiting') {
    return <Navigate to="/owner" replace />
  }

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1">
        <Link
          to="/owner"
          className="inline-flex min-h-11 items-center gap-1.5 self-start justify-self-start decoration-2 underline-offset-3 hover:underline"
        >
          <ChevronDownIcon className="rotate-90" />
          專案列表
        </Link>
        <h1 className="text-subtitle tablet:col-span-1 col-span-2 row-start-2">
          {project.name}
        </h1>
        <Link
          to={`/owner/projects/${project.id}/info`}
          className="text-role group tablet:row-start-2 col-start-2 row-start-1 inline-flex min-h-11 items-center gap-1.5 font-bold whitespace-nowrap decoration-2 underline-offset-5 hover:underline"
        >
          <InfoIcon className="size-5 flex-none" />
          專案資訊
          <ChevronDownIcon className="size-4.5 flex-none -rotate-90 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </Link>
      </div>

      {chosen && (
        <>
          <div className="tablet:justify-between tablet:gap-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-section-title">測試進度</h2>
            <span className="bg-status-pending-bg text-status-pending-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
              <ClockIcon />
              待簽署保密協議
            </span>
          </div>

          <div className="bg-surface tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 tablet:px-7 tablet:py-6 flex flex-col gap-4 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
            <div className="flex min-w-0 flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="border-tester bg-tester-soft inline-flex size-12 flex-none items-center justify-center rounded-full border-3 text-[18px] font-bold">
                  {chosen.initial}
                </span>
                <div className="flex flex-col">
                  <h3 className="text-[20px] leading-[1.4]">
                    {chosen.fullName}
                  </h3>
                  <p className="text-ink-muted inline-flex items-center gap-1">
                    <span className="text-star flex">
                      <StarIcon />
                    </span>
                    <b className="text-ink">{chosen.rating}</b>
                    ／5、
                    <button
                      type="button"
                      className="min-h-8 cursor-pointer underline underline-offset-3"
                    >
                      {chosen.reviews} 則評論
                    </button>
                  </p>
                </div>
              </div>

              <dl className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">所在地</dt>
                  <dd>{chosen.city}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">QA 年資</dt>
                  <dd>{chosen.years}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">裝置</dt>
                  <dd>{chosen.devices.join('、')}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">語言</dt>
                  <dd>{chosen.languages.join('、')}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">Email</dt>
                  <dd className="min-w-0 wrap-anywhere">
                    <a
                      href={`mailto:${chosen.email}`}
                      className="text-role underline"
                    >
                      {chosen.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <p className="text-ink-subtle tablet:text-right">
              剛選定，等對方簽署
            </p>
          </div>
        </>
      )}

      {!chosen && (
        <>
          <h2 className="text-section-title">招募中</h2>

          <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
            <TabsList className="bg-surface tablet:relative tablet:order-none tablet:z-1 tablet:mx-0 tablet:mt-0 tablet:-mb-px tablet:gap-1 tablet:bg-transparent tablet:p-0 tablet:shadow-none sticky bottom-0 z-5 order-last -mx-4 mt-2 -mb-12 flex gap-2 px-4 pt-2.5 pb-4 shadow-[0_-4px_16px_rgb(30_30_28/8%)]">
              <TabsTrigger
                value="candidates"
                className="bg-page text-ink data-active:bg-role-soft data-active:text-role tablet:flex-none tablet:h-12 tablet:min-h-0 tablet:rounded-none tablet:rounded-t-md tablet:border tablet:border-b-0 tablet:border-transparent tablet:bg-transparent tablet:px-4 tablet:text-[18px] tablet:font-medium tablet:text-ink-subtle tablet:data-active:border-ink tablet:data-active:bg-surface tablet:data-active:text-ink desktop:px-6 desktop:text-[20px] flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out data-active:font-bold"
              >
                邀請與申請
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="bg-page text-ink data-active:bg-role-soft data-active:text-role tablet:flex-none tablet:h-12 tablet:min-h-0 tablet:rounded-none tablet:rounded-t-md tablet:border tablet:border-b-0 tablet:border-transparent tablet:bg-transparent tablet:px-4 tablet:text-[18px] tablet:font-medium tablet:text-ink-subtle tablet:data-active:border-ink tablet:data-active:bg-surface tablet:data-active:text-ink desktop:px-6 desktop:text-[20px] flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out data-active:font-bold"
              >
                推薦 QA
              </TabsTrigger>
            </TabsList>

            <div
              className={`tablet:bg-surface tablet:border-ink tablet:overflow-hidden tablet:rounded-md tablet:border ${tab === 'candidates' ? 'tablet:rounded-tl-none' : ''}`}
            >
              <TabsContent value="candidates">
                <ul className="tablet:gap-0 flex flex-col gap-3">
                  {candidates
                    .sort(
                      (a, b) =>
                        ['interest', 'applied', 'noreply', 'declined'].indexOf(
                          a.status
                        ) -
                        ['interest', 'applied', 'noreply', 'declined'].indexOf(
                          b.status
                        )
                    )
                    .map((candidate) => (
                      <li
                        key={candidate.id}
                        className="bg-surface tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 tablet:rounded-none tablet:border-t tablet:border-line tablet:p-4 tablet:shadow-none tablet:first:border-t-0 desktop:px-7 desktop:py-6 flex flex-col gap-4 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]"
                      >
                        <div className="flex min-w-0 flex-col gap-2.5">
                          <div className="flex items-center gap-3">
                            <span className="border-tester bg-tester-soft inline-flex size-12 flex-none items-center justify-center rounded-full border-3 text-[18px] font-bold">
                              {candidate.initial}
                            </span>
                            <div className="flex flex-col">
                              <h3 className="text-[20px] leading-[1.4]">
                                {candidate.name}
                              </h3>
                              <p className="text-ink-muted inline-flex items-center gap-1">
                                <span className="text-star flex">
                                  <StarIcon />
                                </span>
                                <b className="text-ink">{candidate.rating}</b>
                                ／5、
                                <button
                                  type="button"
                                  className="min-h-8 cursor-pointer underline underline-offset-3"
                                >
                                  {candidate.reviews} 則評論
                                </button>
                              </p>
                            </div>
                          </div>

                          <dl className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <dt className="text-ink-subtle w-18 flex-none">
                                所在地
                              </dt>
                              <dd>{candidate.city}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-ink-subtle w-18 flex-none">
                                QA 年資
                              </dt>
                              <dd>{candidate.years}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-ink-subtle w-18 flex-none">
                                裝置
                              </dt>
                              <dd>{candidate.devices.join('、')}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-ink-subtle w-18 flex-none">
                                語言
                              </dt>
                              <dd>{candidate.languages.join('、')}</dd>
                            </div>
                            <div className="flex items-start gap-2">
                              <dt className="text-ink-subtle w-18 flex-none pt-0.5">
                                興趣
                              </dt>
                              <dd>
                                <ul className="flex flex-wrap gap-1.5">
                                  {candidate.interests.map((interest) => (
                                    <li
                                      key={interest}
                                      className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5"
                                    >
                                      {interest}
                                    </li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="tablet:w-auto tablet:max-w-90 tablet:flex-none tablet:items-end flex w-full flex-col items-start gap-2.5">
                          {candidate.status === 'interest' && (
                            <span className="bg-tester-soft text-tester-text relative inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                              <HeartIcon />
                              接受邀請
                              <span className="bg-alert text-surface absolute -top-[9px] -right-[9px] flex size-[18px] items-center justify-center rounded-full shadow-[0_0_0_2px_var(--color-surface)]">
                                <ExclamationIcon />
                                <span className="sr-only">需要處理</span>
                              </span>
                            </span>
                          )}
                          {candidate.status === 'applied' && (
                            <span className="bg-owner-soft text-owner-strong relative inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                              <SendIcon />
                              主動申請
                              <span className="bg-alert text-surface absolute -top-[9px] -right-[9px] flex size-[18px] items-center justify-center rounded-full shadow-[0_0_0_2px_var(--color-surface)]">
                                <ExclamationIcon />
                                <span className="sr-only">需要處理</span>
                              </span>
                            </span>
                          )}
                          {candidate.status === 'noreply' && (
                            <span className="bg-status-progress-bg text-status-progress-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                              <ClockIcon />
                              未回覆
                            </span>
                          )}
                          {candidate.status === 'declined' && (
                            <span className="border-line-input bg-surface text-ink-subtle inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-0.5 font-bold whitespace-nowrap">
                              <CrossIcon />
                              已婉拒
                            </span>
                          )}

                          {(candidate.status === 'interest' ||
                            candidate.status === 'applied') && (
                            <div className="tablet:w-auto flex w-full gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setCandidates(
                                    candidates.map((other) =>
                                      other.id === candidate.id
                                        ? { ...other, status: 'declined' }
                                        : other
                                    )
                                  )
                                }
                                className="border-role bg-surface text-ink hover:bg-role hover:text-on-role tablet:flex-none min-h-12 flex-1 cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                              >
                                婉拒
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setChosenId(candidate.id)
                                  window.scrollTo(0, 0)
                                }}
                                className="border-role bg-role text-on-role hover:bg-surface hover:text-ink tablet:flex-none min-h-12 flex-1 cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                              >
                                選定
                              </button>
                            </div>
                          )}

                          {candidate.status === 'noreply' && (
                            <p className="text-ink-subtle tablet:text-right">
                              {candidate.invitedAt} 已邀請
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </TabsContent>
              <TabsContent value="recommended" />
            </div>
          </Tabs>
        </>
      )}
    </div>
  )
}
