import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useProjects } from '@/api/projects'
import { useTags } from '@/api/tags'
import { SearchIcon } from '@/components/icons/SearchIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { ProjectDetail } from './ProjectDetail'

export function TesterExplorePage() {
  // ?id= opens one project; the list below keeps its search and 載入更多 while it is open
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [deviceTagId, setDeviceTagId] = useState('')
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useProjects({
    q: debouncedQuery,
    device: deviceTagId,
  })
  const projects = data?.pages.flatMap((page) => page.items)
  const { data: deviceTags } = useTags('device')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Asks the API once typing pauses for 300ms, not on every key
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  if (id) {
    return <ProjectDetail id={id} />
  }

  return (
    <div
      data-role="tester"
      className="max-w-page tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-6 pb-12"
    >
      <h1 className="text-[32px] leading-[1.3] font-bold">搜尋專案</h1>

      <search className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-x-6 gap-y-3">
        <label className="tablet:max-w-100 flex flex-1 flex-col gap-1.5">
          <span className="font-bold">搜尋</span>
          <span className="relative">
            <SearchIcon className="text-ink-subtle pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="專案名稱、公司或類別"
              maxLength={50}
              autoComplete="off"
              className="bg-surface border-line-input min-h-12 w-full rounded-md border pr-3 pl-11"
            />
          </span>
        </label>
        <label className="tablet:min-w-55 flex flex-col gap-1.5">
          <span className="font-bold">裝置</span>
          <select
            value={deviceTagId}
            onChange={(event) => setDeviceTagId(event.target.value)}
            className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
          >
            <option value="">全部裝置</option>
            {deviceTags?.items.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>
      </search>

      <div className="bg-surface border-ink overflow-hidden rounded-md border">
        {isPending && (
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            載入中…
          </p>
        )}

        {/* A failed refetch keeps the projects already on screen */}
        {isError && !projects && (
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            專案載入失敗，請重新整理再試一次。
          </p>
        )}

        {projects?.map((project) => (
          <Link
            key={project.id}
            to={`?id=${project.id}`}
            className="group/row border-line -outline-offset-2 tablet:p-6 desktop:hover:bg-role-soft flex flex-col gap-3 border-t p-4 transition-colors duration-150 ease-out first:border-t-0"
          >
            <div className="tablet:flex-row tablet:flex-wrap tablet:items-center flex flex-col-reverse items-start gap-x-3 gap-y-2">
              <h2 className="tablet:text-subheading text-[18px] leading-[1.4]">
                {project.name}
              </h2>
              <span className="bg-platform-soft text-platform-strong rounded-[4px] px-2 font-bold">
                {project.industry.name}
              </span>
            </div>
            <p className="text-ink-muted">{project.summary}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-ink-subtle">{project.company.name}</span>
              {project.company.average_score === null ? (
                <span className="text-ink-subtle">尚無評價</span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-star flex">
                    <StarIcon />
                  </span>
                  <b>{project.company.average_score}</b>
                  <span className="text-ink-subtle">
                    公司評價（{project.company.rating_count} 則）
                  </span>
                </span>
              )}
              <span className="text-ink-subtle">
                截止 {project.end_date.replaceAll('-', '/')}
              </span>
              {project.devices.length === 0 && (
                <span className="bg-tester-soft text-tester-text desktop:group-hover/row:bg-surface rounded-[4px] px-3 font-bold transition-colors duration-150 ease-out">
                  不限裝置
                </span>
              )}
              {[
                ...new Set(
                  project.devices.map(
                    (device) => device.device_tag?.name ?? device.custom_name
                  )
                ),
              ].map((name) => (
                <span
                  key={name}
                  className="bg-tester-soft text-tester-text desktop:group-hover/row:bg-surface rounded-[4px] px-3 font-bold transition-colors duration-150 ease-out"
                >
                  {name}
                </span>
              ))}
            </div>
          </Link>
        ))}

        {projects?.length === 0 && (
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {debouncedQuery.trim()
              ? `找不到符合「${debouncedQuery.trim()}」的專案，換個關鍵字或裝置試試。`
              : deviceTagId
                ? '目前沒有這個裝置的專案，試試其他裝置。'
                : '目前沒有招募中的專案。'}
          </p>
        )}
      </div>

      {/* isFetchNextPageError stays true while the retry is loading */}
      {isFetchNextPageError && !isFetchingNextPage && (
        <p className="text-ink-muted self-center">載入失敗，請再試一次。</p>
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="btn btn-secondary min-w-50 self-center"
        >
          {isFetchingNextPage ? '載入中…' : '載入更多'}
        </button>
      )}
    </div>
  )
}
