import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { CopyrightPage } from '@/pages/LegalPages/CopyrightPage'
import { PrivacyPage } from '@/pages/LegalPages/PrivacyPage'
import { HomePage } from '@/pages/HomePage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupAccountPage } from '@/pages/SignupAccountPage'
import { SignupAgreementPage } from '@/pages/SignupAgreementPage'
import { SignupOwnerProfilePage } from '@/pages/SignupOwnerProfilePage'
import { SignupRolePage } from '@/pages/SignupRolePage'
import { SignupTesterProfilePage } from '@/pages/SignupTesterProfilePage'

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
          <Route path="signup" element={<SignupRolePage />} />
          <Route path="signup/:role/account" element={<SignupAccountPage />} />
          <Route
            path="signup/owner/profile"
            element={<SignupOwnerProfilePage />}
          />
          <Route
            path="signup/tester/profile"
            element={<SignupTesterProfilePage />}
          />
          <Route
            path="signup/:role/agreement"
            element={<SignupAgreementPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
