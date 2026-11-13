// The whole signup flow lives at ONE address, /signup.
// This component remembers which step is showing and everything typed so far,
// and shows one step at a time.
import { useState } from 'react'
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
        setStep(3)
      }}
    />
  )
}
