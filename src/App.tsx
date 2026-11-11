import { BrowserRouter, Route, Routes } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { SignupAccountPage } from '@/pages/SignupAccountPage'
import { SignupRolePage } from '@/pages/SignupRolePage'
import { SignupTesterProfilePage } from '@/pages/SignupTesterProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element="測試人員媒合平台" />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupRolePage />} />
          <Route path="signup/:role/account" element={<SignupAccountPage />} />
          <Route
            path="signup/tester/profile"
            element={<SignupTesterProfilePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
