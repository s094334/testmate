import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { ConsentText } from './ConsentText'
import { NdaText } from './NdaText'

export function TesterNdaPage() {
  const { id = '' } = useParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [agreedConsent, setAgreedConsent] = useState(false)
  const [agreedNda, setAgreedNda] = useState(false)
  const [tried, setTried] = useState(false)
  const [signedAt, setSignedAt] = useState('')
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]

  if (!project || !detail) return <Navigate to="/tester" replace />
  if (project.status !== 'PENDING_NDA' || !tester.payout) {
    return <Navigate to={`/tester/projects/${id}`} replace />
  }

  function goToStep(next: 1 | 2) {
    setStep(next)
    setTried(false)
    window.scrollTo({ top: 0 })
  }

  function sign() {
    if (!agreedNda) return setTried(true)
    setSignedAt(
      new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    )
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full max-w-[1040px] flex-col gap-5 px-4 pt-6 pb-12">
      <Link
        to={`/tester/projects/${id}`}
        className="tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
      >
        <ChevronDownIcon className="rotate-90" />
        上一頁
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-subtitle">簽署保密協議</h1>
      </div>

      {signedAt && (
        <section className="bg-surface border-ink tablet:px-8 tablet:py-12 flex flex-col items-center gap-3 rounded-lg border px-4 py-8 text-center">
          <span className="bg-tester border-ink inline-flex size-14 items-center justify-center rounded-full border-2">
            <CheckIcon className="size-7" />
          </span>
          <h2 className="tablet:text-[26px]">已完成簽署</h2>
          <p className="text-ink-muted">
            <time>{signedAt}</time> 簽署，等負責人付款後就能開始測試。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={`/tester/projects/${id}`}
              className="border-role bg-role text-on-role hover:bg-surface hover:text-ink inline-flex min-h-12 items-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
            >
              回到專案
            </Link>
          </div>
        </section>
      )}

      {!signedAt && (
        <div className="flex flex-col gap-3">
          <p className="flex items-baseline justify-between gap-3">
            <b className="text-[20px]">
              {step === 1 ? '受測者同意書' : '保密協議'}
            </b>
            <span className="text-ink-subtle whitespace-nowrap">
              第 <b>{step}</b> 步，共 2 步
            </span>
          </p>
          <div className="flex gap-2">
            <span className="bg-role h-2 flex-1 rounded-full" />
            <span
              className={`h-2 flex-1 rounded-full ${step === 2 ? 'bg-role' : 'bg-line'}`}
            />
          </div>
        </div>
      )}

      {!signedAt && step === 1 && (
        <section className="bg-surface border-ink overflow-hidden rounded-lg border">
          <h2 className="border-ink text-subheading tablet:px-8 tablet:py-5 tablet:text-[28px] tablet:leading-[1.4] border-b p-4">
            受測者同意書及資料保護聲明
          </h2>
          <div
            tabIndex={0}
            className="tablet:max-h-[520px] tablet:px-8 tablet:py-6 flex max-h-[440px] flex-col gap-3 overflow-y-auto p-4 leading-[1.8]"
          >
            <ConsentText company={project.owner} />
          </div>
          <div className="border-ink bg-page tablet:px-8 tablet:py-4 border-t px-4 py-3">
            <label className="flex min-h-11 cursor-pointer items-start gap-3 font-bold">
              <input
                type="checkbox"
                checked={agreedConsent}
                onChange={(e) => {
                  setAgreedConsent(e.target.checked)
                  setTried(false)
                }}
                className="accent-role mt-1 size-5 flex-none cursor-pointer"
              />
              我已閱讀並同意《受測者同意書及資料保護聲明》
            </label>
          </div>
        </section>
      )}

      {!signedAt && step === 2 && (
        <section className="bg-surface border-ink overflow-hidden rounded-lg border">
          <h2 className="border-ink text-subheading tablet:px-8 tablet:py-5 tablet:text-[28px] tablet:leading-[1.4] border-b p-4">
            2026 受測者保密協議
          </h2>
          <div
            tabIndex={0}
            className="tablet:max-h-[520px] tablet:px-8 tablet:py-6 flex max-h-[440px] flex-col gap-3 overflow-y-auto p-4 leading-[1.8]"
          >
            <NdaText
              testerName={tester.name}
              signedDate={new Date().toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            />
          </div>
          <div className="border-ink bg-page tablet:px-8 tablet:py-4 border-t px-4 py-3">
            <label className="flex min-h-11 cursor-pointer items-start gap-3 font-bold">
              <input
                type="checkbox"
                checked={agreedNda}
                onChange={(e) => {
                  setAgreedNda(e.target.checked)
                  setTried(false)
                }}
                className="accent-role mt-1 size-5 flex-none cursor-pointer"
              />
              我已閱讀並同意《2026 受測者保密協議》
            </label>
          </div>
        </section>
      )}

      {!signedAt && tried && (
        <p className="text-status-dispute-text tablet:block -mt-2 hidden">
          {step === 1 ? '請先勾選同意受測者同意書' : '請先勾選同意保密協議'}
        </p>
      )}

      {!signedAt && step === 1 && (
        <div className="tablet:flex hidden justify-end">
          <button
            type="button"
            onClick={() => (agreedConsent ? goToStep(2) : setTried(true))}
            className={`min-h-12 min-w-50 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out ${agreedConsent ? 'border-role bg-role text-on-role hover:bg-surface hover:text-ink cursor-pointer active:translate-y-px motion-reduce:active:translate-y-0' : 'border-disabled-bg bg-disabled-bg text-disabled-fg cursor-not-allowed'}`}
          >
            下一步
          </button>
        </div>
      )}

      {!signedAt && step === 2 && (
        <div className="tablet:flex hidden justify-between gap-3">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 cursor-pointer rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            上一步
          </button>
          <button
            type="button"
            onClick={sign}
            className={`min-h-12 min-w-50 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out ${agreedNda ? 'border-role bg-role text-on-role hover:bg-surface hover:text-ink cursor-pointer active:translate-y-px motion-reduce:active:translate-y-0' : 'border-disabled-bg bg-disabled-bg text-disabled-fg cursor-not-allowed'}`}
          >
            同意並簽署
          </button>
        </div>
      )}

      {!signedAt && (
        <div className="border-line bg-surface tablet:hidden sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3">
          {tried && (
            <p className="text-status-dispute-text">
              {step === 1 ? '請先勾選同意受測者同意書' : '請先勾選同意保密協議'}
            </p>
          )}
          {step === 1 && (
            <div className="flex gap-2">
              <Link
                to={`/tester/projects/${id}`}
                className="border-role bg-surface text-ink hover:bg-role hover:text-on-role inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
              >
                <ChevronDownIcon className="size-4.5 rotate-90" />
                上一頁
              </Link>
              <button
                type="button"
                onClick={() => (agreedConsent ? goToStep(2) : setTried(true))}
                className={`min-h-12 flex-1 rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out ${agreedConsent ? 'border-role bg-role text-on-role hover:bg-surface hover:text-ink cursor-pointer active:translate-y-px motion-reduce:active:translate-y-0' : 'border-disabled-bg bg-disabled-bg text-disabled-fg cursor-not-allowed'}`}
              >
                下一步
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 flex-1 cursor-pointer rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={sign}
                className={`min-h-12 flex-1 rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out ${agreedNda ? 'border-role bg-role text-on-role hover:bg-surface hover:text-ink cursor-pointer active:translate-y-px motion-reduce:active:translate-y-0' : 'border-disabled-bg bg-disabled-bg text-disabled-fg cursor-not-allowed'}`}
              >
                同意並簽署
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
