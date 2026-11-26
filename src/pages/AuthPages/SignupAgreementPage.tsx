import { useState } from 'react'
import { Link } from 'react-router'
import { BottomBar } from '@/components/BottomBar'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { disputeSteps } from './data'
import { DisputeTermsDialog } from './DisputeTermsDialog'
import { SignupProgress } from './SignupProgress'

type SignupAgreementPageProps = {
  role: 'owner' | 'tester'
  defaultAgreed: boolean
  onBack: (agreed: boolean) => void
  onSubmit: () => void
  // True while the signup request is on its way
  submitting: boolean
  // Why the signup failed, e.g. 這個 email 已經註冊
  errorMessage?: string
}

export function SignupAgreementPage({
  role,
  defaultAgreed,
  onBack,
  onSubmit,
  submitting,
  errorMessage,
}: SignupAgreementPageProps) {
  const [agreed, setAgreed] = useState(defaultAgreed)
  const [open, setOpen] = useState(false)

  return (
    <>
      <form
        data-role={role}
        onSubmit={(e) => {
          e.preventDefault()
          if (agreed && !submitting) onSubmit()
        }}
        className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-180 flex-col gap-5 rounded-md border px-5 py-6"
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
          <div className="flex flex-col gap-5 p-5">
            <ol className="flex flex-col gap-4">
              {disputeSteps.map((step, index) => (
                <li key={step.title} className="flex items-baseline gap-3">
                  <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <b className="text-[18px]">{step.title}</b>
                    <div className="text-ink-muted">{step.body}</div>
                  </div>
                </li>
              ))}
            </ol>
            {!agreed && (
              <p className="text-ink-muted">
                請點選查看完整流程，並在文件最下方勾選同意，繼續完成註冊。
              </p>
            )}
            {agreed && (
              <p className="text-ink-muted">
                已同意爭議處理流程，
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="link text-role cursor-pointer font-bold"
                >
                  再看一次爭議處理流程
                </button>
              </p>
            )}
          </div>
        </section>
        {errorMessage && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errorMessage}
          </span>
        )}
        <BottomBar className="border-line bg-surface tablet:static tablet:border-t-0 tablet:p-0 fixed inset-x-0 bottom-0 flex gap-3 border-t px-4 py-3">
          <button
            type="button"
            onClick={() => onBack(agreed)}
            className="btn btn-secondary btn-ink flex-1"
          >
            上一步
          </button>
          {!agreed && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-ink flex-1"
            >
              查看完整流程
            </button>
          )}
          {agreed && (
            <button
              type="submit"
              // Also off while sending, so a double click cannot register twice
              disabled={submitting}
              className="btn btn-primary btn-ink flex-1"
            >
              完成註冊
            </button>
          )}
        </BottomBar>
        <p className="text-ink-muted text-center">
          註冊即表示同意
          <Link
            to="/copyright"
            target="_blank"
            rel="noreferrer"
            className="link text-role font-bold"
          >
            版權聲明
          </Link>
          與
          <Link
            to="/privacy"
            target="_blank"
            rel="noreferrer"
            className="link text-role font-bold"
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
