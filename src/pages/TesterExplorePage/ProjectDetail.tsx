import { Link } from 'react-router'
import { ApiError } from '@/api/client'
import { useProject } from '@/api/projects'
import { useSession } from '@/api/session'
import { BottomBar } from '@/components/BottomBar'
import { InfoPopover } from '@/components/InfoPopover'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { StarIcon } from '@/components/icons/StarIcon'

export function ProjectDetail({
  id,
  applied,
  onApply,
}: {
  id: string
  applied: boolean
  onApply: () => void
}) {
  const { data: project, isPending, error } = useProject(id)
  const { data: user } = useSession()

  if (!project) {
    return (
      <div
        data-role="tester"
        className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12"
      >
        <Link
          to="/projects"
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

  const canApply =
    user?.role === 'tester' && project.recruitment_status === 'recruiting'

  return (
    <div
      data-role="tester"
      className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12"
    >
      <Link
        to="/projects"
        className="link inline-flex min-h-11 items-center gap-1.5 self-start"
      >
        <ChevronDownIcon className="rotate-90" />
        上一頁
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] leading-[1.3] font-bold">{project.name}</h1>
        <span className="text-ink-subtle flex flex-wrap items-center gap-1.5">
          {project.company.name}、
          {project.company.average_score === null ? (
            '尚無評價'
          ) : (
            <>
              <span className="text-star flex">
                <StarIcon />
              </span>
              <b className="text-ink">{project.company.average_score}</b>
              公司評價（{project.company.rating_count} 則）
            </>
          )}
        </span>
      </div>

      <article className="bg-surface border-ink tablet:p-8 rounded-md border px-4 py-5">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-2">
            <h2 className="text-section-title">簡介</h2>
            <p className="text-body-large text-ink-muted leading-[1.7]">
              {project.summary}
            </p>
          </section>

          {project.special_requirements?.trim() && (
            <section className="flex flex-col gap-2">
              <h2 className="text-section-title">特殊要求</h2>
              <p className="bg-page border-line text-body-large rounded-md border px-6 py-5 leading-[1.8] whitespace-pre-line">
                {project.special_requirements}
              </p>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="text-section-title">項目詳情</h2>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-6 gap-y-4">
              <div className="flex flex-col gap-0.5">
                <dt className="text-ink-subtle">地點</dt>
                <dd className="text-body-large font-bold">
                  {project.test_mode === 'remote' ? '遠端' : project.test_city}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-ink-subtle">設備</dt>
                <dd className="text-body-large font-bold">
                  {project.devices.length === 0
                    ? '不限裝置'
                    : project.devices.map((device) => (
                        <span key={device.id} className="block">
                          {[
                            device.device_tag?.name,
                            device.brand,
                            device.model,
                            device.custom_name,
                          ]
                            .filter(Boolean)
                            .join('、')}
                          {device.min_os_version &&
                            `、${device.min_os_version} 以上`}
                        </span>
                      ))}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-ink-subtle">測試期間</dt>
                <dd className="text-body-large font-bold">
                  {project.start_date.replaceAll('-', '/')}–
                  {project.end_date.replaceAll('-', '/')}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-ink-subtle">類別</dt>
                <dd className="text-body-large font-bold">
                  {project.industry.name}
                </dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <h2 className="text-section-title">收益</h2>
              <InfoPopover label="收益說明">
                開工前由平台代管，驗收通過後撥款
              </InfoPopover>
            </div>
            <span className="text-section-title text-role leading-[1.3]">
              NT$ {project.reward.toLocaleString('zh-TW')}
            </span>
          </section>
        </div>

        <div className="border-ink tablet:flex mt-8 hidden flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-[20px] font-bold">申請截止</span>
            <b className="text-section-title leading-[1.3]">
              {project.end_date.replaceAll('-', '/')}
            </b>
          </div>

          {canApply && !applied && (
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={onApply}
                className="btn btn-primary min-w-40"
              >
                申請
              </button>
              <p className="text-ink-subtle">
                按下「申請」，即表示我確認符合上述要求
              </p>
            </div>
          )}

          {canApply && applied && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <b className="text-role-text">已送出申請，等專案負責人回覆</b>
              <span className="btn btn-inactive min-w-40 cursor-default rounded-md">
                已申請
              </span>
            </div>
          )}

          {project.recruitment_status !== 'recruiting' && (
            <b className="text-ink-subtle">招募已結束</b>
          )}
        </div>
      </article>

      <BottomBar className="border-line bg-surface tablet:hidden fixed inset-x-0 bottom-0 flex flex-col gap-2 border-t px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[18px] font-bold">申請截止</span>
          <b className="text-section-title leading-[1.3]">
            {project.end_date.replaceAll('-', '/')}
          </b>
        </div>

        {canApply && !applied && (
          <>
            <button type="button" onClick={onApply} className="btn btn-primary">
              申請
            </button>
            <p className="text-ink-subtle text-center">
              按下「申請」，即表示我確認符合上述要求
            </p>
          </>
        )}

        {canApply && applied && (
          <>
            <span className="btn btn-inactive cursor-default rounded-md">
              已申請
            </span>
            <b className="text-role-text">已送出申請，等專案負責人回覆</b>
          </>
        )}

        {project.recruitment_status !== 'recruiting' && (
          <b className="text-ink-subtle">招募已結束</b>
        )}
      </BottomBar>
    </div>
  )
}
