import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { request } from '@/api/client'
import type { Tag } from '@/api/types'
import {
  ownerCompanyFields,
  ownerProfileFields,
  type OwnerProfileFormValues,
} from './fields'
import { FormField } from './FormField'
import { SignupProgress } from './SignupProgress'

type SignupOwnerProfilePageProps = {
  defaultValues: OwnerProfileFormValues
  onNext: (values: OwnerProfileFormValues) => void
  onBack: (values: OwnerProfileFormValues) => void
}

export function SignupOwnerProfilePage({
  defaultValues,
  onNext,
  onBack,
}: SignupOwnerProfilePageProps) {
  // This step is removed from the page when you leave it, so its form starts over
  // each time it is shown. defaultValues (saved in SignupPage) fills the fields back in
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<OwnerProfileFormValues>({ defaultValues })

  // Signup sends the industry's tag id, which only the backend knows.
  // Coming back to this step shows the saved list at once, without waiting.
  const { data: industryTags } = useQuery({
    queryKey: ['tags', 'industry'],
    queryFn: () => request<{ items: Tag[] }>('/api/tags?category=industry'),
  })

  return (
    <form
      data-role="owner"
      onSubmit={handleSubmit((values) => onNext(values))}
      className="bg-surface border-ink tablet:p-12 mx-auto flex max-w-130 flex-col gap-5 rounded-md border px-5 py-6"
    >
      <h1 className="text-subtitle">註冊</h1>
      <div className="flex flex-col gap-3">
        <b className="text-subheading">填寫基本資料</b>
        <SignupProgress step={3} />
      </div>
      <div className="bg-role-soft rounded-md px-4 py-3">
        註冊身分：<b>專案負責人</b>
      </div>
      {ownerProfileFields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          register={register}
          errors={errors}
        />
      ))}
      <h2 className="border-line text-subheading border-t pt-5">公司資料</h2>
      {ownerCompanyFields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          // 公司產業 shows the tag names but saves the tag id
          options={
            field.name === 'industry'
              ? industryTags?.items.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))
              : field.options
          }
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
          className="btn btn-secondary btn-ink flex-1"
        >
          上一步
        </button>
        <button type="submit" className="btn btn-primary btn-ink flex-1">
          下一步
        </button>
      </div>
    </form>
  )
}
