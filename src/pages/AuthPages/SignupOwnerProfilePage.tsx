import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { SignupProgress } from './SignupProgress'

type FormValues = {
  name: string
  phone: string
  company: string
  taxId: string
  industry: string
  address: string
}

export function SignupOwnerProfilePage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      company: '',
      taxId: '',
      industry: '',
      address: '',
    },
  })

  return (
    <form
      data-role="owner"
      onSubmit={handleSubmit(() => navigate('/signup/owner/agreement'))}
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
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-label">
          姓名
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="例：哇哩勒"
          {...register('name', {
            validate: (value) => value.trim() !== '' || '請填寫姓名',
          })}
          className={`bg-surface min-h-12 rounded-md px-3 py-2.5 ${errors.name ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.name && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-label">
          手機號碼
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="例：0912-345-678"
          {...register('phone', {
            validate: (value) => value.trim() !== '' || '請填寫手機號碼',
          })}
          className={`bg-surface min-h-12 rounded-md px-3 py-2.5 ${errors.phone ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.phone && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.phone.message}
          </span>
        )}
      </div>
      <h2 className="border-line text-subheading border-t pt-5">公司資料</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="company" className="text-label">
          公司名稱
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          placeholder="例：哇哩勒股份有限公司"
          {...register('company', {
            validate: (value) => value.trim() !== '' || '請填寫公司名稱',
          })}
          className={`bg-surface min-h-12 rounded-md px-3 py-2.5 ${errors.company ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.company && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.company.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="tax-id" className="text-label">
          統一編號
        </label>
        <input
          id="tax-id"
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="8 位數字"
          {...register('taxId')}
          className="border-line-input bg-surface min-h-12 rounded-md border px-3 py-2.5"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="industry" className="text-label">
          公司產業
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <div className="relative">
          <select
            id="industry"
            defaultValue=""
            {...register('industry', { required: '請選擇公司產業' })}
            className={`bg-surface min-h-12 w-full appearance-none rounded-md py-2.5 pr-11 pl-3 ${errors.industry ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          >
            <option value="" disabled>
              請選擇產業
            </option>
            <option>金融保險</option>
            <option>半導體與電子</option>
            <option>電商零售</option>
            <option>遊戲</option>
            <option>影音娛樂</option>
            <option>旅遊住宿</option>
            <option>餐飲外送</option>
            <option>生活服務</option>
            <option>教育</option>
            <option>醫療健康</option>
            <option>交通運輸</option>
            <option>政府與公共服務</option>
            <option>軟體與 SaaS</option>
            <option>其他</option>
          </select>
          <span className="text-ink-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <ChevronDownIcon />
          </span>
        </div>
        {errors.industry && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.industry.message}
          </span>
        )}
        <span className="text-ink-subtle">
          發布專案時會自動帶入，可再依專案修改
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-label">
          公司地址
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <input
          id="address"
          type="text"
          autoComplete="street-address"
          placeholder="例：臺北市信義區市府路 1 號"
          {...register('address', {
            validate: (value) => value.trim() !== '' || '請填寫公司地址',
          })}
          className={`bg-surface min-h-12 rounded-md px-3 py-2.5 ${errors.address ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.address && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Link
          to="/signup/owner/account"
          className="border-role bg-surface hover:bg-role-soft inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          上一步
        </Link>
        <button
          type="submit"
          className="border-ink bg-ink text-surface hover:bg-surface hover:text-ink min-h-12 flex-1 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          下一步
        </button>
      </div>
    </form>
  )
}
