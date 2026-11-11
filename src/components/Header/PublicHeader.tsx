import { Link, useMatch } from 'react-router'
import { HeaderShell } from './HeaderShell'

export function PublicHeader() {
  const isLoginPage = useMatch('/login')

  return (
    <HeaderShell>
      {!isLoginPage && (
        <Link
          to="/login"
          className="border-ink bg-surface hover:bg-role-soft tablet:px-4 inline-flex min-h-11 items-center rounded-md border px-3 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          登入
        </Link>
      )}
    </HeaderShell>
  )
}
