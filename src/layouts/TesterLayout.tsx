import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/Footer'
import { TesterHeader } from '@/components/Header/TesterHeader'

export function TesterLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div data-role="tester" className="flex min-h-dvh flex-col">
      <TesterHeader />
      {/* The whole page scrolls and the header sticks to the top.
          mt-auto pushes the footer to the bottom when the page is shorter than the screen */}
      <main className="flex flex-1 flex-col">
        <Outlet />
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  )
}
