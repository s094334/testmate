// The whole signup flow lives at ONE address, /signup.
// This component remembers which step is showing and everything typed so far,
// and shows one step at a time.
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ApiError, request } from '@/api/client'
import type { RegisterBody, User } from '@/api/types'
import { toast } from '@/components/ui/toast'
import type {
  AccountFormValues,
  OwnerProfileFormValues,
  TesterProfileFormValues,
} from './fields'
import { SignupAccountPage } from './SignupAccountPage'
import { SignupAgreementPage } from './SignupAgreementPage'
import { SignupOwnerProfilePage } from './SignupOwnerProfilePage'
import { SignupRolePage } from './SignupRolePage'
import { SignupTesterProfilePage } from './SignupTesterProfilePage'

export function SignupPage() {
  const navigate = useNavigate()

  // Signing up does not log in: the new account logs in on /login
  const signup = useMutation({
    mutationFn: (body: RegisterBody) =>
      request<User>('/api/auth/register', { method: 'POST', body }),
    onSuccess: () => {
      toast.add({ title: '註冊成功，請登入', timeout: 4000 })
      navigate('/login')
    },
  })

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [role, setRole] = useState<'owner' | 'tester' | null>(null)

  // A step disappears from the page when you leave it, and its own form is thrown away.
  // What was typed is kept here instead, and handed back when the step is shown again.
  const [account, setAccount] = useState<AccountFormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  // The two profile forms are kept apart, so changing role never mixes their answers
  const [testerProfile, setTesterProfile] = useState<TesterProfileFormValues>({
    name: '',
    nickname: '',
    phone: '',
    city: '',
  })
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfileFormValues>({
    name: '',
    phone: '',
    company: '',
    taxId: '',
    industry: '',
    address: '',
  })
  // Step 4: ticked inside the full terms dialog
  const [agreed, setAgreed] = useState(false)

  if (step === 1 || role === null) {
    return (
      <SignupRolePage
        defaultRole={role}
        onNext={(pickedRole) => {
          setRole(pickedRole)
          setStep(2)
        }}
      />
    )
  }

  if (step === 2) {
    return (
      <SignupAccountPage
        role={role}
        defaultValues={account}
        onNext={(values) => {
          setAccount(values)
          setStep(3)
        }}
        onBack={(values) => {
          setAccount(values)
          setStep(1)
        }}
      />
    )
  }

  if (step === 3 && role === 'tester') {
    return (
      <SignupTesterProfilePage
        defaultValues={testerProfile}
        onNext={(values) => {
          setTesterProfile(values)
          setStep(4)
        }}
        onBack={(values) => {
          setTesterProfile(values)
          setStep(2)
        }}
      />
    )
  }

  if (step === 3) {
    return (
      <SignupOwnerProfilePage
        defaultValues={ownerProfile}
        onNext={(values) => {
          setOwnerProfile(values)
          setStep(4)
        }}
        onBack={(values) => {
          setOwnerProfile(values)
          setStep(2)
        }}
      />
    )
  }

  return (
    <SignupAgreementPage
      role={role}
      defaultAgreed={agreed}
      onBack={(checked) => {
        setAgreed(checked)
        // Coming back later starts without the old error message
        signup.reset()
        setStep(3)
      }}
      submitting={signup.isPending}
      errorMessage={
        signup.error
          ? signup.error instanceof ApiError
            ? signup.error.message
            : // fetch itself failed: offline, or the server cannot be reached
              '無法連線，請稍後再試'
          : undefined
      }
      // The form's field names differ from the API's, so each one is matched here.
      // confirmPassword is left out: it only exists to catch typos in the form.
      onSubmit={() =>
        signup.mutate(
          role === 'tester'
            ? {
                role,
                email: account.email,
                password: account.password,
                agreed: true,
                profile: {
                  real_name: testerProfile.name,
                  nickname: testerProfile.nickname,
                  phone: testerProfile.phone,
                  city: testerProfile.city,
                },
              }
            : {
                role,
                email: account.email,
                password: account.password,
                agreed: true,
                profile: {
                  real_name: ownerProfile.name,
                  phone: ownerProfile.phone,
                  name: ownerProfile.company,
                  tax_id: ownerProfile.taxId || null,
                  // The select saves the tag id, see SignupOwnerProfilePage
                  industry_tag_id: ownerProfile.industry,
                  address: ownerProfile.address,
                },
              }
        )
      }
    />
  )
}
