import { useRef } from 'react'
import {
  LottieInteractions,
  LottieLight,
  lottieInView,
  type LottieHandle,
} from 'lottie-react'
import { Link } from 'react-router'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { testingSteps } from './data'

export function AboutSection() {
  // Gives access to the animation's play/stop commands, for replay on click
  const lottie = useRef<LottieHandle>(null)

  return (
    <section className="bg-surface border-line border-y">
      <div className="max-w-page tablet:gap-8 tablet:px-6 tablet:py-16 mx-auto flex flex-col gap-6 px-4 py-12">
        <div className="tablet:gap-4 flex items-center justify-between gap-3">
          <h2>關於測試</h2>
          <Link
            to="/how-it-works"
            className="group/flow border-ink bg-surface tablet:min-h-14 tablet:pr-3 tablet:pl-6 inline-flex min-h-12 items-center gap-3 rounded-full border pr-2 pl-4 font-bold whitespace-nowrap"
          >
            看核心流程
            <span className="bg-flow-arrow text-ink animate-nudge inline-flex size-8 items-center justify-center rounded-full transition-[translate] duration-250 group-hover/flow:translate-x-1.5 group-hover/flow:animate-none">
              <ArrowRightIcon />
            </span>
          </Link>
        </div>
        <div className="tablet:flex-row tablet:flex-wrap tablet:gap-8 flex flex-col gap-6">
          <div className="tablet:flex-[2_1_480px] flex min-w-0 flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                lottie.current?.stop()
                lottie.current?.play()
              }}
              className="border-ink bg-platform-soft block aspect-video w-full cursor-pointer overflow-hidden rounded-md border"
            >
              <LottieInteractions
                interactions={[lottieInView({ once: true, amount: 0.5 })]}
              >
                <LottieLight
                  lottieRef={lottie}
                  src="/lottie/testmate.json"
                  autoplay={false}
                  className="size-full"
                />
              </LottieInteractions>
            </button>
          </div>
          <div className="tablet:flex-[1_1_280px] tablet:justify-center flex min-w-0 flex-col">
            <ol className="tablet:gap-6 tablet:text-[18px] flex flex-col gap-4">
              {testingSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className={`text-on-role font-num mt-2 inline-flex size-10 flex-none items-center justify-center rounded-full text-[20px] leading-none font-semibold ${
                      step.role === 'owner'
                        ? 'bg-owner-strong'
                        : step.role === 'tester'
                          ? 'bg-tester-strong'
                          : 'bg-platform-strong'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex flex-col">
                    <b>{step.title}</b>
                    <span className="text-ink-muted text-body">
                      {step.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
