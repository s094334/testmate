import { useState } from 'react'
import { Link } from 'react-router'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-surface border-ink tablet:gap-7 tablet:p-12 mx-auto flex max-w-130 flex-col gap-6 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">登入</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="example@example.com"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
        />
      </div>
      <button
        type="submit"
        disabled={email.trim() === '' || password === ''}
        className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 w-full rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out enabled:active:translate-y-px motion-reduce:active:translate-y-0"
      >
        登入
      </button>
      <div className="flex flex-col gap-1">
        <p className="text-ink-muted text-center">
          還沒有帳號？
          <Link
            to="/signup"
            className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
          >
            註冊
          </Link>
        </p>
      </div>
    </form>
  )
}
