import { useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import type { FormValues } from './MatchingConditions'

export function ProjectExperience({
  register,
  control,
}: {
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
}) {
  const experience = useWatch({ control, name: 'experience' })

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

      {experience === 'yes' && (
        <div className="flex max-w-80 flex-col gap-1.5">
          <label htmlFor="min-years" className="text-label">
            最低年資
          </label>
          <select
            id="min-years"
            {...register('years')}
            className="border-line-input bg-surface min-h-12 w-full rounded-md border px-3"
          >
            <option>未滿 1 年</option>
            <option>1–2 年</option>
            <option>3–5 年</option>
            <option>超過 5 年</option>
          </select>
        </div>
      )}
    </fieldset>
  )
}
