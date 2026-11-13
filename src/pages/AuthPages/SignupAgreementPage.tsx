import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { SignupProgress } from './SignupProgress'

// Only one checkbox here, so plain useState instead of react-hook-form
export function SignupAgreementPage() {
  const { role } = useParams()
  const [agreed, setAgreed] = useState(false)

  if (role !== 'owner' && role !== 'tester') {
    return <Navigate to="/signup" replace />
  }

  return (
    <form
      data-role={role}
      onSubmit={(e) => e.preventDefault()}
      className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-180 flex-col gap-5 rounded-md border px-5 py-6 mt-14"
    >
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">同意爭議處理流程</b>
        <SignupProgress step={4} />
      </div>
      <section className="border-ink overflow-hidden rounded-md border">
        <h2 className="border-ink bg-page text-subheading border-b px-5 py-4">
          爭議處理流程
        </h2>
        <ol className="flex flex-col gap-4 p-5">
          <li className="flex gap-3">
            <span className="border-ink font-num inline-flex size-8 flex-none items-center justify-center rounded-full border text-[18px] font-semibold">
              1
            </span>
            <span className="flex flex-col gap-0.5">
              <b className="text-[18px]">進入爭議</b>
              <span className="text-ink-muted">
                負責人第 3
                次退回報告時，案件會自動進入「爭議處理中」，雙方都會收到通知。
              </span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="border-ink font-num inline-flex size-8 flex-none items-center justify-center rounded-full border text-[18px] font-semibold">
              2
            </span>
            <span className="flex flex-col gap-0.5">
              <b className="text-[18px]">暫停撥款與退款</b>
              <span className="text-ink-muted">
                爭議期間，代管款不會撥款也不會退款，測試也暫停。
              </span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="border-ink font-num inline-flex size-8 flex-none items-center justify-center rounded-full border text-[18px] font-semibold">
              3
            </span>
            <span className="flex flex-col gap-0.5">
              <b className="text-[18px]">雙方協商</b>
              <span className="text-ink-muted">
                平台不介入爭議內容，請雙方在平台外協商，再各自回平台勾選結果。每人只能勾選一次，送出後不能更改。爭議期限是進入爭議後
                7 天或專案結束時間，以較晚時間為準。
              </span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="border-ink font-num inline-flex size-8 flex-none items-center justify-center rounded-full border text-[18px] font-semibold">
              4
            </span>
            <div className="flex flex-col gap-0.5">
              <b className="text-[18px]">處理結果</b>
              <span className="text-ink-muted">
                雙方勾選一致時，平台立即處理：
              </span>
              <ul className="text-ink-muted list-disc pl-5">
                <li>繼續進行：回到測試中，重新計算交付期限</li>
                <li>已完成：扣除平台抽成 15% 後，撥款給測試人員</li>
                <li>結束專案：全額退款給負責人</li>
              </ul>
            </div>
          </li>
        </ol>
      </section>
      <label className="flex min-h-12 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="accent-ink mt-0.5 size-5.5 flex-none"
        />
        <span className="font-bold">我已閱讀並同意爭議處理流程</span>
      </label>
      <div className="flex gap-3">
        <Link
          to={`/signup/${role}/profile`}
          className="border-role bg-surface hover:bg-role-soft inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          上一步
        </Link>
        <button
          type="submit"
          disabled={!agreed}
          className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 flex-1 rounded-md border px-6 font-bold transition-colors duration-250 ease-out"
        >
          完成註冊
        </button>
      </div>
      <p className="text-ink-muted text-center">
        註冊即表示同意
        <Link
          to="/terms"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          服務條款
        </Link>
        與
        <Link
          to="/privacy"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          隱私權聲明
        </Link>
      </p>
    </form>
  )
}
