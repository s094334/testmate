import { Link, Outlet } from 'react-router'
import logo from '@/assets/logo.png'
import { AuthBackground } from '@/components/backgrounds/AuthBackground'

export function AuthLayout() {
  return (
    <div className="tablet:px-6 tablet:py-16 relative isolate flex min-h-dvh flex-col items-center justify-center px-4 pt-15 pb-12">
      <AuthBackground />
      <div className="max-w-page tablet:min-h-17 tablet:px-6 absolute inset-x-0 top-0 mx-auto flex min-h-15 items-center pl-4">
        <Link to="/">
          <img
            src={logo}
            alt="TestMate 測試咖"
            className="tablet:h-8 block h-6 w-auto"
          />
        </Link>
      </div>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}
