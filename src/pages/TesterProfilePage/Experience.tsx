import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ApiError } from '@/api/client'
import { useSaveProfile } from '@/api/profile'
import type { TesterProfile } from '@/api/types'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { toSaveProfileBody } from './profileBody'

type FormValues = {
  hasExperience: 'yes' | 'no'
  jobs: TesterProfile['experiences']
}

export function Experience({ profile }: { profile: TesterProfile }) {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    shouldFocusError: false,
    defaultValues: {
      hasExperience: profile.has_qa_experience ? 'yes' : 'no',
      // One empty row is ready for when 有 QA 經驗 is picked
      jobs:
        profile.experiences.length > 0
          ? profile.experiences
          : [{ years: 'under_1', company: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'jobs' })

  const hasExperience = useWatch({ control, name: 'hasExperience' })

  const [saved, setSaved] = useState(false)
  const saveProfile = useSaveProfile()

  const save = handleSubmit(
    (values) => {
      setSaved(false)
      // Every save sends the nickname too, and the backend rejects an empty one
      if (profile.nickname === '') {
        setError('root', { message: '請先到基本資料填寫暱稱' })
        return
      }
      saveProfile.mutate(
        {
          ...toSaveProfileBody(profile),
          has_qa_experience: values.hasExperience === 'yes',
          // The rows stay on screen when 沒有經驗 is picked, but are not saved
          experiences: values.hasExperience === 'yes' ? values.jobs : [],
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
              const index = detail.field.match(
                /^experiences\[(\d+)\]\.company$/
              )?.[1]
              if (index !== undefined) {
                setError(`jobs.${Number(index)}.company`, {
                  message: detail.message,
                })
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
      <h2 className="text-section-title">經歷</h2>

      <fieldset className="flex max-w-220 flex-col gap-6">
        <legend className="mb-3 text-[18px] font-bold">有沒有做過測試？</legend>

        <div className="flex flex-wrap gap-3">
          <label
            className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${hasExperience === 'no' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
          >
            <input
              type="radio"
              value="no"
              {...register('hasExperience', {
                onChange: () => {
                  setSaved(false)
                  // RHF only re-checks the field that changed, so clear old jobs errors here
                  clearErrors('jobs')
                },
              })}
              className="accent-role size-5 cursor-pointer"
            />
            沒有經驗，想試試看
          </label>
          <label
            className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${hasExperience === 'yes' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
          >
            <input
              type="radio"
              value="yes"
              {...register('hasExperience', {
                onChange: () => {
                  setSaved(false)
                  clearErrors('jobs')
                },
              })}
              className="accent-role size-5 cursor-pointer"
            />
            有 QA 經驗
          </label>
        </div>

        {hasExperience === 'yes' && (
          <div className="flex flex-col gap-6">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <b className="text-[18px]">經歷 {index + 1}</b>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index)
                        setSaved(false)
                      }}
                      className="text-ink-muted hover:bg-platform-soft inline-flex size-11 flex-none items-center justify-center rounded-full transition-colors duration-150 ease-out"
                    >
                      <CloseIcon />
                      <span className="sr-only">移除經歷 {index + 1}</span>
                    </button>
                  )}
                </div>

                <div className="desktop:grid-cols-2 grid gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`years-${index}`} className="text-label">
                      年資
                    </label>
                    <select
                      id={`years-${index}`}
                      {...register(`jobs.${index}.years`, {
                        onChange: () => setSaved(false),
                      })}
                      className="border-line-input bg-surface min-h-12 w-full rounded-md border px-3"
                    >
                      <option value="under_1">未滿 1 年</option>
                      <option value="1_to_2">1–2 年</option>
                      <option value="3_to_5">3–5 年</option>
                      <option value="over_5">超過 5 年</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`company-${index}`} className="text-label">
                      任職公司
                      <span className="text-status-dispute-text text-required ml-1.5">
                        必填
                      </span>
                    </label>
                    <input
                      id={`company-${index}`}
                      type="text"
                      required
                      placeholder="例如：好買股份有限公司"
                      {...register(`jobs.${index}.company`, {
                        validate: (value, values) =>
                          values.hasExperience === 'no' ||
                          value.trim() !== '' ||
                          '請填寫任職公司',
                        onChange: () => setSaved(false),
                      })}
                      className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.jobs?.[index]?.company ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                    />
                    {errors.jobs?.[index]?.company && (
                      <span className="text-status-dispute-text inline-flex items-center gap-1.5">
                        <WarningIcon />
                        {errors.jobs[index].company.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                append({ years: 'under_1', company: '' })
                setSaved(false)
              }}
              className="btn btn-secondary self-start"
            >
              <PlusIcon />
              新增經歷
            </button>
          </div>
        )}
      </fieldset>

      <div className="border-line desktop:flex hidden items-center justify-end gap-3 border-t pt-6">
        <span className="text-ink-subtle">
          {saved && '已儲存'}
          {!saved && errors.root?.message}
          {!saved && !errors.root && errors.jobs && '還有必填欄位沒填'}
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

      <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 -mb-5 flex flex-col gap-2 rounded-b-md border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        {!saved && errors.root && (
          <span className="text-status-dispute-text">
            {errors.root.message}
          </span>
        )}
        {!saved && !errors.root && errors.jobs && (
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
    </section>
  )
}
