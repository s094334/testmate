import type {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'
import { InfoPopover } from '@/components/InfoPopover'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import type { FieldConfig } from './fields'

type FormFieldProps<T extends FieldValues> = FieldConfig<T> & {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function FormField<T extends FieldValues>({
  label,
  name,
  id = name,
  type,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  requiredMessage,
  rules,
  options,
  disablePlaceholder,
  hint,
  hideHintOnError,
  rows,
  tooltip,
  headingLabel,
  register,
  errors,
}: FormFieldProps<T>) {
  // Pick this field's error out of the form's errors (undefined = no error)
  const error = errors[name] as FieldError | undefined

  return (
    <div className="flex flex-col gap-2">
      {tooltip ? (
        <div className={`flex items-center ${headingLabel ? 'mb-2' : ''}`}>
          <label
            htmlFor={id}
            className={headingLabel ? 'text-subheading' : 'text-label'}
          >
            {label}
            {requiredMessage && (
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            )}
          </label>
          <InfoPopover label={`${label}說明`}>{tooltip}</InfoPopover>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={headingLabel ? 'text-subheading mb-2' : 'text-label'}
        >
          {label}
          {requiredMessage && (
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          )}
        </label>
      )}
      {type === 'select' ? (
        <div className="relative">
          <select
            id={id}
            defaultValue=""
            {...register(name, { required: requiredMessage, ...rules })}
            className={`bg-surface min-h-12 w-full appearance-none rounded-md py-2.5 pr-11 pl-3 ${error ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
          >
            <option value="" disabled={disablePlaceholder}>
              {placeholder}
            </option>
            {options?.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <span className="text-ink-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <ChevronDownIcon />
          </span>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          {...register(name, { required: requiredMessage, ...rules })}
          className={`bg-surface min-h-12 resize-y rounded-md px-3 py-2.5 ${error ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...register(name, { required: requiredMessage, ...rules })}
          className={`bg-surface min-h-12 rounded-md px-3 py-2.5 ${error ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
      )}
      {error && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {error.message}
        </span>
      )}
      {hint && !(error && hideHintOnError) && (
        <span className="text-ink-subtle">{hint}</span>
      )}
    </div>
  )
}
