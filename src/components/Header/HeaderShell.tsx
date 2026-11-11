import type { ReactNode } from 'react'
import { Link } from 'react-router'
import logo from '@/assets/logo.png'

type HeaderShellProps = {
  children: ReactNode
}

export function HeaderShell({ children }: HeaderShellProps) {
  return (
    <header className="bg-surface border-line border-b">
      <nav className="max-w-page tablet:gap-3 tablet:px-6 tablet:py-3 mx-auto flex items-center justify-between gap-2 py-2 pr-2 pl-4">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src={logo}
            alt="TestMate 測試咖"
            className="tablet:h-8 block h-6 w-auto"
          />
        </Link>
        {children}
      </nav>
    </header>
  )
}
