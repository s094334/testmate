import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { accountFields, type AccountFormValues } from './fields'
import { FormField } from './FormField'
import { SignupProgress } from './SignupProgress'

type SignupAccountPageProps = {
  role: 'owner' | 'tester'
  defaultValues: AccountFormValues
  onNext: (values: AccountFormValues) => void
  onBack: (values: AccountFormValues) => void
}

export function SignupAccountPage({
  role,
  defaultValues,
  onNext,
  onBack,
}: SignupAccountPageProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AccountFormValues>({ defaultValues })

  return (
    <form
      noValidate
      data-role={role}
      onSubmit={handleSubmit((values) => onNext(values))}
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
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onBack(getValues())}
          className="border-ink text-ink inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 cursor-pointer"
        >
          上一步
        </button>
        <button
          type="submit"
          className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 flex-1 rounded-full border-2 px-6 font-bold transition duration-150 ease-out enabled:hover:-translate-y-px enabled:active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0"
        >
          下一步
        </button>
      </div>
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
