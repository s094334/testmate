import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '@/api/session'
import { Footer } from '@/components/Footer'
import { OwnerHeader } from '@/components/Header/OwnerHeader'

export function OwnerLayout() {
  const { pathname } = useLocation()
  const { data: user, isPending } = useSession()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (isPending) return null
  if (!user) return <Navigate to="/" replace />
  if (user.role !== 'owner') return <Navigate to="/tester" replace />

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
