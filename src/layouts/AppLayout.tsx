import { Outlet } from 'react-router'
import { Footer } from '@/components/Footer'
import { PublicHeader } from '@/components/Header/PublicHeader'

export function AppLayout() {
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
