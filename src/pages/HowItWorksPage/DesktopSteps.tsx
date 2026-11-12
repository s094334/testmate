import type { ownerSteps } from './data'

export function DesktopSteps({ steps }: { steps: typeof ownerSteps }) {
  return (
    <section className="tablet:block mx-auto hidden max-w-190 px-6 pb-8">
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
  )
}
