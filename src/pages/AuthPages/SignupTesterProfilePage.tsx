import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { SignupProgress } from './SignupProgress'

type FormValues = {
  name: string
  phone: string
  city: string
}

export function SignupTesterProfilePage() {
  const navigate = useNavigate()
  // useForm keeps every field value and every error message.
  // Errors first appear when 下一步 is pressed; after that each field is re-checked while typing
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: '', phone: '', city: '' } })

  return (
    <form
      data-role="tester"
      onSubmit={
        // handleSubmit checks every field first and only runs this function when all of them pass
        handleSubmit(() => navigate('/signup/tester/agreement'))
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
            // Spaces alone do not count as filled in
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
      <div className="flex flex-col gap-2">
        <label htmlFor="city" className="text-label">
          居住地
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </label>
        <div className="relative">
          <select
            id="city"
            {...register('city', { required: '請選擇居住地' })}
            className={`bg-surface min-h-12 w-full appearance-none rounded-md py-2.5 pr-11 pl-3 ${errors.city ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          >
            <option value="">請選擇</option>
            <option>臺北市</option>
            <option>新北市</option>
            <option>桃園市</option>
            <option>臺中市</option>
            <option>臺南市</option>
            <option>高雄市</option>
            <option>基隆市</option>
            <option>新竹市</option>
            <option>嘉義市</option>
            <option>新竹縣</option>
            <option>苗栗縣</option>
            <option>彰化縣</option>
            <option>南投縣</option>
            <option>雲林縣</option>
            <option>嘉義縣</option>
            <option>屏東縣</option>
            <option>宜蘭縣</option>
            <option>花蓮縣</option>
            <option>臺東縣</option>
            <option>澎湖縣</option>
            <option>金門縣</option>
            <option>連江縣</option>
          </select>
          <span className="text-ink-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <ChevronDownIcon />
          </span>
        </div>
        {errors.city && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Link
          to="/signup/tester/account"
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
