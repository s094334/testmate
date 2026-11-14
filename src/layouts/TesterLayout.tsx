import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer'
import { TesterHeader } from '@/components/Header/TesterHeader'

export function TesterLayout() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    main.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div data-role="tester" className="flex h-dvh flex-col">
      <TesterHeader />
      {/* The footer is inside the scroll area, so it comes after the page content.
          mt-auto pushes it to the bottom when the page is shorter than the screen */}
      <main ref={main} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  )
}
