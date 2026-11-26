import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useSession } from '@/api/session'
import { Footer } from '@/components/Footer'
import { HeaderShell } from '@/components/Header/HeaderShell'
import { OwnerHeader } from '@/components/Header/OwnerHeader'
import { PublicHeader } from '@/components/Header/PublicHeader'
import { TesterHeader } from '@/components/Header/TesterHeader'

export function AppLayout() {
  const { pathname } = useLocation()
  const { data: user } = useSession()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col pb-(--bottom-bar-height)">
      {user === undefined ? (
        <HeaderShell>{null}</HeaderShell>
      ) : user === null ? (
        <PublicHeader />
      ) : user.role === 'owner' ? (
        <OwnerHeader />
      ) : (
        <TesterHeader />
      )}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
