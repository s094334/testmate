import { useForm } from 'react-hook-form'
import { testerProfileFields, type TesterProfileFormValues } from './fields'
import { FormField } from './FormField'
import { SignupProgress } from './SignupProgress'

type SignupTesterProfilePageProps = {
  defaultValues: TesterProfileFormValues
  onNext: (values: TesterProfileFormValues) => void
  onBack: (values: TesterProfileFormValues) => void
}

export function SignupTesterProfilePage({
  defaultValues,
  onNext,
  onBack,
}: SignupTesterProfilePageProps) {
  // useForm keeps every field value and every error message.
  // Errors first appear when 下一步 is pressed; after that each field is re-checked while typing
  // This step is removed from the page when you leave it, so its form starts over
  // each time it is shown. defaultValues (saved in SignupPage) fills the fields back in
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TesterProfileFormValues>({ defaultValues })

  return (
    <form
      data-role="tester"
      onSubmit={
        // handleSubmit checks every field first and only runs this function when all of them pass
        handleSubmit((values) => onNext(values))
      }
      className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-130 flex-col gap-5 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">填寫基本資料</b>
        <SignupProgress step={3} />
      </div>
      <div className="bg-role-soft rounded-md px-4 py-3">
        註冊身分：<b>測試人員</b>
      </div>
      {testerProfileFields.map((field) => (
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
          onClick={
            // getValues() reads what is typed right now without checking it,
            // so half-filled fields are saved too
            () => onBack(getValues())
          }
          className="border-ink text-ink inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition duration-150 ease-out hover:-translate-y-px active:translate-y-px motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0 cursor-pointer"
        >
          上一步
        </button>
        <button
          type="submit"
          className="border-ink bg-ink text-surface disabled:border-disabled-bg disabled:bg-disabled-bg disabled:text-disabled-fg min-h-12 flex-1 rounded-full border-2 px-6 font-bold transition duration-150 ease-out enabled:cursor-pointer enabled:hover:-translate-y-px enabled:active:translate-y-px motion-reduce:enabled:hover:translate-y-0 motion-reduce:enabled:active:translate-y-0"
        >
          下一步
        </button>
      </div>
    </form>
  )
}
