import { Link } from 'react-router'
import { OwnerStatusTag } from '@/components/OwnerStatusTag'
import { FilePlusIcon } from '@/components/icons/FilePlusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { getOwnerStatus, ownerProjects } from '@/data/owner'

export function OwnerHomePage() {
  return (
    <div className="max-w-page tablet:px-6 desktop:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-6 pb-12">
      {/* min-h-12 keeps the row as tall as the button, so the heading does not move when the button is hidden */}
      <div className="flex min-h-12 items-center justify-between gap-4">
        <h1 className="text-title-page">專案列表</h1>
        {ownerProjects.length > 0 && (
          <Link
            to="/owner/projects/new"
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            <PlusIcon />
            發布專案
          </Link>
        )}
      </div>

      {ownerProjects.length === 0 && (
        <div className="bg-surface border-ink tablet:px-7 tablet:py-18 flex flex-col items-center gap-3 rounded-md border px-4 py-12 text-center">
          <div className="bg-owner-soft text-owner-strong flex size-18 items-center justify-center rounded-full">
            <FilePlusIcon />
          </div>
          <h2 className="text-subheading mt-1">還沒有發布的專案</h2>
          <Link
            to="#"
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role mt-2 inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-6 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            <PlusIcon />
            發布專案
          </Link>
        </div>
      )}

      {ownerProjects.length > 0 && (
        <div className="flex flex-col gap-3">
          {ownerProjects.map((project) => (
            <Link
              key={project.id}
              to={`/owner/projects/${project.id}`}
              className="bg-surface border-ink hover:shadow-hover desktop:px-7 desktop:py-6 flex flex-col gap-2 rounded-md border px-4 py-5 transition-[translate,box-shadow] duration-150 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
            >
              <div className="desktop:gap-4 flex items-start justify-between gap-3">
                <h2 className="desktop:text-[24px] text-[20px] leading-[1.4] font-bold">
                  {project.name}
                </h2>
                <div className="desktop:mt-1 mt-0.5 flex flex-none">
                  <OwnerStatusTag
                    status={getOwnerStatus(project)}
                    needsAttention={project.needsAttention}
                  />
                </div>
              </div>
              <p className="text-ink-subtle">
                測試期間 {project.details.testPeriod}、
                {project.engagement
                  ? `測試人員 ${project.engagement.testerName}`
                  : project.details.location}
              </p>
              <p>{project.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
