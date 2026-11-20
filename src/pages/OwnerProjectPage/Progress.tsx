import { Avatar } from '@/components/Avatar'
import { ClockIcon } from '@/components/icons/ClockIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import type { RecruitCandidate } from '@/data/owner'

export function Progress({ chosen }: { chosen: RecruitCandidate }) {
  return (
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
            <Avatar shape={chosen.avatarShape} role="tester" size={48} />
            <div className="flex flex-col">
              <h3 className="text-[20px] leading-[1.4]">{chosen.fullName}</h3>
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

        <p className="text-ink-subtle tablet:text-right">剛選定，等對方簽署</p>
      </div>
    </>
  )
}
