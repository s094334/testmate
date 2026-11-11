import { HomeProjectsBackground } from '@/components/backgrounds/HomeProjectsBackground'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { MinusCircleIcon } from '@/components/icons/MinusCircleIcon'
import { currentProjects } from './data'

export function ProjectsSection() {
  return (
    <div className="bg-page relative overflow-hidden">
      <HomeProjectsBackground />
      <section className="max-w-page tablet:gap-8 tablet:px-6 tablet:py-16 relative mx-auto flex flex-col gap-6 py-12">
        <div className="tablet:px-0 flex items-end justify-between gap-4 px-4">
          <div className="flex flex-col gap-1">
            <h2>目前專案</h2>
          </div>
          <a
            href="#"
            className="group/all border-ink bg-surface tablet:inline-flex min-h-14 hidden items-center gap-3 rounded-full border pr-3 pl-6 font-bold whitespace-nowrap"
          >
            看全部專案
            <span className="bg-flow-arrow text-ink animate-nudge inline-flex size-8 items-center justify-center rounded-full transition-[translate] duration-250 group-hover/all:translate-x-1.5 group-hover/all:animate-none">
              <ArrowRightIcon />
            </span>
          </a>
        </div>
        <div className="tablet:grid tablet:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] tablet:gap-6 tablet:overflow-visible tablet:px-0 tablet:pb-0 flex scroll-px-4 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {currentProjects.map((project) => (
            <article
              key={project.id}
              className="bg-surface border-ink tablet:flex-auto flex flex-[0_0_296px] snap-start flex-col gap-4 rounded-md border p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-num text-ink-subtle font-semibold tracking-[1px]">
                  #{project.id}
                </span>
                <span className="bg-platform-soft text-platform-strong inline-flex items-center gap-1 rounded-[4px] px-3 py-0.5 font-bold">
                  <MinusCircleIcon />
                  招募中
                </span>
              </div>
              <h3
                title={project.title}
                className="text-subheading tablet:text-[26px] font-ellipsis truncate"
              >
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-tag-industry-bg text-tag-industry-fg rounded-[4px] px-3 py-0.5 font-bold">
                  {project.industry}
                </span>
                {project.devices.map((device) => (
                  <span
                    key={device}
                    className="bg-platform-soft text-ink-muted rounded-[4px] px-3 py-0.5 font-bold"
                  >
                    {device}
                  </span>
                ))}
              </div>
              <dl className="border-line grid grid-cols-2 gap-2 border-t pt-4">
                <div className="flex flex-col items-center text-center">
                  <dt className="text-ink-subtle">報酬</dt>
                  <dd className="font-num text-[24px] leading-[1.2] font-semibold">
                    NT$ {project.reward.toLocaleString('en-US')}
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="text-ink-subtle">截止</dt>
                  <dd className="font-num text-[24px] leading-[1.2] font-semibold">
                    {project.deadline}
                  </dd>
                </div>
              </dl>
              <a
                href="#"
                className="group/case mt-auto inline-flex min-h-11 items-center gap-2 self-end font-bold decoration-2 underline-offset-5 hover:underline"
              >
                查看案件
                <span className="transition-transform duration-150 ease-out group-hover/case:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </a>
            </article>
          ))}
        </div>
        <div className="tablet:hidden flex px-4">
          <a
            href="#"
            className="group/all border-ink bg-surface flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full border pr-2 pl-4 font-bold whitespace-nowrap"
          >
            看全部專案
            <span className="bg-flow-arrow text-ink animate-nudge inline-flex size-8 items-center justify-center rounded-full transition-[translate] duration-250 group-hover/all:translate-x-1.5 group-hover/all:animate-none">
              <ArrowRightIcon />
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}
