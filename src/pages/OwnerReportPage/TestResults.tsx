import { Fragment } from 'react'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { CrossIcon } from '@/components/icons/CrossIcon'
import type { ReportItem } from '@/data/tester'

export function TestResults({
  items,
  bugCount,
}: {
  items: ReportItem[]
  bugCount: number
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-subheading tablet:text-heading flex flex-wrap items-baseline gap-x-2">
        測試結果
        <span className="text-ink-muted text-base font-normal">
          通過 {items.filter((item) => item.pass).length}／{items.length} 項
        </span>
      </h2>

      <div className="bg-surface border-ink overflow-hidden rounded-md border">
        <div className="border-ink desktop:grid hidden grid-cols-[48px_1fr_2fr_2fr_200px] gap-4 border-b px-6 py-3.5 font-bold">
          <span>#</span>
          <span>測試項目</span>
          <span>詳細步驟</span>
          <span>結果</span>
          <span>通過與否</span>
        </div>

        {items.map((item, index) => {
          // bugRef is what the tester typed, e.g. 01、03; numbers past the last bug are skipped
          const refs = [...new Set(item.bugRef.match(/\d+/g)?.map(Number))]
            .filter((n) => n > 0 && n <= bugCount)
            .sort((a, b) => a - b)

          return (
            <div
              key={index}
              className={`border-line desktop:grid desktop:grid-cols-[48px_1fr_2fr_2fr_200px] desktop:items-start desktop:gap-4 desktop:px-6 desktop:py-3.5 flex flex-col gap-2 p-4 ${index > 0 ? 'border-t' : ''}`}
            >
              <div className="desktop:contents flex items-baseline gap-2.5">
                <span className="font-num text-ink-subtle text-[20px] font-semibold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <b className="desktop:text-base text-[18px]">{item.title}</b>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-ink-subtle desktop:sr-only">
                  詳細步驟
                </span>
                <span className="desktop:font-normal font-bold whitespace-pre-line">
                  {item.steps}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-ink-subtle desktop:sr-only">結果</span>
                <span className="desktop:font-normal font-bold whitespace-pre-line">
                  {item.result}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {item.pass && (
                  <span className="bg-tester-soft text-tester-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                    <CheckIcon />
                    通過
                  </span>
                )}
                {!item.pass && (
                  <span className="bg-status-dispute-bg text-status-dispute-text inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap">
                    <CrossIcon />
                    不通過
                  </span>
                )}
                {!item.pass && refs.length > 0 && (
                  <span className="text-ink-muted font-bold">
                    {refs.map((n, k) => (
                      <Fragment key={n}>
                        {k > 0 && '、'}
                        <a
                          href={`#bug-${String(n).padStart(2, '0')}`}
                          className="link text-role"
                        >
                          BUG {String(n).padStart(2, '0')}
                        </a>
                      </Fragment>
                    ))}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
