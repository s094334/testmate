import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { OwnerLayout } from '@/layouts/OwnerLayout'
import { TesterLayout } from '@/layouts/TesterLayout'
import { CopyrightPage } from '@/pages/LegalPages/CopyrightPage'
import { PrivacyPage } from '@/pages/LegalPages/PrivacyPage'
import { HomePage } from '@/pages/HomePage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { LoginPage } from '@/pages/AuthPages/LoginPage'
import { SignupPage } from '@/pages/AuthPages/SignupPage'
import { OwnerCompanyPage } from '@/pages/OwnerCompanyPage'
import { OwnerHomePage } from '@/pages/OwnerHomePage'
import { OwnerProjectNewPage } from '@/pages/OwnerProjectNewPage'
import { OwnerProjectInfoPage } from '@/pages/OwnerProjectInfoPage'
import { OwnerProjectPage } from '@/pages/OwnerProjectPage'
import { OwnerReportPage } from '@/pages/OwnerReportPage'
import { TesterHomePage } from '@/pages/TesterHomePage'
import { TesterInvitePage } from '@/pages/TesterInvitePage'
import { TesterProfilePage } from '@/pages/TesterProfilePage'
import { TesterNdaPage } from '@/pages/TesterNdaPage'
import { TesterProjectPage } from '@/pages/TesterProjectPage'
import { TesterExplorePage } from '@/pages/TesterExplorePage'
import { TesterReportPage } from '@/pages/TesterReportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="copyright" element={<CopyrightPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="projects" element={<TesterExplorePage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route path="tester" element={<TesterLayout />}>
          <Route index element={<TesterHomePage />} />
          <Route path="invites/:id" element={<TesterInvitePage />} />
          <Route path="profile" element={<TesterProfilePage />} />
          <Route
            path="projects"
            element={<Navigate to="/projects" replace />}
          />
          <Route path="projects/:id" element={<TesterProjectPage />} />
          <Route path="projects/:id/nda" element={<TesterNdaPage />} />
          <Route path="projects/:id/report" element={<TesterReportPage />} />
        </Route>
        <Route path="owner" element={<OwnerLayout />}>
          <Route index element={<OwnerHomePage />} />
          <Route path="company" element={<OwnerCompanyPage />} />
          <Route path="projects/new" element={<OwnerProjectNewPage />} />
          <Route path="projects/:id" element={<OwnerProjectPage />} />
          <Route path="projects/:id/info" element={<OwnerProjectInfoPage />} />
          <Route path="projects/:id/report" element={<OwnerReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
