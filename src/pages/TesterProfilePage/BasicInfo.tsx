import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { CheckIcon } from '@/components/icons/CheckIcon'
import { LockIcon } from '@/components/icons/LockIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { tester } from '@/data/tester'
import { cityOptions, languageOptions } from './data'

type FormValues = {
  name: string
  city: string
  phone: string
  phoneVerified: boolean
  code: string
  languages: string[]
  nativeLanguages: string[]
}

function isPhone(value: string) {
  return /^09\d{8}$/.test(value.replace(/[\s-]/g, ''))
}

export function BasicInfo() {
  // useForm keeps every field value and every error message.
  // Errors first appear when 儲存 is pressed; after that each field is re-checked while typing
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    // The library would jump to the first wrong field after 儲存; the design does not
    shouldFocusError: false,
    defaultValues: {
      name: tester.name,
      city: tester.city,
      phone: tester.phone,
      phoneVerified: tester.phoneVerified,
      code: '',
      languages: tester.languages,
      nativeLanguages: tester.nativeLanguages,
    },
  })

  // Steps of the screen, not values of the form
  const [codeSent, setCodeSent] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [saved, setSaved] = useState(false)

  // useWatch re-renders this component whenever one of these values changes
  const phone = useWatch({ control, name: 'phone' })
  const phoneVerified = useWatch({ control, name: 'phoneVerified' })
  const languages = useWatch({ control, name: 'languages' })
  const nativeLanguages = useWatch({ control, name: 'nativeLanguages' })

  // handleSubmit checks every field first, then runs the first function when all pass, the second when any fails
  const save = handleSubmit(
    () => setSaved(true),
    () => setSaved(false)
  )

  return (
    <section className="desktop:gap-6 desktop:p-8 flex flex-col gap-5 px-4 py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <h2 className="text-section-title">基本資料與語言</h2>

        {/* Desktop: save buttons sit beside the title. Mobile: the sticky bar at the bottom */}
        <div className="desktop:flex hidden items-center gap-3">
          <span className="text-ink-subtle">
            {saved && '已儲存'}
            {!saved && (errors.name || errors.phone) && '還有必填欄位沒填'}
          </span>
          <button
            type="button"
            className="border-role bg-surface hover:bg-role-soft min-h-12 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            取消
          </button>
          <button
            type="button"
            onClick={save}
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink min-h-12 rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
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
          <span className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="phone" className="text-label">
              手機號碼
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </label>
            {phoneVerified && (
              <span className="bg-tester-soft text-tester-text inline-flex items-center gap-1 rounded-[4px] px-2 font-bold">
                <CheckIcon />
                已驗證
              </span>
            )}
            {!phoneVerified && (
              <span className="bg-status-pending-bg text-status-pending-text rounded-[4px] px-2 font-bold">
                未驗證
              </span>
            )}
          </span>
          <div className="flex gap-2">
            {/* Editing the number always drops the verification and any code in progress */}
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              placeholder="0912-345-678"
              {...register('phone', {
                // Rules run from top to bottom; the first one that fails gives the message
                validate: {
                  format: (value) =>
                    isPhone(value) || '請輸入 09 開頭的 10 位數手機號碼',
                  verified: (_, values) =>
                    values.phoneVerified || '請完成簡訊驗證',
                },
                onChange: () => {
                  setValue('phoneVerified', false)
                  setCodeSent(false)
                  setValue('code', '')
                  setCodeError(false)
                  setSaved(false)
                  // Before the first 儲存 nothing is re-checked while typing,
                  // so an error raised by 傳送驗證碼 is refreshed by hand
                  if (errors.phone) trigger('phone')
                },
              })}
              className={`bg-surface min-h-12 w-full min-w-0 flex-1 rounded-md px-3 ${errors.phone ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
            />
            {!phoneVerified && (
              <button
                type="button"
                onClick={() => {
                  // getValues reads the current value without re-rendering
                  if (!isPhone(getValues('phone'))) {
                    // trigger('phone') checks this one field now, instead of waiting for 儲存
                    trigger('phone')
                    return
                  }
                  setCodeSent(true)
                  setValue('code', '')
                  setCodeError(false)
                }}
                className="border-role bg-surface hover:bg-role-soft min-h-12 flex-none rounded-full border-2 px-4 font-bold whitespace-nowrap transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
              >
                {codeSent ? '重新傳送' : '傳送驗證碼'}
              </button>
            )}
          </div>
          {errors.phone && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.phone.message}
            </span>
          )}
          {codeSent && !phoneVerified && (
            <div className="bg-role-soft flex flex-col gap-1.5 rounded-md p-3">
              <label htmlFor="sms-code" className="text-label">
                簡訊驗證碼
              </label>
              <div className="flex gap-2">
                {/* Digits only, 6 at most. No real SMS is sent: any 6 digits pass */}
                <input
                  id="sms-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6 位數"
                  {...register('code', {
                    onChange: (e) => {
                      // setValue writes the cleaned text back into the input
                      setValue(
                        'code',
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                      setCodeError(false)
                    },
                  })}
                  className="border-line-input bg-surface font-num min-h-12 w-full min-w-0 flex-1 rounded-md border px-3 text-[20px] tracking-[4px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (getValues('code').length === 6) {
                      setValue('phoneVerified', true)
                      setCodeSent(false)
                      // Remove 請完成簡訊驗證 if it is showing
                      clearErrors('phone')
                    } else {
                      setCodeError(true)
                    }
                  }}
                  className="border-role bg-role text-on-role hover:bg-surface hover:text-ink min-h-12 flex-none rounded-full border-2 px-5 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
                >
                  驗證
                </button>
              </div>
              {codeError && (
                <span className="text-status-dispute-text">
                  請輸入簡訊裡的 6 位數驗證碼。
                </span>
              )}
              {!codeError && (
                <span className="text-tester-text">
                  驗證碼已傳到 {phone}，10 分鐘內有效。
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-ink-muted">
        Email 和手機號碼只會在雙方確認合作後，才提供給專案負責人。
      </p>

      <div className="border-line flex flex-col gap-6 border-t pt-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-subheading">語言</h3>
          <p className="text-ink-subtle">
            勾選你會的語言，勾選後可以再標示是不是母語。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((language) => (
            <div
              key={language}
              className={`inline-flex min-h-11 items-stretch rounded-md border ${languages.includes(language) ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
            >
              <label
                className={`inline-flex cursor-pointer items-center gap-2 pr-3.5 pl-3 ${languages.includes(language) ? 'text-tester-text font-bold' : ''}`}
              >
                {/* Unchecking a language also clears its 母語 */}
                <input
                  type="checkbox"
                  checked={languages.includes(language)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue('languages', [...languages, language])
                    } else {
                      setValue(
                        'languages',
                        languages.filter((l) => l !== language)
                      )
                      setValue(
                        'nativeLanguages',
                        nativeLanguages.filter((l) => l !== language)
                      )
                    }
                    setSaved(false)
                  }}
                  className="accent-role size-4.5 cursor-pointer"
                />
                {language}
              </label>
              {languages.includes(language) && (
                <label
                  className={`inline-flex cursor-pointer items-center gap-1.5 border-l border-[#c9e6b4] px-3 ${nativeLanguages.includes(language) ? 'text-tester-text font-bold' : 'text-[#6b6a65]'}`}
                >
                  <input
                    type="checkbox"
                    checked={nativeLanguages.includes(language)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue('nativeLanguages', [
                          ...nativeLanguages,
                          language,
                        ])
                      } else {
                        setValue(
                          'nativeLanguages',
                          nativeLanguages.filter((l) => l !== language)
                        )
                      }
                      setSaved(false)
                    }}
                    className="accent-role size-4.5 cursor-pointer"
                  />
                  母語
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile save bar: sticks to the bottom of the scroll area while this card is on screen.
          The negative margins cancel the section padding so it spans the card */}
      <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 -mb-5 flex flex-col gap-2 rounded-b-md border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        {!saved && (errors.name || errors.phone) && (
          <span className="text-status-dispute-text">還有必填欄位沒填</span>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            className="border-role bg-surface hover:bg-role-soft min-h-12 flex-1 rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            取消
          </button>
          <button
            type="button"
            onClick={save}
            className="border-role bg-role text-on-role hover:bg-surface hover:text-ink min-h-12 flex-1 rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            儲存
          </button>
        </div>
      </div>
    </section>
  )
}
