import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer'
import { PublicHeader } from '@/components/Header/PublicHeader'

export function AppLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
