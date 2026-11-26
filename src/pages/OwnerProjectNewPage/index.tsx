import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { ApiError, request } from '@/api/client'
import { useTags } from '@/api/tags'
import type { CreateProjectBody } from '@/api/types'
import { BottomBar } from '@/components/BottomBar'
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

const stepFields: Record<1 | 2, Path<ProjectFormValues>[]> = {
  1: [
    'name',
    'summary',
    'devices',
    'languages',
    'interests',
    'experience',
    'years',
    'mode',
    'city',
  ],
  2: ['startDate', 'endDate', 'reward'],
}

export function OwnerProjectNewPage() {
  const navigate = useNavigate()

  const {
    register,
    control,
    setValue,
    setError,
    getFieldState,
    trigger,
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
    const stepWithError = stepFields[1].some((field) => fields.includes(field))
      ? 1
      : stepFields[2].some((field) => fields.includes(field))
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
            className="link desktop:inline-flex hidden min-h-11 items-center gap-1.5 self-start"
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
            className="link desktop:inline-flex hidden min-h-11 cursor-pointer items-center gap-1.5 self-start"
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
              onClick={async () => {
                if (await trigger(stepFields[1])) {
                  setStep(2)
                  window.scrollTo({ top: 0 })
                }
              }}
              className="btn btn-secondary min-w-40 px-8"
            >
              下一步
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="desktop:flex hidden justify-end gap-3">
            <button
              type="button"
              onClick={async () => {
                if (await trigger(stepFields[2])) {
                  setStep(3)
                  window.scrollTo({ top: 0 })
                }
              }}
              className="btn btn-secondary min-w-40 px-8"
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
              className="btn btn-secondary min-w-40 px-8"
            >
              發布
            </button>
          </div>
        )}

        <BottomBar className="border-line bg-surface desktop:hidden fixed inset-x-0 bottom-0 z-2 flex gap-3 border-t px-4 py-3">
          {step === 1 && (
            <Link to="/owner" className="btn btn-secondary flex-1 gap-1.5 px-4">
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
              className="btn btn-secondary flex-1 gap-1.5 px-4"
            >
              <ChevronDownIcon className="rotate-90" />
              上一頁
            </button>
          )}
          <button
            type="button"
            disabled={step === 3 && publish.isPending}
            onClick={async () => {
              if (step === 3) {
                submit()
              } else if (await trigger(stepFields[step])) {
                setStep(step === 1 ? 2 : 3)
                window.scrollTo({ top: 0 })
              }
            }}
            className="btn btn-secondary flex-1 px-4"
          >
            {step === 3 ? '發布' : '下一步'}
          </button>
        </BottomBar>
      </div>
    </div>
  )
}
