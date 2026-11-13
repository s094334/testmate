import { useState } from 'react'
import { Link } from 'react-router'
import { disputeSteps } from './data'
import { SignupProgress } from './SignupProgress'

type SignupAgreementPageProps = {
  role: 'owner' | 'tester'
  defaultAgreed: boolean
  onBack: (agreed: boolean) => void
}

export function SignupAgreementPage({
  role,
  defaultAgreed,
  onBack,
}: SignupAgreementPageProps) {
  // Starts from the value saved in SignupPage, so the tick is still there when you come back
  const [agreed, setAgreed] = useState(defaultAgreed)

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
        <button
          type="button"
          onClick={() => onBack(agreed)}
          className="border-ink text-ink inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 cursor-pointer"
        >
          上一步
        </button>
        <button
          type="submit"
          disabled={!agreed}
          className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 flex-1 rounded-full border-2 px-6 font-bold transition duration-150 ease-out enabled:cursor-pointer enabled:hover:-translate-y-px enabled:active:translate-y-px motion-reduce:enabled:hover:translate-y-0 motion-reduce:enabled:active:translate-y-0"
        >
          完成註冊
        </button>
      </div>
      <p className="text-ink-muted text-center">
        註冊即表示同意
        <Link
          to="/copyright"
          target="_blank"
          rel="noreferrer"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          版權聲明
        </Link>
        與
        <Link
          to="/privacy"
          target="_blank"
          rel="noreferrer"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          隱私權聲明
        </Link>
      </p>
    </form>
  )
}
