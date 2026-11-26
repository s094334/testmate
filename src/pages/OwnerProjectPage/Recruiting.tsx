import { useState } from 'react'
import { useBottomBar } from '@/components/BottomBar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { recommendedTesters, type RecruitCandidate } from '@/data/owner'
import { Candidates } from './Candidates'
import { Recommended } from './Recommended'

export function Recruiting({
  projectId,
  candidates: initialCandidates,
  onChoose,
  onDecline,
  busy,
}: {
  projectId: string
  candidates: RecruitCandidate[]
  onChoose: (candidate: RecruitCandidate) => void | Promise<void>
  // A real project's 婉拒 goes to the server, which sends the list again.
  // Without it, as on the mock projects, 婉拒 only changes this page
  onDecline?: (candidate: RecruitCandidate) => Promise<void>
  busy?: boolean
}) {
  const [tab, setTab] = useState('candidates')
  const [candidates, setCandidates] = useState(initialCandidates)
  const [recommended, setRecommended] = useState(
    recommendedTesters[projectId] ?? []
  )
  const pendingInvite = candidates.find(
    (candidate) => candidate.status === 'noreply'
  )
  const tabBar = useBottomBar()

  return (
    <>
      <h2 className="text-section-title">招募中</h2>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
        <TabsList
          ref={tabBar}
          className="bg-surface tablet:relative tablet:order-none tablet:z-1 tablet:-mb-px tablet:gap-1 tablet:bg-transparent tablet:p-0 tablet:shadow-none fixed inset-x-0 bottom-0 z-5 order-last flex gap-2 px-4 pt-2.5 pb-4 shadow-[0_-4px_16px_rgb(30_30_28/8%)]"
        >
          <TabsTrigger
            value="candidates"
            className="bg-page text-ink data-active:bg-role-soft data-active:text-role tablet:flex-none tablet:h-12 tablet:min-h-0 tablet:rounded-none tablet:rounded-t-md tablet:border tablet:border-b-0 tablet:border-transparent tablet:bg-transparent tablet:px-4 tablet:text-[18px] tablet:font-medium tablet:text-ink-subtle tablet:data-active:border-ink tablet:data-active:bg-surface tablet:data-active:text-ink desktop:px-6 desktop:text-[20px] flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out data-active:font-bold"
          >
            邀請與申請
          </TabsTrigger>
          {/* Hidden until GET /api/projects/{id}/recommendations exists; remove
              `hidden` to bring 推薦 QA back. Its panel cannot open without the tab */}
          <TabsTrigger
            value="recommended"
            hidden
            className="bg-page text-ink data-active:bg-role-soft data-active:text-role tablet:flex-none tablet:h-12 tablet:min-h-0 tablet:rounded-none tablet:rounded-t-md tablet:border tablet:border-b-0 tablet:border-transparent tablet:bg-transparent tablet:px-4 tablet:text-[18px] tablet:font-medium tablet:text-ink-subtle tablet:data-active:border-ink tablet:data-active:bg-surface tablet:data-active:text-ink desktop:px-6 desktop:text-[20px] flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out data-active:font-bold"
          >
            推薦 QA
          </TabsTrigger>
        </TabsList>

        <div
          className={`tablet:bg-surface tablet:border-ink tablet:overflow-hidden tablet:rounded-md tablet:border ${tab === 'candidates' ? 'tablet:rounded-tl-none' : ''}`}
        >
          <TabsContent value="candidates">
            <Candidates
              candidates={onDecline ? initialCandidates : candidates}
              onDecline={
                onDecline ??
                ((candidate) =>
                  setCandidates(
                    candidates.map((other) =>
                      other.id === candidate.id
                        ? { ...other, status: 'declined' }
                        : other
                    )
                  ))
              }
              onChoose={onChoose}
              busy={busy}
            />
          </TabsContent>

          <TabsContent value="recommended">
            <Recommended
              recommended={recommended}
              pendingInvite={pendingInvite}
              onInvite={(tester) => {
                setCandidates([...candidates, { ...tester, status: 'noreply' }])
                setRecommended(
                  recommended.filter((other) => other.id !== tester.id)
                )
              }}
            />
          </TabsContent>
        </div>
      </Tabs>
    </>
  )
}
