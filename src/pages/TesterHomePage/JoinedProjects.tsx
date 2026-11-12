import { Link } from 'react-router'
import { StatusTag } from '@/components/StatusTag'
import { joinedProjects } from '@/data/tester'

// The whole card links to the project page (not built yet).
// Mobile: status on top, then title and details. Desktop: title on the left, status on the right,
// light green on hover.
export function JoinedProjects() {
  return (
    <div>
      {joinedProjects.map((project) => (
        <Link
          key={project.id}
          to={`/tester/projects/${project.id}`}
          className="border-line -outline-offset-2 desktop:flex-row desktop:flex-wrap desktop:items-center desktop:justify-between desktop:gap-x-6 desktop:gap-y-3 desktop:px-6 desktop:py-[22px] desktop:hover:bg-role-soft flex flex-col gap-2 border-b p-4 transition-colors duration-150 ease-out"
        >
          <div className="desktop:order-last flex">
            <StatusTag
              status={project.status}
              needsAction={project.needsAction}
            />
          </div>

          <div className="desktop:basis-80 flex min-w-0 flex-1 flex-col gap-3">
            <h3 className="desktop:text-[20px] text-[18px] leading-[1.4] font-bold">
              {project.name}
            </h3>
            <p className="text-ink-muted">{project.owner}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {project.devices.map((device) => (
                <span
                  key={device}
                  className="bg-tester-soft text-tester-text rounded-[4px] px-3 font-bold"
                >
                  {device}
                </span>
              ))}
              <span className="text-ink-subtle">
                {['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(project.status)
                  ? `${project.due} 結束`
                  : `截止 ${project.due}`}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
