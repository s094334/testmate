import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { TesterLayout } from '@/layouts/TesterLayout'
import { CopyrightPage } from '@/pages/LegalPages/CopyrightPage'
import { PrivacyPage } from '@/pages/LegalPages/PrivacyPage'
import { HomePage } from '@/pages/HomePage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { LoginPage } from '@/pages/AuthPages/LoginPage'
import { SignupPage } from '@/pages/AuthPages/SignupPage'
import { TesterHomePage } from '@/pages/TesterHomePage'
import { TesterProfilePage } from '@/pages/TesterProfilePage'
import { TesterProjectsPage } from '@/pages/TesterProjectsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="copyright" element={<CopyrightPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route path="tester" element={<TesterLayout />}>
          <Route index element={<TesterHomePage />} />
          <Route path="profile" element={<TesterProfilePage />} />
          <Route path="projects" element={<TesterProjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
