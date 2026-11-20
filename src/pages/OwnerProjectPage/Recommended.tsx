import { Avatar } from '@/components/Avatar'
import { InfoPopover } from '@/components/InfoPopover'
import { RefreshIcon } from '@/components/icons/RefreshIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import type { RecruitCandidate, recommendedTesters } from '@/data/owner'

export function Recommended({
  recommended,
  pendingInvite,
  onInvite,
}: {
  recommended: (typeof recommendedTesters)[string]
  pendingInvite: RecruitCandidate | undefined
  onInvite: (tester: (typeof recommendedTesters)[string][number]) => void
}) {
  return (
    <>
      <div className="tablet:border-b tablet:border-line tablet:px-4 tablet:py-3 desktop:px-7 mb-3 flex flex-wrap items-center justify-between gap-3 tablet:mb-0">
        <p className="text-ink-muted">依專案需要的裝置與語言推薦</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="bg-surface text-ink hover:bg-platform-soft inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 font-bold shadow-[0_2px_12px_rgb(30_30_28/6%)] transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            <RefreshIcon />
            換一批
          </button>
          <InfoPopover label="推薦說明">依專案需要的裝置與語言推薦</InfoPopover>
        </div>
      </div>

      <ul className="tablet:gap-0 flex flex-col gap-3">
        {recommended.map((tester) => (
          <li
            key={tester.id}
            className="bg-surface tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 tablet:rounded-none tablet:border-t tablet:border-line tablet:p-4 tablet:shadow-none tablet:first:border-t-0 desktop:px-7 desktop:py-6 flex flex-col gap-4 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]"
          >
            <div className="flex min-w-0 flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <Avatar shape={tester.avatarShape} role="tester" size={48} />
                <div className="flex flex-col">
                  <h3 className="text-[20px] leading-[1.4]">{tester.name}</h3>
                  <p className="text-ink-muted inline-flex items-center gap-1">
                    <span className="text-star flex">
                      <StarIcon />
                    </span>
                    <b className="text-ink">{tester.rating}</b>
                    ／5、
                    <button
                      type="button"
                      className="min-h-8 cursor-pointer underline underline-offset-3"
                    >
                      {tester.reviews} 則評論
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
                  <dt className="text-ink-subtle w-18 flex-none">年資</dt>
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
                <div className="flex items-start gap-0">
                  <dt className="text-ink-subtle w-18 flex-none pt-0.5">
                    興趣
                  </dt>
                  <dd>
                    <ul className="-ml-0.5 flex flex-wrap gap-1.5">
                      {tester.interests.map((interest) => (
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
              {pendingInvite && (
                <p className="text-ink-subtle tablet:text-right">
                  等 {pendingInvite.name} 回覆邀請後，才能再邀請下一位
                </p>
              )}
              {!pendingInvite && (
                <button
                  type="button"
                  onClick={() => onInvite(tester)}
                  className="border-role bg-role text-on-role hover:bg-surface hover:text-ink tablet:w-auto min-h-12 w-full cursor-pointer rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                >
                  邀請
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
