import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { accountFields, type AccountFormValues } from './fields'
import { FormField } from './FormField'
import { SignupProgress } from './SignupProgress'

export function SignupAccountPage() {
  const { role } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  if (role !== 'owner' && role !== 'tester') {
    return <Navigate to="/signup" replace />
  }

  return (
    <form
      noValidate
      data-role={role}
      onSubmit={handleSubmit(() => navigate(`/signup/${role}/profile`))}
      className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-130 flex-col gap-5 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">建立帳號</b>
        <SignupProgress step={2} />
      </div>
      <div className="bg-role-soft flex items-center justify-between gap-3 rounded-md px-4 py-3">
        <span>
          註冊身分：<b>{role === 'owner' ? '專案負責人' : '測試人員'}</b>
        </span>
      </div>
      {accountFields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          register={register}
          errors={errors}
        />
      ))}
      <button
        type="submit"
        className="border-ink bg-ink text-surface hover:bg-surface hover:text-ink min-h-12 w-full rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
      >
        下一步
      </button>
      <p className="text-ink-muted text-center">
        已經有帳號？
        <Link
          to="/login"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          登入
        </Link>
      </p>
    </form>
  )
}
