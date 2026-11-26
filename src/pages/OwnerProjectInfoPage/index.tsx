import { Link, Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useProject } from '@/api/projects'
import { useSession } from '@/api/session'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import {
  isMockOwnerProject,
  ownerProjectInfo,
  ownerProjects,
} from '@/data/owner'

export function OwnerProjectInfoPage() {
  const { id = '' } = useParams()

  return isMockOwnerProject(id) ? <MockInfo id={id} /> : <ApiInfo id={id} />
}

function MockInfo({ id }: { id: string }) {
  const project = ownerProjects.find((owned) => owned.id === id)
  const info = ownerProjectInfo[id]

  if (!project || !info) return <Navigate to="/owner" replace />

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="flex flex-col gap-1">
        <Link
          to={`/owner/projects/${project.id}`}
          className="link tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
        <h1 className="text-subtitle">{project.name}</h1>
      </div>

      <h2 className="text-section-title">專案資訊</h2>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-1 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">簡介</h3>
        <p className="text-ink-muted">{project.summary}</p>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">時程</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">專案期間</dt>
            <dd className="text-ink-muted">{project.details.testPeriod}</dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試人員</dt>
            <dd className="text-ink-muted">
              {project.engagement?.testerName ?? '尚未選定'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">測試範圍</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試方式</dt>
            <dd className="text-ink-muted">{project.details.location}</dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">目標裝置</dt>
            <dd>
              <ul className="-ml-2.5 flex flex-wrap gap-1.5">
                {info.platforms.map((platform) => (
                  <li
                    key={platform}
                    className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5"
                  >
                    {platform}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試語言</dt>
            <dd>
              <ul className="-ml-2.5 flex flex-wrap gap-1.5">
                {info.languages.map((language) => (
                  <li
                    key={language}
                    className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5"
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
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">報酬</dt>
            <dd className="text-ink-muted">
              {info.pay}
              <span className="text-ink-subtle block">
                測試報告驗收通過後一次撥款
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">測試要求</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">如何測試</dt>
            <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
              {info.howToTest}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">成功標準</dt>
            <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
              {info.successCriteria}
            </dd>
          </div>
          {info.specialRequirements && (
            <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
              <dt className="text-ink-subtle pl-0.5 text-[18px]">特殊要求</dt>
              <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
                {info.specialRequirements}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <div className="bg-surface tablet:hidden sticky bottom-0 z-5 -mx-4 -mt-3 -mb-12 flex gap-2 px-4 pt-2.5 pb-4 shadow-[0_-4px_16px_rgb(30_30_28/8%)]">
        <Link
          to={`/owner/projects/${project.id}`}
          className="bg-page text-ink flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
      </div>
    </div>
  )
}

function ApiInfo({ id }: { id: string }) {
  const { data: project, isPending, error } = useProject(id)
  const { data: user } = useSession()

  if (!project) {
    return (
      <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
        <Link
          to={`/owner/projects/${id}`}
          className="link inline-flex min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="bg-surface border-ink rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {isPending
              ? '載入中…'
              : error instanceof ApiError &&
                  (error.status === 404 || error.status === 400)
                ? '找不到這個專案。'
                : '專案載入失敗，請重新整理再試一次。'}
          </p>
        </div>
      </div>
    )
  }

  // GET /api/projects/{id} is public, so another owner's project loads too,
  // without its confidential part
  if (project.owner_id !== user?.id || !project.confidential) {
    return <Navigate to="/owner" replace />
  }

  return (
    <div className="max-w-page tablet:px-6 tablet:pt-6 tablet:gap-6 desktop:pt-10 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-4 pb-12">
      <div className="flex flex-col gap-1">
        <Link
          to={`/owner/projects/${project.id}`}
          className="link tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
        <h1 className="text-subtitle">{project.name}</h1>
      </div>

      <h2 className="text-section-title">專案資訊</h2>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-1 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">簡介</h3>
        <p className="text-ink-muted">{project.summary}</p>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">時程</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">專案期間</dt>
            <dd className="text-ink-muted">
              {project.start_date.replaceAll('-', '/')}–
              {project.end_date.replaceAll('-', '/')}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試人員</dt>
            <dd className="text-ink-muted">
              {project.engagement?.tester_name ?? '尚未選定'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">測試範圍</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試方式</dt>
            <dd className="text-ink-muted">
              {project.test_mode === 'remote' ? '遠端' : project.test_city}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">目標裝置</dt>
            <dd>
              <ul className="-ml-2.5 flex flex-wrap gap-1.5">
                {project.devices.length === 0 && (
                  <li className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5">
                    不限裝置
                  </li>
                )}
                {project.devices.map((device) => (
                  <li
                    key={device.id}
                    className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5"
                  >
                    {/* Same wording as 設備 on the tester's project detail */}
                    {[
                      device.device_tag?.name,
                      device.brand,
                      device.model,
                      device.custom_name,
                    ]
                      .filter(Boolean)
                      .join('、')}
                    {device.min_os_version && `、${device.min_os_version} 以上`}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">測試語言</dt>
            <dd>
              <ul className="-ml-2.5 flex flex-wrap gap-1.5">
                {project.languages.length === 0 && (
                  <li className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5">
                    不限語言
                  </li>
                )}
                {project.languages.map((language) => (
                  <li
                    key={language.name}
                    className="rounded-full bg-[#f0f0ec] px-2.5 py-0.5"
                  >
                    {language.name}
                    {language.native_required && '（母語）'}
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
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">報酬</dt>
            <dd className="text-ink-muted">
              NT$ {project.reward.toLocaleString('zh-TW')}
              <span className="text-ink-subtle block">
                測試報告驗收通過後一次撥款
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-surface tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-xl px-4 py-5 shadow-[0_2px_12px_rgb(30_30_28/6%)]">
        <h3 className="text-[20px] leading-[1.4]">測試要求</h3>
        <dl className="flex flex-col gap-4">
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">如何測試</dt>
            <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
              {project.confidential.how_to_test}
            </dd>
          </div>
          <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
            <dt className="text-ink-subtle pl-0.5 text-[18px]">成功標準</dt>
            <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
              {project.confidential.success_criteria}
            </dd>
          </div>
          {project.special_requirements && (
            <div className="tablet:grid tablet:grid-cols-[140px_1fr] tablet:items-baseline tablet:gap-6 flex flex-col gap-1">
              <dt className="text-ink-subtle pl-0.5 text-[18px]">特殊要求</dt>
              <dd className="bg-page border-line text-ink-muted tablet:px-6 tablet:py-5 rounded-md border px-4 py-4 whitespace-pre-line">
                {project.special_requirements}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <div className="bg-surface tablet:hidden sticky bottom-0 z-5 -mx-4 -mt-3 -mb-12 flex gap-2 px-4 pt-2.5 pb-4 shadow-[0_-4px_16px_rgb(30_30_28/8%)]">
        <Link
          to={`/owner/projects/${project.id}`}
          className="bg-page text-ink flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-3 transition-colors duration-150 ease-out"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
      </div>
    </div>
  )
}
