import { useState } from 'react'
import { Link } from 'react-router'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { ReturnIcon } from '@/components/icons/ReturnIcon'
import { PassDialog } from './PassDialog'

export function Decision({
  projectId,
  testerName,
  amount,
}: {
  projectId: string
  testerName: string
  amount: string
}) {
  const [decision, setDecision] = useState<'reject' | 'pass' | null>(null)
  const [reason, setReason] = useState('')
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)
  const [passDialogOpen, setPassDialogOpen] = useState(false)

  if (sent) {
    return (
      <section className="bg-surface border-ink tablet:px-8 tablet:py-10 flex flex-col items-center gap-3 rounded-md border px-4 py-8 text-center">
        <span
          className={`inline-flex size-14 items-center justify-center rounded-full ${decision === 'reject' ? 'bg-status-dispute-bg text-status-dispute-text' : 'bg-tester-soft text-tester-text'}`}
        >
          {decision === 'reject' ? (
            <ReturnIcon />
          ) : (
            <CheckIcon className="size-6" />
          )}
        </span>
        <h2 className="text-heading">
          {decision === 'reject' ? '已退回報告' : '已通過驗收'}
        </h2>
        <p className="text-ink-muted">
          {decision === 'reject'
            ? `已寄信通知${testerName}，報告回到「測試中」，等對方修正後重新提交。`
            : `已撥款 ${amount} 給${testerName}，狀態改為「已完成」。`}
        </p>
        {decision === 'reject' && (
          <div className="bg-page border-line flex w-full flex-col gap-1 rounded-md border px-4 py-3.5 text-left">
            <span className="text-ink-subtle">需要修正的地方</span>
            <p className="whitespace-pre-line">{reason}</p>
          </div>
        )}
        <Link to={`/owner/projects/${projectId}`} className="btn btn-primary">
          回到測試進度
        </Link>
      </section>
    )
  }

  return (
    <section className="bg-surface border-ink tablet:px-8 tablet:py-7 flex flex-col gap-5 rounded-md border px-4 py-5">
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-5 flex flex-col gap-1">
          <span className="text-heading">驗收這份報告</span>
          <span className="text-ink-subtle">
            看完上面的結果與 bug 後，選擇通過或退回修改。
          </span>
        </legend>
        <div className="tablet:grid-cols-2 grid gap-3">
          <label
            className={`has-focus-visible:outline-ink flex min-h-16 cursor-pointer items-center gap-3 rounded-[12px] px-4 py-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${decision === 'reject' ? 'border-status-dispute-text bg-status-dispute-bg border-2' : 'border-line-input bg-surface border'}`}
          >
            <input
              type="radio"
              name="decision"
              checked={decision === 'reject'}
              onChange={() => setDecision('reject')}
              className="sr-only"
            />
            <span
              className={`text-status-dispute-text inline-flex size-10 flex-none items-center justify-center rounded-full ${decision === 'reject' ? 'bg-surface' : 'bg-status-dispute-bg'}`}
            >
              <ReturnIcon />
            </span>
            <span className="flex flex-col">
              <b className="text-[18px]">退回修改</b>
              <span className="text-ink-muted">說明哪些地方需要修正</span>
            </span>
          </label>
          <label
            className={`has-focus-visible:outline-ink flex min-h-16 cursor-pointer items-center gap-3 rounded-[12px] px-4 py-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${decision === 'pass' ? 'border-role bg-role-soft border-2' : 'border-line-input bg-surface border'}`}
          >
            <input
              type="radio"
              name="decision"
              checked={decision === 'pass'}
              onChange={() => setDecision('pass')}
              className="sr-only"
            />
            <span className="bg-tester-soft text-tester-text inline-flex size-10 flex-none items-center justify-center rounded-full">
              <CheckIcon className="size-5" />
            </span>
            <span className="flex flex-col">
              <b className="text-[18px]">通過</b>
              <span className="text-ink-muted">撥款給測試人員</span>
            </span>
          </label>
        </div>
      </fieldset>

      {decision === 'reject' && (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-bold">
              需要修正的地方
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </span>
            <span className="text-ink-subtle">
              寫清楚是哪個測試項目或 bug、要補什麼；送出後會寄信通知
              {testerName}，報告會回到「測試中」。
            </span>
            <textarea
              rows={5}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={
                '例：\n・03 試算結果金額：請補上 Edge 和 Chrome 同一組條件的完整截圖。\n・BUG 02：請再附一張縮小視窗後的截圖，確認提示是否仍被截斷。'
              }
              className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !reason.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
            />
          </label>
          {tried && !reason.trim() && (
            <p className="text-status-dispute-text">請寫下需要修正的地方</p>
          )}
          <button
            type="button"
            onClick={() => (reason.trim() ? setSent(true) : setTried(true))}
            className="btn btn-primary tablet:self-end min-w-40"
          >
            退回報告
          </button>
        </div>
      )}

      {decision === 'pass' && (
        <div className="flex flex-col gap-4">
          <p className="text-ink-muted">
            確認通過後，會扣除平台費撥款報酬{' '}
            <b className="text-ink">{amount}</b> 給{testerName}
            ，狀態改為「已完成」。後續麻煩給{testerName}評價。
          </p>
          <button
            type="button"
            onClick={() => setPassDialogOpen(true)}
            className="btn btn-primary tablet:self-end min-w-40"
          >
            確認通過
          </button>

          <PassDialog
            open={passDialogOpen}
            onOpenChange={setPassDialogOpen}
            onConfirm={() => setSent(true)}
            testerName={testerName}
            amount={amount}
          />
        </div>
      )}
    </section>
  )
}
