import {
  useFormState,
  useWatch,
  type Control,
  type UseFormRegister,
} from 'react-hook-form'
import { WarningIcon } from '@/components/icons/WarningIcon'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function ProjectExperience({
  register,
  control,
}: {
  register: UseFormRegister<ProjectFormValues>
  control: Control<ProjectFormValues>
}) {
  const experience = useWatch({ control, name: 'experience' })
  const { errors } = useFormState({ control, name: ['experience', 'years'] })

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-subheading mb-4">
        經驗要求
        <span className="text-status-dispute-text text-required ml-1.5">
          必填
        </span>
      </legend>

      <div className="flex flex-wrap gap-3">
        <label
          className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${experience === 'any' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
        >
          <input
            type="radio"
            value="any"
            {...register('experience')}
            className="accent-role size-5 cursor-pointer"
          />
          不限，新手也可以
        </label>
        <label
          className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${experience === 'yes' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
        >
          <input
            type="radio"
            value="yes"
            {...register('experience')}
            className="accent-role size-5 cursor-pointer"
          />
          需要 QA 經驗
        </label>
      </div>
      {errors.experience && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {errors.experience.message}
        </span>
      )}

      {experience === 'yes' && (
        <div className="flex max-w-80 flex-col gap-1.5">
          <label htmlFor="min-years" className="text-label">
            最低年資
          </label>
          <select
            id="min-years"
            {...register('years')}
            className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.years ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          >
            <option value="under_1">未滿 1 年</option>
            <option value="1_to_2">1–2 年</option>
            <option value="3_to_5">3–5 年</option>
            <option value="over_5">超過 5 年</option>
          </select>
          {errors.years && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.years.message}
            </span>
          )}
        </div>
      )}
    </fieldset>
  )
}
