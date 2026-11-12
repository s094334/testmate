import { Link } from 'react-router'
import { StarIcon } from '@/components/icons/StarIcon'
import { invitedProjects } from '@/data/tester'

// The whole card links to the invite detail page (built in a later step).
// Desktop: light green on hover. Mobile: no hover.
export function InvitedProjects() {
  return (
    <div>
      {invitedProjects.map((project) => (
        <Link
          key={project.id}
          to={`/tester/invites/${project.id}`}
          className="border-line desktop:p-6 desktop:hover:bg-role-soft flex flex-col gap-3 border-t p-4 transition-colors duration-150 ease-out first:border-t-0"
        >
          <h3 className="desktop:text-[20px] text-[18px] leading-[1.4] font-bold">
            {project.name}
          </h3>
          <p className="text-ink-muted">{project.intro}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5">
              <span className="text-star flex">
                <StarIcon />
              </span>
              <b>{project.rating}</b>
              <span className="text-ink-subtle">
                公司評價（{project.reviews} 則）
              </span>
            </span>
            <span className="text-ink-subtle">
              截止 {project.period.split('–')[1]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
