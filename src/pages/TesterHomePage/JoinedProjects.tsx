import { Link } from 'react-router'
import { StatusTag } from '@/components/StatusTag'
import { joinedProjects } from '@/data/tester'

// The whole card links to the project page (not built yet).
// Two columns: text on the left, status on the right.
// Mobile: status sits next to the title; owner and devices use the full width below.
// Desktop: status is centered against all three lines, light green on hover.
export function JoinedProjects() {
  return (
    <div>
      {joinedProjects.map((project) => (
        <Link
          key={project.id}
          to={`/tester/projects/${project.id}`}
          className="border-line -outline-offset-2 desktop:gap-x-6 desktop:px-6 desktop:py-[22px] desktop:hover:bg-role-soft grid grid-cols-[1fr_auto] items-start gap-3 border-b p-4 transition-colors duration-150 ease-out"
        >
          <h3 className="desktop:text-[20px] min-w-0 text-[18px] leading-[1.4] font-bold">
            {project.name}
          </h3>

          <div className="desktop:row-span-3 desktop:self-center flex">
            <StatusTag
              status={project.status}
              needsAction={project.needsAction}
            />
          </div>

          <p className="text-ink-muted desktop:col-span-1 col-span-2">
            {project.owner}
          </p>
          <div className="desktop:col-span-1 col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2">
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
        </Link>
      ))}
    </div>
  )
}
