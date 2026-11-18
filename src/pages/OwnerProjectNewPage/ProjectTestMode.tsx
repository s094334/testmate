import {
  useFormState,
  useWatch,
  type Control,
  type UseFormRegister,
} from 'react-hook-form'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { cityOptions } from '@/data/options'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function ProjectTestMode({
  register,
  control,
}: {
  register: UseFormRegister<ProjectFormValues>
  control: Control<ProjectFormValues>
}) {
  const mode = useWatch({ control, name: 'mode' })
  const city = useWatch({ control, name: 'city' })
  const { errors } = useFormState({ control, name: ['mode', 'city'] })

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-subheading mb-4">
        測試方式
        <span className="text-status-dispute-text text-required ml-1.5">
          必填
        </span>
      </legend>

      <div className="flex flex-wrap gap-3">
        <label
          className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${mode === 'remote' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
        >
          <input
            type="radio"
            value="remote"
            {...register('mode')}
            className="accent-role size-5 cursor-pointer"
          />
          遠端
        </label>
        <label
          className={`max-desktop:flex-auto inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-md border pr-5 pl-4 text-[18px] font-bold ${mode === 'onsite' ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
        >
          <input
            type="radio"
            value="onsite"
            {...register('mode')}
            className="accent-role size-5 cursor-pointer"
          />
          實地
        </label>
      </div>
      {errors.mode && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {errors.mode.message}
        </span>
      )}

      {mode === 'onsite' && (
        <div className="flex max-w-80 flex-col gap-1.5">
          <label htmlFor="test-city" className="text-label">
            測試地點
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </label>
          <select
            id="test-city"
            {...register('city', { required: '請選擇測試地點' })}
            className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors.city ? 'border-status-dispute-text border-2' : 'border-line-input border'} ${city ? 'text-ink' : 'text-ink-subtle'}`}
          >
            <option value="">請選擇</option>
            {cityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {errors.city && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.city.message}
            </span>
          )}
          <span className="text-ink-subtle">
            會優先推薦居住地相同的測試人員
          </span>
        </div>
      )}
    </fieldset>
  )
}
