import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '@/api/client'
import { useSaveProfile } from '@/api/profile'
import type { TesterProfile } from '@/api/types'
import { LockIcon } from '@/components/icons/LockIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { isPhone, phoneFormatMessage } from '../../../shared/phone'
import { cityOptions } from '@/data/options'
import { Languages } from './Languages'
import { PayoutAccount } from './PayoutAccount'
import { formFieldOf, toSaveProfileBody } from './profileBody'

export type FormValues = {
  name: string
  nickname: string
  city: string
  phone: string
  languages: string[]
  nativeLanguages: string[]
}

export function BasicInfo({ profile }: { profile: TesterProfile }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: profile.real_name,
      nickname: profile.nickname,
      city: profile.city,
      phone: profile.phone,
      languages: profile.languages.map((language) => language.name),
      nativeLanguages: profile.languages
        .filter((language) => language.native)
        .map((language) => language.name),
    },
  })

  const [saved, setSaved] = useState(false)
  const saveProfile = useSaveProfile()

  const save = handleSubmit(
    (values) => {
      setSaved(false)
      saveProfile.mutate(
        {
          ...toSaveProfileBody(profile),
          real_name: values.name,
          nickname: values.nickname,
          city: values.city,
          phone: values.phone,
          languages: values.languages.map((language) => ({
            name: language,
            native: values.nativeLanguages.includes(language),
          })),
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
            // Languages, and other tabs' parts sent as last saved, have no
            // field here to show their message under
            error.details.forEach((detail) => {
              const field = formFieldOf(detail.field)
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
    <section className="desktop:gap-6 desktop:p-8 flex flex-col gap-5 px-4 py-5">
      <h2 className="text-section-title">基本資料與語言</h2>

      <div className="desktop:grid-cols-2 grid max-w-220 gap-x-6 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-label">
            真實姓名
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
              validate: (value) => value.trim() !== '' || '請填寫真實姓名',
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
          <label htmlFor="nickname" className="text-label">
            暱稱
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </label>
          <input
            id="nickname"
            type="text"
            autoComplete="nickname"
            required
            maxLength={12}
            {...register('nickname', {
              validate: (value) => value.trim() !== '' || '請填寫暱稱',
              onChange: () => setSaved(false),
            })}
            className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.nickname ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          />
          {errors.nickname && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.nickname.message}
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
            value={profile.email}
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
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="0912-345-678"
            {...register('phone', {
              validate: (value) => isPhone(value) || phoneFormatMessage,
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

      <div className="desktop:flex hidden items-center justify-end gap-3">
        <span className="text-ink-subtle">
          {saved && '已儲存'}
          {!saved && errors.root?.message}
          {!saved &&
            !errors.root &&
            (errors.name || errors.nickname || errors.phone) &&
            '還有必填欄位沒填'}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={saveProfile.isPending}
          className="btn btn-secondary px-8"
        >
          儲存
        </button>
      </div>

      {/* Mobile save bar: sticks to the bottom of the screen until you scroll down to it.
          It sits just before 收款帳戶, so from there on it scrolls away and
          收款帳戶's own bar (儲存帳戶) takes over. -mx-4 cancels the section padding so it spans the card */}
      <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 flex flex-col gap-2 border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        {!saved && errors.root && (
          <span className="text-status-dispute-text">
            {errors.root.message}
          </span>
        )}
        {!saved &&
          !errors.root &&
          (errors.name || errors.nickname || errors.phone) && (
            <span className="text-status-dispute-text">還有必填欄位沒填</span>
          )}
        <button
          type="button"
          onClick={save}
          disabled={saveProfile.isPending}
          className="btn btn-secondary px-4"
        >
          儲存
        </button>
      </div>

      <PayoutAccount />
    </section>
  )
}
