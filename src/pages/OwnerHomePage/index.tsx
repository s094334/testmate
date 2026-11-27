import { Link } from 'react-router'
import { useOwnProjects } from '@/api/projects'
import { OwnerStatusTag } from '@/components/OwnerStatusTag'
import { StatusTag } from '@/components/StatusTag'
import { FilePlusIcon } from '@/components/icons/FilePlusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'

export function OwnerHomePage() {
  const { data, isPending } = useOwnProjects()

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col px-4 pt-6 pb-12">
      {/* Same 800px column as the 公司資料 page */}
      <div className="desktop:gap-6 mx-auto flex w-full max-w-200 flex-col gap-5">
        <div className="flex min-h-12 items-center justify-between gap-4">
          <h1 className="text-subtitle">專案列表</h1>
          {data && data.items.length > 0 && (
            <Link to="/owner/projects/new" className="btn btn-secondary">
              <PlusIcon />
              發布專案
            </Link>
          )}
        </div>

        {!data && (
          <div className="bg-surface border-ink rounded-md border">
            <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
              {isPending ? '載入中…' : '專案載入失敗，請重新整理再試一次。'}
            </p>
          </div>
        )}

        {data?.items.length === 0 && (
          <div className="bg-surface border-ink tablet:px-7 tablet:py-18 flex flex-col items-center gap-3 rounded-md border px-4 py-12 text-center">
            <div className="bg-owner-soft text-owner-strong flex size-18 items-center justify-center rounded-full">
              <FilePlusIcon />
            </div>
            <h2 className="text-subheading mt-1">還沒有任何專案唷</h2>
            <Link to="/owner/projects/new" className="btn btn-secondary mt-2">
              <PlusIcon />
              發布專案
            </Link>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="flex flex-col gap-3">
            {data.items.map((project) => (
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
                    {project.engagement !== null && (
                      <StatusTag status={project.engagement.status} />
                    )}
                    {project.engagement === null &&
                      project.recruitment_status === 'recruiting' && (
                        <OwnerStatusTag status="recruiting" />
                      )}
                    {/* Closed or cancelled with no tester. assumption: not decided yet */}
                    {project.engagement === null &&
                      project.recruitment_status !== 'recruiting' && (
                        <OwnerStatusTag status="ended" />
                      )}
                  </div>
                </div>
                <p className="text-ink-subtle">
                  測試期間 {project.start_date.replaceAll('-', '/')}–
                  {project.end_date.replaceAll('-', '/')}、
                  {project.engagement
                    ? `測試人員 ${project.engagement.tester_name ?? '未設定暱稱'}`
                    : project.test_mode === 'remote'
                      ? '遠端'
                      : project.test_city}
                </p>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
