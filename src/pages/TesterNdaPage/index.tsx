import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useEngagement, useNda, useSignNda } from '@/api/engagements'
import { BottomBar } from '@/components/BottomBar'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { toast } from '@/components/ui/toast'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { ConsentText } from './ConsentText'
import { NdaText } from './NdaText'

// The mock projects, /tester/projects/:id/nda
export function TesterNdaPage() {
  const { id = '' } = useParams()
  const [signedAt, setSignedAt] = useState<string | null>(null)
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]

  if (!project || !detail) return <Navigate to="/tester" replace />
  if (project.status !== 'PENDING_NDA') {
    return <Navigate to={`/tester/projects/${id}`} replace />
  }

  return (
    <NdaPage
      projectPath={`/tester/projects/${id}`}
      companyName={project.owner}
      testerName={tester.name}
      signedAt={signedAt}
      busy={false}
      onSign={() => {
        setSignedAt(new Date().toISOString())
        window.scrollTo({ top: 0 })
      }}
    />
  )
}

// A real engagement, /tester/engagements/:id/nda. The text stays here; the
// names and the time come from GET /api/engagements/{id}/nda
export function TesterEngagementNdaPage() {
  const { id = '' } = useParams()
  const engagementQuery = useEngagement(id)
  const ndaQuery = useNda(id)
  const sign = useSignNda(id)
  // isPending only shows on the next render, and a second press can come first
  const sending = useRef(false)
  const engagement = engagementQuery.data
  const nda = ndaQuery.data
  const error = engagementQuery.error ?? ndaQuery.error

  if (!engagement || !nda) {
    return (
      <div className="tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full max-w-[1040px] flex-col gap-5 px-4 pt-6 pb-12">
        <Link
          to={`/tester/engagements/${id}`}
          className="link inline-flex min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="bg-surface border-ink rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {!error
              ? '載入中…'
              : error instanceof ApiError &&
                  [400, 403, 404].includes(error.status)
                ? '找不到這個專案。'
                : '專案載入失敗，請重新整理再試一次。'}
          </p>
        </div>
      </div>
    )
  }

  // Signed already, or cancelled. Not while signing here: the engagement is
  // read again before the mutation settles
  if (engagement.status !== 'PENDING_NDA' && !sign.isPending && !sign.data) {
    return <Navigate to={`/tester/engagements/${id}`} replace />
  }

  return (
    <NdaPage
      projectPath={`/tester/engagements/${id}`}
      companyName={nda.company_name}
      testerName={nda.tester_name}
      signedAt={sign.data?.nda_signed_at ?? null}
      busy={sign.isPending}
      onSign={async () => {
        if (sending.current) return
        sending.current = true
        try {
          await sign.mutateAsync()
          window.scrollTo({ top: 0 })
        } catch (error) {
          toast.add({
            title:
              error instanceof ApiError
                ? error.message
                : '無法連線，請稍後再試',
            timeout: 4000,
          })
        } finally {
          sending.current = false
        }
      }}
    />
  )
}

function NdaPage({
  projectPath,
  companyName,
  testerName,
  signedAt,
  busy,
  onSign,
}: {
  projectPath: string
  companyName: string
  testerName: string
  signedAt: string | null
  busy: boolean
  onSign: () => void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [agreedConsent, setAgreedConsent] = useState(false)
  const [agreedNda, setAgreedNda] = useState(false)
  const [tried, setTried] = useState(false)

  function goToStep(next: 1 | 2) {
    setStep(next)
    setTried(false)
    window.scrollTo({ top: 0 })
  }

  function sign() {
    if (!agreedNda) return setTried(true)
    onSign()
  }

  return (
    <div className="tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full max-w-[1040px] flex-col gap-5 px-4 pt-6 pb-12">
      {(signedAt || step === 1) && (
        <Link
          to={projectPath}
          className="link tablet:inline-flex hidden min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>
      )}
      {!signedAt && step === 2 && (
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="link tablet:inline-flex hidden min-h-11 cursor-pointer items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </button>
      )}

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
            <time dateTime={signedAt}>
              {new Date(signedAt).toLocaleString('zh-TW', {
                timeZone: 'Asia/Taipei',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </time>{' '}
            簽署，等負責人付款後就能開始測試。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={projectPath} className="btn btn-primary">
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
            <ConsentText company={companyName} />
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
              testerName={testerName}
              signedDate={(signedAt
                ? new Date(signedAt)
                : new Date()
              ).toLocaleDateString('zh-TW', {
                timeZone: 'Asia/Taipei',
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
            className={`btn min-w-50 ${agreedConsent ? 'btn-primary' : 'btn-inactive'}`}
          >
            下一步
          </button>
        </div>
      )}

      {!signedAt && step === 2 && (
        <div className="tablet:flex hidden justify-end">
          <button
            type="button"
            onClick={sign}
            disabled={busy}
            className={`btn min-w-50 ${agreedNda ? 'btn-primary' : 'btn-inactive'}`}
          >
            同意並簽署
          </button>
        </div>
      )}

      {!signedAt && (
        <BottomBar className="border-line bg-surface tablet:hidden fixed inset-x-0 bottom-0 flex flex-col gap-2 border-t px-4 py-3">
          {tried && (
            <p className="text-status-dispute-text">
              {step === 1 ? '請先勾選同意受測者同意書' : '請先勾選同意保密協議'}
            </p>
          )}
          {step === 1 && (
            <div className="flex gap-2">
              <Link
                to={projectPath}
                className="btn btn-secondary flex-1 gap-1.5 px-4"
              >
                <ChevronDownIcon className="size-4.5 rotate-90" />
                上一頁
              </Link>
              <button
                type="button"
                onClick={() => (agreedConsent ? goToStep(2) : setTried(true))}
                className={`btn flex-1 px-4 ${agreedConsent ? 'btn-primary' : 'btn-inactive'}`}
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
                className="btn btn-secondary flex-1 px-4"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={sign}
                disabled={busy}
                className={`btn flex-1 px-4 ${agreedNda ? 'btn-primary' : 'btn-inactive'}`}
              >
                同意並簽署
              </button>
            </div>
          )}
        </BottomBar>
      )}
    </div>
  )
}
