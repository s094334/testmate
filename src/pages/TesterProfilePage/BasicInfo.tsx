import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LockIcon } from '@/components/icons/LockIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { tester } from '@/data/tester'
import { cityOptions } from './data'
import { Languages } from './Languages'
import { PayoutAccount } from './PayoutAccount'

export type FormValues = {
  name: string
  city: string
  phone: string
  languages: string[]
  nativeLanguages: string[]
}

function isPhone(value: string) {
  return /^09\d{8}$/.test(value.replace(/[\s-]/g, ''))
}

export function BasicInfo() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: tester.name,
      city: tester.city,
      phone: tester.phone,
      languages: tester.languages,
      nativeLanguages: tester.nativeLanguages,
    },
  })

  const [saved, setSaved] = useState(false)

  const save = handleSubmit(
    () => setSaved(true),
    () => setSaved(false)
  )

  return (
    <section className="desktop:gap-6 desktop:p-8 flex flex-col gap-5 px-4 py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <h2 className="text-section-title">基本資料與語言</h2>

        <div className="desktop:flex hidden items-center gap-3">
          <span className="text-ink-subtle">
            {saved && '已儲存'}
            {!saved && (errors.name || errors.phone) && '還有必填欄位沒填'}
          </span>
          <button
            type="button"
            onClick={save}
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            儲存
          </button>
        </div>
      </div>

      <div className="desktop:grid-cols-2 grid max-w-220 gap-x-6 gap-y-5">
        <div className="flex flex-col gap-1.5">
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
            required
            {...register('name', {
              validate: (value) => value.trim() !== '' || '請填寫姓名',
              onChange: () => setSaved(false),
            })}
            className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.name ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          />
          {errors.name && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            readOnly
            value={tester.email}
            className="border-line bg-platform-soft text-ink-muted min-h-12 w-full rounded-md border px-3"
          />
          <span className="text-ink-subtle inline-flex items-center gap-1.5">
            <LockIcon />
            這是你的登入帳號，無法修改
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-label">
            居住地
          </label>
          <select
            id="city"
            {...register('city', { onChange: () => setSaved(false) })}
            className="border-line-input bg-surface min-h-12 w-full rounded-md border px-3"
          >
            {cityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-label">
            手機號碼
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            placeholder="0912-345-678"
            {...register('phone', {
              validate: (value) =>
                isPhone(value) || '請輸入 09 開頭的 10 位數手機號碼',
              onChange: () => setSaved(false),
            })}
            className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.phone ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          />
          {errors.phone && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>

      <p className="text-ink-muted">
        Email 和手機號碼只會在雙方確認合作後，才提供給專案負責人。
      </p>

      <Languages
        control={control}
        setValue={setValue}
        onChange={() => setSaved(false)}
      />

      {/* Mobile save bar: sticks to the bottom of the screen until you scroll down to it.
          It sits just before 收款帳戶, so from there on it scrolls away and
          收款帳戶's own bar (儲存帳戶) takes over. -mx-4 cancels the section padding so it spans the card */}
      <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        {!saved && (errors.name || errors.phone) && (
          <span className="text-status-dispute-text">還有必填欄位沒填</span>
        )}
        <button
          type="button"
          onClick={save}
          className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
        >
          儲存
        </button>
      </div>

      <PayoutAccount />
    </section>
  )
}
