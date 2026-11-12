import type { UIEvent } from 'react'
import { useRef, useState } from 'react'
import { ownerSteps, testerSteps } from './data'

export function HowItWorksPage() {
  const [role, setRole] = useState<'owner' | 'tester'>('owner')
  const [currentStep, setCurrentStep] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const steps = role === 'owner' ? ownerSteps : testerSteps

  function pickRole(nextRole: 'owner' | 'tester') {
    setRole(nextRole)
    setCurrentStep(0)
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0
    }
  }

  // Turn the scroll ratio into a card index: far left is the first card, far right is the last
  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const scroller = event.currentTarget
    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    if (maxScroll > 0) {
      setCurrentStep(
        Math.round((scroller.scrollLeft / maxScroll) * (steps.length - 1))
      )
    }
  }

  return (
    <div data-role={role}>
      <section className="max-w-page tablet:gap-4 tablet:px-6 tablet:pt-24 tablet:pb-8 mx-auto flex flex-col items-center gap-3 px-4 pt-12 pb-6 text-center">
        <h1>
          測試咖
          <span className="from-owner to-tester tablet:bg-[length:100%_10px] bg-linear-to-r bg-[length:100%_8px] bg-[position:0_88%] bg-no-repeat px-1">
            怎麼運作
          </span>
        </h1>
        <p className="text-ink-muted tablet:text-[20px] text-[18px]">
          <span className="tablet:hidden">左右滑動，看看每一步要做什麼。</span>
          <span className="tablet:inline hidden">
            選擇角色，看看接下來要做什麼。
          </span>
        </p>
      </section>

      {/* Desktop: role toggle */}
      <section className="max-w-page tablet:flex mx-auto hidden justify-center px-6 pb-12">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => pickRole('owner')}
            className={`border-ink min-h-12 rounded-md border px-6 text-[18px] font-bold transition-colors duration-150 ease-out ${role === 'owner' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
          >
            我是專案負責人
          </button>
          <button
            type="button"
            onClick={() => pickRole('tester')}
            className={`border-ink min-h-12 rounded-md border px-6 text-[18px] font-bold transition-colors duration-150 ease-out ${role === 'tester' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
          >
            我是測試人員
          </button>
        </div>
      </section>

      {/* Desktop: step list */}
      <section className="tablet:block mx-auto hidden max-w-190 px-6 pb-24">
        <ol className="bg-surface border-ink divide-line divide-y overflow-hidden rounded-md border">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-h-36 items-center gap-6 px-8"
            >
              <span className="border-ink bg-role-soft font-num inline-flex size-12 flex-none items-center justify-center rounded-full border-2 text-[24px] leading-none font-semibold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-1">
                <b className="text-[20px] leading-[1.4]">{step.title}</b>
                <span className="text-body-large text-ink-muted">
                  {step.description}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Mobile: swipeable step cards */}
      <section className="tablet:hidden flex flex-col gap-4 pb-12">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none]"
        >
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="bg-surface border-ink flex h-80 flex-[0_0_calc(100%-32px)] snap-start flex-col items-center justify-center gap-3 rounded-md border p-6 text-center"
            >
              <span className="border-ink bg-role-soft font-num inline-flex size-12 flex-none items-center justify-center rounded-full border-2 text-[24px] leading-none font-semibold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <b className="text-[20px] leading-[1.4]">{step.title}</b>
              <span className="text-ink-muted">{step.description}</span>
            </article>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={`block h-2 rounded-full transition-[width] duration-200 ${index === currentStep ? 'bg-role w-6' : 'bg-line-input w-2'}`}
              />
            ))}
          </div>
          <span className="text-ink-subtle">
            第 {currentStep + 1} 步，共 {steps.length} 步
          </span>
        </div>
      </section>

      {/* Mobile: role toggle pinned to the bottom of the screen */}
      <div className="bg-surface border-line tablet:hidden sticky bottom-0 z-2 flex gap-2 border-t px-4 py-3">
        <button
          type="button"
          onClick={() => pickRole('owner')}
          className={`border-ink min-h-12 flex-1 rounded-md border px-2 font-bold transition-colors duration-150 ease-out ${role === 'owner' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
        >
          我是專案負責人
        </button>
        <button
          type="button"
          onClick={() => pickRole('tester')}
          className={`border-ink min-h-12 flex-1 rounded-md border px-2 font-bold transition-colors duration-150 ease-out ${role === 'tester' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
        >
          我是測試人員
        </button>
      </div>
    </div>
  )
}
