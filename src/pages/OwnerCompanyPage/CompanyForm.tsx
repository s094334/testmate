import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/api/client'
import { useSaveCompany } from '@/api/company'
import type { Company, Tag } from '@/api/types'
import { LockIcon } from '@/components/icons/LockIcon'
import {
  ownerCompanyFields,
  ownerProfileFields,
  type OwnerProfileFormValues,
} from '@/pages/AuthPages/fields'
import { FormField } from '@/pages/AuthPages/FormField'

export function CompanyForm({
  company,
  industryTags,
}: {
  company: Company
  industryTags: Tag[]
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OwnerProfileFormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: company.real_name,
      phone: company.phone,
      company: company.name,
      taxId: company.tax_id ?? '',
      industry: company.industry_tag.id,
      address: company.address,
    },
  })

  const [saved, setSaved] = useState(false)
  const saveCompany = useSaveCompany()

  const save = handleSubmit(
    (values) => {
      setSaved(false)
      saveCompany.mutate(
        {
          real_name: values.name,
          phone: values.phone,
          name: values.company,
          tax_id: values.taxId || null,
          industry_tag_id: values.industry,
          address: values.address,
        },
        {
          onSuccess: () => setSaved(true),
          onError: (error) => {
            if (!(error instanceof ApiError)) {
              setError('root', { message: '無法連線，請稍後再試' })
              return
            }
            if (error.code !== 'VALIDATION_FAILED') {
              setError('root', { message: error.message })
              return
            }
            error.details.forEach((detail) => {
              const field = (
                {
                  real_name: 'name',
                  phone: 'phone',
                  name: 'company',
                  tax_id: 'taxId',
                  industry_tag_id: 'industry',
                  address: 'address',
                } as Record<string, keyof OwnerProfileFormValues | undefined>
              )[detail.field]
              if (field) {
                setError(field, { message: detail.message })
              } else {
                setError('root', { message: detail.message })
              }
            })
          },
        }
      )
    },
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
                value={company.email}
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
                // Shows the tag names but saves the tag id, like signup
                options={industryTags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
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
            {!saved && errors.root?.message}
            {!saved &&
              !errors.root &&
              (errors.name ||
                errors.phone ||
                errors.company ||
                errors.taxId ||
                errors.industry ||
                errors.address) &&
              '還有必填欄位沒填'}
          </span>
          <button
            type="submit"
            disabled={saveCompany.isPending}
            className="btn btn-secondary px-8"
          >
            儲存
          </button>
        </div>

        <div className="border-line bg-surface desktop:hidden tablet:-mx-6 sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3">
          {saved && <span className="text-owner-text">已儲存</span>}
          {!saved && errors.root && (
            <span className="text-status-dispute-text">
              {errors.root.message}
            </span>
          )}
          {!saved &&
            !errors.root &&
            (errors.name ||
              errors.phone ||
              errors.company ||
              errors.taxId ||
              errors.industry ||
              errors.address) && (
              <span className="text-status-dispute-text">還有必填欄位沒填</span>
            )}
          <button
            type="submit"
            disabled={saveCompany.isPending}
            className="btn btn-secondary px-4"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  )
}
