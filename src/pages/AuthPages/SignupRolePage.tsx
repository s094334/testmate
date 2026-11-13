import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { OwnerIllustration } from '@/components/illustrations/OwnerIllustration'
import { TesterIllustration } from '@/components/illustrations/TesterIllustration'
import { SignupProgress } from './SignupProgress'

export function SignupRolePage() {
  const [role, setRole] = useState<'owner' | 'tester' | null>(null)
  const navigate = useNavigate()

  return (
    <div className="bg-surface border-ink tablet:gap-7 tablet:p-12 mx-auto flex max-w-180 flex-col gap-6 rounded-md border px-5 py-6">
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">選擇角色</b>
        <SignupProgress step={1} />
      </div>
      <div className="tablet:flex-row flex flex-col gap-4">
        <button
          type="button"
          data-selected={role === 'owner'}
          onClick={() => setRole('owner')}
          className={`group border-ink bg-surface data-selected:border-owner-strong data-selected:bg-owner-soft data-selected:ring-owner-strong data-selected:shadow-hover not-data-selected:hover:shadow-hover tablet:flex-col tablet:gap-3 tablet:px-4 tablet:py-6 tablet:text-center relative flex flex-1 items-center gap-4 rounded-md border p-4 pr-12 text-left transition-[translate,box-shadow,background-color,border-color,opacity] duration-200 ease-out data-selected:ring-2 motion-safe:hover:-translate-y-1 motion-safe:data-selected:-translate-y-1 ${role === 'tester' ? 'opacity-75' : ''}`}
        >
          {role === 'owner' && (
            <span className="animate-pop bg-owner-strong text-on-role absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full">
              <CheckIcon />
            </span>
          )}
          <OwnerIllustration className="tablet:w-45 w-24" />
          <span className="flex flex-col gap-1">
            <b className="text-subheading tablet:text-heading">專案負責人</b>
            <span className="text-ink-muted">我有產品，想找人來測試</span>
          </span>
        </button>
        <button
          type="button"
          data-selected={role === 'tester'}
          onClick={() => setRole('tester')}
          className={`group border-ink bg-surface data-selected:border-tester-strong data-selected:bg-tester-soft data-selected:ring-tester-strong data-selected:shadow-hover not-data-selected:hover:shadow-hover tablet:flex-col tablet:gap-3 tablet:px-4 tablet:py-6 tablet:text-center relative flex flex-1 items-center gap-4 rounded-md border p-4 pr-12 text-left transition-[translate,box-shadow,background-color,border-color,opacity] duration-200 ease-out data-selected:ring-2 motion-safe:hover:-translate-y-1 motion-safe:data-selected:-translate-y-1 ${role === 'owner' ? 'opacity-75' : ''}`}
        >
          {role === 'tester' && (
            <span className="animate-pop bg-tester-strong text-on-role absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full">
              <CheckIcon />
            </span>
          )}
          <TesterIllustration className="tablet:w-45 w-24" />
          <span className="flex flex-col gap-1">
            <b className="text-subheading tablet:text-heading">測試人員</b>
            <span className="text-ink-muted">我想接案測試、賺報酬</span>
          </span>
        </button>
      </div>
      <button
        type="button"
        disabled={!role}
        onClick={() => navigate(`/signup/${role}/account`)}
        className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 w-full rounded-md border px-6 font-bold transition-colors duration-250 ease-out"
      >
        {role === 'owner'
          ? '以專案負責人身分繼續'
          : role === 'tester'
            ? '以測試人員身分繼續'
            : '下一步'}
      </button>
      <p className="text-ink-muted text-center">
        已經有帳號？
        <Link
          to="/login"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          登入
        </Link>
      </p>
    </div>
  )
}
