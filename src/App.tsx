import { BrowserRouter } from 'react-router'
import { Footer } from '@/components/Footer'
import { PublicHeader } from '@/components/Header/PublicHeader'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-dvh flex-col">
        <PublicHeader />
        <main className="flex-1">測試人員媒合平台</main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
