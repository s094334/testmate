import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer'
import { OwnerHeader } from '@/components/Header/OwnerHeader'

export function OwnerLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div data-role="owner" className="flex min-h-dvh flex-col">
      <OwnerHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  )
}
