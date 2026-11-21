import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LockIcon } from '@/components/icons/LockIcon'
import { owner } from '@/data/owner'
import {
  ownerCompanyFields,
  ownerProfileFields,
  type OwnerProfileFormValues,
} from '@/pages/AuthPages/fields'
import { FormField } from '@/pages/AuthPages/FormField'

export function OwnerCompanyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerProfileFormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: owner.realName,
      phone: owner.phone,
      company: owner.name,
      taxId: owner.taxId ?? '',
      industry: owner.industryTag.name,
      address: owner.address,
    },
  })

  const [saved, setSaved] = useState(false)

  const save = handleSubmit(
    () => setSaved(true),
    () => setSaved(false)
  )

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col px-4 pt-6 pb-12">
      <form
        onSubmit={save}
        onChange={() => setSaved(false)}
        className="desktop:gap-6 mx-auto flex w-full max-w-200 flex-col gap-5"
      >
        <h1 className="text-subtitle">公司資料</h1>

        <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-5 rounded-md border px-4 py-5">
          <h2 className="text-subheading desktop:text-heading">帳號</h2>
          <div className="desktop:grid-cols-2 grid gap-x-4 gap-y-5">
            <FormField
              {...ownerProfileFields[0]}
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                readOnly
                value={owner.email}
                className="border-line bg-platform-soft text-ink-muted min-h-12 w-full rounded-md border px-3"
              />
              <span className="text-ink-subtle inline-flex items-center gap-1.5">
                <LockIcon />
                這是你的登入帳號，無法修改
              </span>
            </div>

            <FormField
              {...ownerProfileFields[1]}
              register={register}
              errors={errors}
            />
          </div>
        </section>

        <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-5 rounded-md border px-4 py-5">
          <h2 className="text-subheading desktop:text-heading">公司資料</h2>
          <div className="desktop:grid-cols-2 grid gap-x-4 gap-y-5">
            <FormField
              {...ownerCompanyFields[0]}
              register={register}
              errors={errors}
            />

            <FormField
              {...ownerCompanyFields[1]}
              register={register}
              errors={errors}
            />

            <div className="desktop:col-span-2">
              <FormField
                {...ownerCompanyFields[2]}
                register={register}
                errors={errors}
              />
            </div>

            <div className="desktop:col-span-2">
              <FormField
                {...ownerCompanyFields[3]}
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </section>

        <div className="desktop:flex hidden items-center justify-end gap-3">
          <span className="text-ink-subtle">
            {saved && '已儲存'}
            {!saved &&
              (errors.name ||
                errors.phone ||
                errors.company ||
                errors.taxId ||
                errors.industry ||
                errors.address) &&
              '還有必填欄位沒填'}
          </span>
          <button type="submit" className="btn btn-secondary px-8">
            儲存
          </button>
        </div>

        <div className="border-line bg-surface desktop:hidden tablet:-mx-6 sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3">
          {saved && <span className="text-owner-text">已儲存</span>}
          {!saved &&
            (errors.name ||
              errors.phone ||
              errors.company ||
              errors.taxId ||
              errors.industry ||
              errors.address) && (
              <span className="text-status-dispute-text">還有必填欄位沒填</span>
            )}
          <button type="submit" className="btn btn-secondary px-4">
            儲存
          </button>
        </div>
      </form>
    </div>
  )
}
