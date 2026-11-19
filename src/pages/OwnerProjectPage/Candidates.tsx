import { ClockIcon } from '@/components/icons/ClockIcon'
import { CrossIcon } from '@/components/icons/CrossIcon'
import { ExclamationIcon } from '@/components/icons/ExclamationIcon'
import { HeartIcon } from '@/components/icons/HeartIcon'
import { SendIcon } from '@/components/icons/SendIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import type { RecruitCandidate } from '@/data/owner'

export function Candidates({
  candidates,
  onDecline,
  onChoose,
}: {
  candidates: RecruitCandidate[]
  onDecline: (candidate: RecruitCandidate) => void
  onChoose: (candidate: RecruitCandidate) => void
}) {
  return (
    <ul className="tablet:gap-0 flex flex-col gap-3">
      {candidates
        .sort(
          (a, b) =>
            ['interest', 'applied', 'noreply', 'declined'].indexOf(a.status) -
            ['interest', 'applied', 'noreply', 'declined'].indexOf(b.status)
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
                  <dt className="text-ink-subtle w-18 flex-none">所在地</dt>
                  <dd>{candidate.city}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">年資</dt>
                  <dd>{candidate.years}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">裝置</dt>
                  <dd>{candidate.devices.join('、')}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-ink-subtle w-18 flex-none">語言</dt>
                  <dd>{candidate.languages.join('、')}</dd>
                </div>
                <div className="flex items-start gap-0">
                  <dt className="text-ink-subtle w-18 flex-none pt-0.5">
                    興趣
                  </dt>
                  <dd>
                    <ul className="-ml-0.5 flex flex-wrap gap-1.5">
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
                    onClick={() => onDecline(candidate)}
                    className="border-role bg-surface text-ink hover:bg-platform-soft tablet:flex-none min-h-12 flex-1 cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                  >
                    婉拒
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChoose(candidate)
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
                  {candidate.invitedAt
                    ? `${candidate.invitedAt} 已邀請`
                    : '剛邀請'}
                </p>
              )}
            </div>
          </li>
        ))}
    </ul>
  )
}
