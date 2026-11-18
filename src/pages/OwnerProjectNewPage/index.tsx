// The whole 發布專案 flow lives at one address, /owner/projects/new.
// `step` says which step is showing. A step you leave is only hidden, not removed,
// so everything typed in it is still there when you come back.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import {
  projectBasicFields,
  type ProjectBasicFormValues,
} from '@/pages/AuthPages/fields'
import { FormField } from '@/pages/AuthPages/FormField'
import { MatchingConditions } from './MatchingConditions'
import { ProjectProgress } from './ProjectProgress'
import { ScheduleAndReward } from './ScheduleAndReward'
import { TestRequirements } from './TestRequirements'

export function OwnerProjectNewPage() {
  const {
    register,
    formState: { errors },
  } = useForm<ProjectBasicFormValues>({
    shouldFocusError: false,
    defaultValues: {
      name: '',
      summary: '',
    },
  })

  const [step, setStep] = useState<1 | 2 | 3>(1)

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

          <MatchingConditions />
        </div>

        <div className={step === 2 ? 'contents' : 'hidden'}>
          <ScheduleAndReward />
        </div>

        <div className={step === 3 ? 'contents' : 'hidden'}>
          <TestRequirements />
        </div>

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
            onClick={() => {
              if (step !== 3) {
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
