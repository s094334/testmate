import { Link, Navigate, useParams } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ownerProjectInfo, ownerProjects } from '@/data/owner'

export function OwnerProjectInfoPage() {
  const { id = '' } = useParams()
  const project = ownerProjects.find((owned) => owned.id === id)
  const info = ownerProjectInfo[id]

  if (!project || !info) return <Navigate to="/owner" replace />

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="flex flex-col gap-1">
        <Link
          to={`/owner/projects/${project.id}`}
          className="inline-flex min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
        <h1 className="text-subtitle">{project.name}</h1>
      </div>

      <h2 className="text-section-title">專案資訊</h2>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-1 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">專案說明</h3>
        <p className="text-ink-muted">{project.summary}</p>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">時程</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">測試期間</dt>
            <dd className="text-[18px] font-bold">
              {project.details.testPeriod}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">測試人員</dt>
            <dd className="text-[18px] font-bold">
              {project.engagement?.testerName ?? '尚未選定'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">測試範圍</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">測試方式</dt>
            <dd className="text-[18px] font-bold">
              {project.details.location}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">測試平台</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {info.platforms.map((platform) => (
                  <li
                    key={platform}
                    className="rounded-full bg-[#f0f0ec] px-3 py-1 font-bold"
                  >
                    {platform}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">語系</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {info.languages.map((language) => (
                  <li
                    key={language}
                    className="rounded-full bg-[#f0f0ec] px-3 py-1 font-bold"
                  >
                    {language}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">報酬</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-start tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle tablet:pt-1">報酬</dt>
            <dd className="text-[18px] font-bold">
              {info.pay}
              <span className="text-ink-subtle block text-[16px] font-normal">
                測試報告驗收通過後一次撥款
              </span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
