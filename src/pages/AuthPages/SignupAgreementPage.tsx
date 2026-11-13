import { useState } from 'react'
import { Link } from 'react-router'
import { disputeSteps } from './data'
import { DisputeTermsDialog } from './DisputeTermsDialog'
import { SignupProgress } from './SignupProgress'

type SignupAgreementPageProps = {
  role: 'owner' | 'tester'
  defaultAgreed: boolean
  onBack: (agreed: boolean) => void
  onSubmit: () => void
}

export function SignupAgreementPage({
  role,
  defaultAgreed,
  onBack,
  onSubmit,
}: SignupAgreementPageProps) {
  const [agreed, setAgreed] = useState(defaultAgreed)
  const [open, setOpen] = useState(false)

  return (
    <>
      <form
        data-role={role}
        onSubmit={(e) => {
          e.preventDefault()
          if (agreed) onSubmit()
        }}
        className="bg-surface border-ink tablet:p-12 mx-auto mt-14 flex max-w-180 flex-col gap-5 rounded-md border px-5 py-6"
      >
        <h1 className="text-subtitle">註冊</h1>
        <div className="flex flex-col gap-3">
          <b className="text-subheading">同意爭議處理流程</b>
          <SignupProgress step={4} />
        </div>
        <section className="flex flex-col gap-4">
          <ol className="flex flex-col gap-4">
            {disputeSteps.map((step, index) => (
              <li key={step.title} className="flex items-baseline gap-3">
                <span className="font-num text-num-heading text-ink-subtle flex-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-0.5">
                  <b className="text-[18px]">{step.title}</b>
                  <div className="text-ink-muted">{step.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border-ink bg-surface text-ink min-h-13 w-full cursor-pointer rounded-full border-2 px-6 text-[18px] font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0"
          >
            查看完整流程
          </button>
          {!agreed && (
            <span className="text-ink-muted">
              請點選查看完整流程，並在文件最下方勾選同意，才能完成註冊。
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onBack(agreed)}
            className="border-ink text-ink inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-full border-2 px-6 font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0"
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
      <DisputeTermsDialog
        open={open}
        onOpenChange={setOpen}
        agreed={agreed}
        onAgreedChange={setAgreed}
      />
    </>
  )
}
