import { Link } from 'react-router'
import { BlobBackground } from '@/components/BlobBackground'

export function LoginPage() {
  return (
    <div className="tablet:px-6 tablet:py-16 relative isolate flex-1 px-4 pt-6 pb-12">
      <BlobBackground />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-surface border-ink tablet:gap-7 tablet:p-12 mx-auto flex max-w-130 flex-col gap-6 rounded-md border px-5 py-6"
      >
        <h1 className="text-title-page">登入</h1>
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
            autoComplete="current-password"
            placeholder="請輸入密碼"
            className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
          />
        </div>
        <button
          type="submit"
          className="border-ink bg-ink text-surface hover:bg-surface hover:text-ink min-h-12 w-full rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          登入
        </button>
        <p className="text-ink-muted text-center">
          還沒有帳號？
          <Link
            to="/signup"
            className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
          >
            註冊
          </Link>
        </p>
      </form>
    </div>
  )
}
