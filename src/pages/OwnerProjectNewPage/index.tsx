import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ApiError, request } from '@/api/client'
import { useTags } from '@/api/tags'
import type { CreateProjectBody } from '@/api/types'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import {
  projectBasicFields,
  type ProjectFormValues,
} from '@/pages/AuthPages/fields'
import { FormField } from '@/pages/AuthPages/FormField'
import { formFieldOf, toCreateProjectBody } from './createProjectBody'
import { MatchingConditions } from './MatchingConditions'
import { ProjectProgress } from './ProjectProgress'
import { ScheduleAndReward } from './ScheduleAndReward'
import { TestRequirements } from './TestRequirements'

export function OwnerProjectNewPage() {
  const navigate = useNavigate()

  const {
    register,
    control,
    setValue,
    setError,
    getFieldState,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: '',
      summary: '',
      devices: [],
      languages: [],
      nativeLanguages: [],
      interests: [],
      experience: 'any',
      years: 'under_1',
      mode: 'remote',
      city: '',
      startDate: '',
      endDate: '',
      reward: '',
      howToTest: '',
      successCriteria: '',
      specialRequirements: '',
    },
  })

  const [step, setStep] = useState<1 | 2 | 3>(1)

  const { data: deviceTags } = useTags('device')
  const { data: interestTags } = useTags('interest')

  // 發布 is on step 3, but the other steps are only hidden and are checked too.
  // Go back to the first step that has a problem, so its message can be seen.
  function showFirstStepWithError(fields: string[]) {
    const stepWithError = fields.some((field) =>
      [
        'name',
        'summary',
        'devices',
        'languages',
        'interests',
        'experience',
        'years',
        'mode',
        'city',
      ].includes(field)
    )
      ? 1
      : fields.some((field) =>
            ['startDate', 'endDate', 'reward'].includes(field)
          )
        ? 2
        : 3
    if (stepWithError !== 3) {
      setStep(stepWithError)
      window.scrollTo({ top: 0 })
    }
  }

  const publish = useMutation({
    mutationFn: (body: CreateProjectBody) =>
      request<{ id: string }>('/api/projects', { method: 'POST', body }),
    onSuccess: () => navigate('/owner'),
    onError: (error) => {
      if (!(error instanceof ApiError)) {
        setError('root', { message: '無法連線，請稍後再試' })
        return
      }
      if (error.code !== 'VALIDATION_FAILED') {
        setError('root', { message: error.message })
        return
      }
      const fields: Path<ProjectFormValues>[] = []
      error.details.forEach((detail) => {
        const field = formFieldOf(detail.field)
        if (!field) {
          setError('root', { message: detail.message })
        } else if (!getFieldState(field).error) {
          setError(field, { message: detail.message })
          fields.push(field)
        }
      })
      showFirstStepWithError(fields)
    },
  })

  const submit = handleSubmit(
    (values) => {
      if (!deviceTags || !interestTags) {
        setError('root', { message: '無法連線，請稍後再試' })
        return
      }
      publish.mutate(
        toCreateProjectBody(values, deviceTags.items, interestTags.items)
      )
    },
    (errors) => showFirstStepWithError(Object.keys(errors))
  )

  return (
    <div className="max-w-page tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col px-4 pt-6 pb-12">
      <div className="desktop:gap-6 mx-auto flex w-full max-w-200 flex-col gap-5">
        {step === 1 && (
          <Link
            to="/owner"
            className="desktop:inline-flex hidden min-h-11 items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
          >
            <ChevronDownIcon className="rotate-90" />
            上一頁
          </Link>
        )}
        {step !== 1 && (
          <button
            type="button"
            onClick={() => {
              setStep(step === 3 ? 2 : 1)
              window.scrollTo({ top: 0 })
            }}
            className="desktop:inline-flex hidden min-h-11 cursor-pointer items-center gap-1.5 self-start decoration-2 underline-offset-3 hover:underline"
          >
            <ChevronDownIcon className="rotate-90" />
            上一頁
          </button>
        )}

        <div className="flex min-h-12 items-center justify-between gap-4">
          <h1 className="text-subtitle">發布專案</h1>
        </div>

        <ProjectProgress step={step} />

        <div className={step === 1 ? 'contents' : 'hidden'}>
          <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
            <h2 className="text-subheading desktop:text-heading">基本資訊</h2>
            <FormField
              {...projectBasicFields.name}
              register={register}
              errors={errors}
            />

            <FormField
              {...projectBasicFields.summary}
              register={register}
              errors={errors}
            />
          </section>

          <MatchingConditions
            register={register}
            control={control}
            setValue={setValue}
          />
        </div>

        <div className={step === 2 ? 'contents' : 'hidden'}>
          <ScheduleAndReward register={register} errors={errors} />
        </div>

        <div className={step === 3 ? 'contents' : 'hidden'}>
          <TestRequirements register={register} errors={errors} />
        </div>

        {errors.root && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.root.message}
          </span>
        )}

        {step === 1 && (
          <div className="desktop:flex hidden justify-end">
            <button
              type="button"
              onClick={() => {
                setStep(2)
                window.scrollTo({ top: 0 })
              }}
              className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 min-w-40 cursor-pointer rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
            >
              下一步
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="desktop:flex hidden justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(3)
                window.scrollTo({ top: 0 })
              }}
              className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 min-w-40 cursor-pointer rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
            >
              下一步
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="desktop:flex hidden justify-end gap-3">
            <button
              type="button"
              disabled={publish.isPending}
              onClick={submit}
              className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 min-w-40 cursor-pointer rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
            >
              發布
            </button>
          </div>
        )}

        <div className="border-line bg-surface desktop:hidden tablet:-mx-6 sticky bottom-0 z-2 -mx-4 flex gap-3 border-t px-4 py-3">
          {step === 1 && (
            <Link
              to="/owner"
              className="border-ink text-ink inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full border-2 px-4 font-bold active:translate-y-px motion-reduce:active:translate-y-0"
            >
              <ChevronDownIcon className="rotate-90" />
              上一頁
            </Link>
          )}
          {step !== 1 && (
            <button
              type="button"
              onClick={() => {
                setStep(step === 3 ? 2 : 1)
                window.scrollTo({ top: 0 })
              }}
              className="border-ink text-ink inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 px-4 font-bold active:translate-y-px motion-reduce:active:translate-y-0"
            >
              <ChevronDownIcon className="rotate-90" />
              上一頁
            </button>
          )}
          <button
            type="button"
            disabled={step === 3 && publish.isPending}
            onClick={() => {
              if (step === 3) {
                submit()
              } else {
                setStep(step === 1 ? 2 : 3)
                window.scrollTo({ top: 0 })
              }
            }}
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 flex-1 cursor-pointer rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            {step === 3 ? '發布' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}
