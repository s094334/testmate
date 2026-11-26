import { useCompany } from '@/api/company'
import { useTags } from '@/api/tags'
import { CompanyForm } from './CompanyForm'

export function OwnerCompanyPage() {
  const company = useCompany()
  // The form fills in 公司產業 only once, so its options have to be there first
  const industryTags = useTags('industry')

  if (!company.data || !industryTags.data) {
    return (
      <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col px-4 pt-6 pb-12">
        <div className="bg-surface border-ink mx-auto w-full max-w-200 rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {company.isError || industryTags.isError
              ? '公司資料載入失敗，請重新整理再試一次。'
              : '載入中…'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <CompanyForm
      company={company.data}
      industryTags={industryTags.data.items}
    />
  )
}
