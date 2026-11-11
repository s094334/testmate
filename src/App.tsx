import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { HomePage } from '@/pages/HomePage'
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
