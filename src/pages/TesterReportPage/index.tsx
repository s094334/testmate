import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import {
  joinedProjectDetails,
  joinedProjects,
  reportDrafts,
  type ReportBug,
  type ReportItem,
} from '@/data/tester'
import { Countdown } from '@/pages/TesterProjectPage/Countdown'
import { BugReports } from './BugReports'
import { SubmitDialog } from './SubmitDialog'
import { TestResults } from './TestResults'

export function TesterReportPage() {
  const { id = '' } = useParams()
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]
  const draft = reportDrafts[id]
  const [env, setEnv] = useState(draft?.env ?? '')
  const [items, setItems] = useState<ReportItem[]>(
    draft?.items ?? [
      { title: '', steps: '', result: '', pass: null, bugRef: '' },
    ]
  )
  const [bugs, setBugs] = useState<ReportBug[]>(
    () =>
      draft?.bugs ?? [
        {
          id: crypto.randomUUID(),
          type: 'Bug',
          title: '',
          env: '',
          steps: '',
          priority: '一般',
          frequency: '每次都會發生',
          location: '',
          original: '',
          languageIssue: '錯字',
          suggestion: '',
          files: [],
        },
      ]
  )
  const [savedAt, setSavedAt] = useState(draft?.savedAt ?? '')
  const [tried, setTried] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [now] = useState(() => Date.now())

  if (!project || !detail) return <Navigate to="/tester" replace />
  if (
    project.status !== 'TESTING' ||
    (detail.submitDeadline && new Date(detail.submitDeadline).getTime() < now)
  ) {
    return <Navigate to={`/tester/projects/${id}`} replace />
  }

  const missing =
    !env.trim() ||
    items.some(
      (item) =>
        item.pass === null ||
        (item.pass === false && !item.bugRef.trim()) ||
        !item.title.trim() ||
        !item.steps.trim() ||
        !item.result.trim()
    ) ||
    bugs.some((bug) =>
      bug.type === '語言'
        ? !bug.location.trim() || !bug.original.trim() || !bug.suggestion.trim()
        : !bug.title.trim() || !bug.env.trim() || !bug.steps.trim()
    )

  function save() {
    const now = new Date()
    setSavedAt(
      `今天 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    )
  }

  function openSubmitDialog() {
    if (missing) return setTried(true)
    setSubmitDialogOpen(true)
  }

  function confirmSubmit() {
    setTried(false)
    setSubmitted(true)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="max-w-page tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-5 px-4 pt-6 pb-12">
      <Link
        to={`/tester/projects/${id}`}
        className="link inline-flex min-h-11 items-center gap-1.5 self-start"
      >
        <ChevronDownIcon className="rotate-90" />
        上一頁
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="min-w-0 text-[32px] leading-[1.3] font-bold">
            提交測試報告
          </h1>
          {detail.submitDeadline && (
            <Countdown
              label="提交期限"
              deadline={detail.submitDeadline}
              className="tablet:items-end tablet:text-right flex flex-none flex-col"
            />
          )}
        </div>
        <p className="text-ink-muted">
          {project.name}、{project.owner}、依測試說明回報
        </p>
      </div>

      {!submitted && (
        <div className="tablet:gap-8 flex flex-col gap-6">
          <section className="bg-surface border-ink tablet:px-8 tablet:py-6 flex flex-col gap-2 rounded-md border p-4">
            <label
              htmlFor="env"
              className="text-subheading tablet:text-heading"
            >
              測試環境
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </label>
            <p className="text-ink-subtle">
              依序填寫裝置、系統版本、App 版本，用「、」隔開
            </p>
            <input
              id="env"
              type="text"
              value={env}
              onChange={(event) => setEnv(event.target.value)}
              placeholder="例：iPhone 15、iOS 18.1、App 1.2.0"
              className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !env.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
            />
          </section>

          <TestResults
            items={items}
            setItems={setItems}
            bugCount={bugs.length}
            tried={tried}
          />

          <BugReports bugs={bugs} setBugs={setBugs} env={env} tried={tried} />

          {tried && missing && (
            <p className="text-status-dispute-text">
              還有欄位沒填完：測試環境、每個測試結果的項目、步驟、結果與通過與否（不通過要填相關
              bug），以及每個 bug 的必填欄位都要填寫。
            </p>
          )}

          <div className="border-line tablet:justify-end flex flex-wrap items-center gap-4 border-t pt-4">
            {savedAt && (
              <span className="text-ink-muted tablet:basis-auto inline-flex basis-full items-center gap-1.5">
                <CheckIcon className="text-tester-strong size-4.5" />
                已儲存、{savedAt}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              className="btn btn-secondary tablet:min-w-50 tablet:flex-none min-w-30 flex-1 px-4"
            >
              儲存
            </button>
            <button
              type="button"
              onClick={openSubmitDialog}
              className="btn btn-primary tablet:min-w-50 tablet:flex-none min-w-30 flex-1 px-4"
            >
              繳交測試報告
            </button>
          </div>

          <SubmitDialog
            open={submitDialogOpen}
            onOpenChange={setSubmitDialogOpen}
            onConfirm={confirmSubmit}
          />
        </div>
      )}

      {submitted && (
        <section className="bg-surface border-ink tablet:px-8 flex flex-col items-center gap-3 rounded-md border px-4 py-12 text-center">
          <span className="bg-tester border-ink flex size-14 items-center justify-center rounded-full border-2">
            <CheckIcon className="size-7" />
          </span>
          <h2 className="text-section-title">已繳交測試報告</h2>
          <p className="text-ink-muted">待負責人逐項驗收報告。</p>
          <Link
            to={`/tester/projects/${id}`}
            className="btn btn-secondary mt-2"
          >
            回到專案頁
          </Link>
        </section>
      )}
    </div>
  )
}
