import { DownloadIcon } from '@/components/icons/DownloadIcon'
import type { ReportBug } from '@/data/tester'

export function BugReports({ bugs }: { bugs: ReportBug[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-subheading tablet:text-heading flex items-center gap-2">
        回報 bug
      </h2>

      {bugs.length === 0 && (
        <p className="bg-surface border-line text-ink-muted rounded-md border p-4">
          這份報告沒有回報 bug。
        </p>
      )}

      {bugs.map((bug) => {
        const no = String(bug.no).padStart(2, '0')

        return (
          <article
            key={bug.id}
            id={`bug-${no}`}
            className="bg-surface border-ink tablet:p-6 flex scroll-mt-24 flex-col gap-4 rounded-md border p-4"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-num text-[22px] font-semibold">
                BUG {no}
              </span>
              <span
                className={`rounded-[4px] px-2.5 py-0.5 font-bold ${bug.type === 'Bug' ? 'bg-status-dispute-bg text-status-dispute-text' : 'bg-platform-soft text-ink-muted'}`}
              >
                {bug.type}
              </span>
              {bug.type !== '語言' && (
                <h3 className="text-[18px] leading-[1.5]">{bug.title}</h3>
              )}
            </div>

            {bug.type !== '語言' && (
              <>
                <dl className="tablet:grid-cols-3 grid gap-4">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">環境</dt>
                    <dd className="font-bold wrap-anywhere">{bug.env}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">嚴重度</dt>
                    <dd className="font-bold">{bug.priority}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">頻率</dt>
                    <dd className="font-bold">{bug.frequency}</dd>
                  </div>
                </dl>
                <div className="flex flex-col gap-1.5">
                  <span className="text-ink-subtle">
                    內容（重置步驟、目前結果與預期結果）
                  </span>
                  <p className="bg-page border-line rounded-md border px-4 py-3.5 whitespace-pre-line">
                    {bug.steps}
                  </p>
                </div>
              </>
            )}

            {bug.type === '語言' && (
              <>
                <dl className="tablet:grid-cols-3 grid gap-4">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">位置（頁面）</dt>
                    <dd className="font-bold wrap-anywhere">{bug.location}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">問題類型</dt>
                    <dd className="font-bold">{bug.languageIssue}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-ink-subtle">建議修改</dt>
                    <dd className="font-bold wrap-anywhere">
                      {bug.suggestion}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-col gap-1.5">
                  <span className="text-ink-subtle">原文</span>
                  <p className="whitespace-pre-line">{bug.original}</p>
                </div>
              </>
            )}

            {bug.files.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-ink-subtle">
                  {bug.type === '語言' ? '位置截圖' : '截圖或錄影'}
                </span>
                {bug.files.map((name) => (
                  <div
                    key={name}
                    className="bg-page border-line flex items-center justify-between gap-3 rounded-md border py-2 pr-2 pl-3.5"
                  >
                    <span className="min-w-0 wrap-anywhere">{name}</span>
                    <button
                      type="button"
                      className="btn btn-secondary min-h-10 flex-none px-3.5"
                    >
                      <DownloadIcon />
                      下載
                      <span className="sr-only">{name}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
