import { Outlet } from 'react-router'
import { Footer } from '@/components/Footer'
import { PublicHeader } from '@/components/Header/PublicHeader'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
