import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer'
import { OwnerHeader } from '@/components/Header/OwnerHeader'

export function OwnerLayout() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    main.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div data-role="owner" className="flex h-dvh flex-col">
      <OwnerHeader />
      <main ref={main} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  )
}
