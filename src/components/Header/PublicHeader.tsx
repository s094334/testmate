import { Link } from 'react-router'
import { HeaderShell } from './HeaderShell'

export function PublicHeader() {
  return (
    <HeaderShell>
      <Link
        to="/login"
        className="border-ink hover:bg-ink hover:text-surface tablet:px-4 inline-flex min-h-11 items-center rounded-md border px-3 font-bold transition-colors duration-150 ease-out"
      >
        登入
      </Link>
    </HeaderShell>
  )
}
