import type { UIEvent } from 'react'
import { useState } from 'react'
import type { ownerSteps } from './data'

export function MobileSteps({ steps }: { steps: typeof ownerSteps }) {
  const [currentStep, setCurrentStep] = useState(0)

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
    <section className="tablet:hidden flex flex-col gap-4 pb-4">
      <div
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
  )
}
