import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'

export function FlowChartCard({ role }: { role: 'owner' | 'tester' }) {
  return (
    <section className="tablet:px-6 tablet:pb-24 mx-auto w-full max-w-190 px-4 pb-12">
      <div className="bg-surface border-ink tablet:flex-row tablet:gap-6 tablet:py-6 tablet:pr-6 tablet:pl-8 flex flex-col items-center gap-4 rounded-md border px-4 py-6">
        <div className="tablet:text-left flex min-w-0 flex-1 flex-col gap-1 text-center">
          <b className="text-[20px] leading-[1.4]">想看完整的合作流程？</b>
          <span className="text-ink-muted">
            查看完整流程圖，包含保密協議、報酬代管、驗收與撥款。
          </span>
        </div>
        <a
          href="/core-flow.pdf"
          target="_blank"
          rel="noopener"
          className="group/flow border-ink bg-surface tablet:self-auto inline-flex min-h-14 flex-none items-center justify-between gap-3 self-stretch rounded-full border pr-3 pl-6 font-bold whitespace-nowrap"
        >
          完整流程圖
          <span
            className={`text-ink animate-nudge inline-flex size-8 items-center justify-center rounded-full transition-[translate] duration-250 group-hover/flow:translate-x-1.5 group-hover/flow:animate-none ${role === 'owner' ? 'bg-flow-arrow' : 'bg-flow-arrow-tester'}`}
          >
            <ArrowRightIcon />
          </span>
        </a>
      </div>
    </section>
  )
}
