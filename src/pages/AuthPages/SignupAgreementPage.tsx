import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { disputeSteps } from './data'
import { SignupProgress } from './SignupProgress'

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
          {disputeSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="border-ink font-num inline-flex size-8 flex-none items-center justify-center rounded-full border text-[18px] font-semibold">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <b className="text-[18px]">{step.title}</b>
                <div className="text-ink-muted">{step.body}</div>
              </div>
            </li>
          ))}
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
          className="border-ink text-ink hover:bg-platform-soft inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          上一步
        </Link>
        <button
          type="submit"
          disabled={!agreed}
          className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 flex-1 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out enabled:active:translate-y-px motion-reduce:active:translate-y-0"
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
