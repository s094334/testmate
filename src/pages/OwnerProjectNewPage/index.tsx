import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import {
  projectBasicFields,
  type ProjectBasicFormValues,
} from '@/pages/AuthPages/fields'
import { FormField } from '@/pages/AuthPages/FormField'
import { MatchingConditions } from './MatchingConditions'

export function OwnerProjectNewPage() {
  const {
    register,
    formState: { errors },
  } = useForm<ProjectBasicFormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: '',
      summary: '',
    },
  })

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col px-4 pt-6 pb-12">
      <div className="desktop:gap-6 mx-auto flex w-full max-w-200 flex-col gap-5">
        <Link
          to="/owner"
          className="desktop:inline-flex hidden min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="flex min-h-12 items-center justify-between gap-4">
          <h1 className="text-subtitle">發布專案</h1>
        </div>

        <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
          <h2 className="text-subheading desktop:text-heading">基本資訊</h2>
          {projectBasicFields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              register={register}
              errors={errors}
            />
          ))}
        </section>

        <MatchingConditions />

        <div className="desktop:flex hidden justify-end">
          <button
            type="button"
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 min-w-40 cursor-pointer rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            下一步
          </button>
        </div>

        <div className="border-line bg-surface desktop:hidden tablet:-mx-6 sticky bottom-0 -mx-4 flex gap-3 border-t px-4 py-3">
          <Link
            to="/owner"
            className="border-ink text-ink inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-4 font-bold active:translate-y-px motion-reduce:active:translate-y-0"
          >
            <ChevronDownIcon className="rotate-90" />
            上一頁
          </Link>
          <button
            type="button"
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 flex-1 cursor-pointer rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  )
}
