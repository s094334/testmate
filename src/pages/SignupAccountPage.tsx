import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { SignupProgress } from '@/components/SignupProgress'

export function SignupAccountPage() {
  const { role } = useParams()
  const navigate = useNavigate()

  if (role !== 'owner' && role !== 'tester') {
    return <Navigate to="/signup" replace />
  }

  return (
    <form
      data-role={role}
      onSubmit={(e) => {
        e.preventDefault()
        navigate(`/signup/${role}/profile`)
      }}
      className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-130 flex-col gap-5 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">建立帳號</b>
        <SignupProgress step={2} />
      </div>
      <div className="bg-role-soft flex items-center justify-between gap-3 rounded-md px-4 py-3">
        <span>
          註冊身分：<b>{role === 'owner' ? '專案負責人' : '測試人員'}</b>
        </span>
        <Link to="/signup" className="hover:text-ink-muted underline">
          更改
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-label">
          密碼
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="請輸入密碼"
          className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
        />
        <span className="text-ink-subtle">至少 8 碼，需包含英文與數字</span>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirm-password" className="text-label">
          確認密碼
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="再輸入一次密碼"
          className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
        />
      </div>
      <button
        type="submit"
        className="border-ink bg-ink text-surface hover:bg-surface hover:text-ink min-h-12 w-full rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
      >
        下一步
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
    </form>
  )
}
