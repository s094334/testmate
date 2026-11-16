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
          className="inline-flex min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="flex min-h-12 items-center justify-between gap-4">
          <h1 className="text-subtitle">發布專案</h1>
        </div>

        <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-5 rounded-md border px-4 py-5">
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
      </div>
    </div>
  )
}
