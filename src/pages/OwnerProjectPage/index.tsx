import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ClockIcon } from '@/components/icons/ClockIcon'
import { CrossIcon } from '@/components/icons/CrossIcon'
import { ExclamationIcon } from '@/components/icons/ExclamationIcon'
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

  if (!project || project.recruitmentStatus !== 'recruiting') {
    return <Navigate to="/owner" replace />
  }

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <div className="flex flex-col gap-1">
        <Link
          to="/owner"
          className="inline-flex min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
        >
          <ChevronDownIcon className="rotate-90" />
          專案列表
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h1 className="text-subtitle">{project.name}</h1>
          <Link
            to={`/owner/projects/${project.id}/info`}
            className="text-role group inline-flex min-h-11 items-center gap-1.5 font-bold whitespace-nowrap decoration-2 underline-offset-5 hover:underline"
          >
            <InfoIcon className="size-5 flex-none" />
            專案資訊
            <ChevronDownIcon className="size-4.5 flex-none -rotate-90 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <h2 className="text-section-title">招募中</h2>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
        <TabsList className="relative z-1 -mb-px flex gap-1">
          <TabsTrigger
            value="candidates"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-4 text-[18px] font-medium transition-colors duration-150 ease-out data-active:font-bold"
          >
            邀請與申請
            {chosenId === null &&
              candidates.some(
                (candidate) => candidate.status === 'applied'
              ) && (
                <span className="bg-alert text-surface font-num h-6 min-w-6 rounded-full px-1.5 text-center text-[16px] leading-6 font-semibold">
                  {
                    candidates.filter(
                      (candidate) => candidate.status === 'applied'
                    ).length
                  }
                </span>
              )}
          </TabsTrigger>
          <TabsTrigger
            value="recommended"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-4 text-[18px] font-medium transition-colors duration-150 ease-out data-active:font-bold"
          >
            推薦 QA
            <span className="bg-owner-strong text-surface font-num h-6 min-w-6 rounded-full px-1.5 text-center text-[16px] leading-6 font-semibold">
              3
            </span>
          </TabsTrigger>
        </TabsList>

        <div
          className={`bg-surface border-ink overflow-hidden rounded-md border ${tab === 'candidates' ? 'rounded-tl-none' : ''}`}
        >
          <TabsContent value="candidates">
            <ul className="flex flex-col">
              {candidates
                .filter((candidate) => candidate.id !== chosenId)
                .sort(
                  (a, b) =>
                    ['applied', 'noreply', 'declined'].indexOf(a.status) -
                    ['applied', 'noreply', 'declined'].indexOf(b.status)
                )
                .map((candidate) => (
                  <li
                    key={candidate.id}
                    className="border-line desktop:px-7 desktop:py-6 flex items-start justify-between gap-6 border-t p-4 first:border-t-0"
                  >
                    <div className="flex min-w-0 flex-col gap-2.5">
                      <div className="flex items-center gap-3">
                        <span className="border-tester bg-tester-soft inline-flex size-12 flex-none items-center justify-center rounded-full border-3 text-[18px] font-bold">
                          {candidate.initial}
                        </span>
                        <div className="flex flex-col">
                          <b className="text-[20px] leading-[1.4]">
                            {candidate.name}
                          </b>
                          <span className="text-ink-muted inline-flex items-center gap-1">
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
                          </span>
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

                    <div className="flex max-w-90 flex-none flex-col items-end gap-2.5">
                      <span className="inline-flex items-center gap-2">
                        {candidate.status === 'applied' && (
                          <span className="bg-owner-soft text-owner-strong inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                            <SendIcon />
                            主動申請
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
                        {candidate.status === 'applied' &&
                          chosenId === null && (
                            <span className="bg-alert text-surface flex size-5 flex-none items-center justify-center rounded-full">
                              <ExclamationIcon />
                              <span className="sr-only">需要處理</span>
                            </span>
                          )}
                      </span>

                      {candidate.status === 'applied' && chosenId === null && (
                        <div className="flex gap-2">
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
                            className="border-role bg-surface text-ink hover:bg-role-soft min-h-12 cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                          >
                            婉拒
                          </button>
                          <button
                            type="button"
                            onClick={() => setChosenId(candidate.id)}
                            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink min-h-12 cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                          >
                            選定
                          </button>
                        </div>
                      )}

                      {candidate.status === 'applied' && chosenId !== null && (
                        <span className="text-ink-subtle text-right">
                          已選定測試人員，招募已結束
                        </span>
                      )}
                      {candidate.status === 'noreply' && (
                        <span className="text-ink-subtle text-right">
                          {candidate.invitedAt} 已邀請
                        </span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </TabsContent>
          <TabsContent value="recommended" />
        </div>
      </Tabs>
    </div>
  )
}
