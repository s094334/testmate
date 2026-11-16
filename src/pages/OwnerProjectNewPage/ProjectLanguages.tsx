import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { languageOptions } from '@/data/options'
import type { FormValues } from './MatchingConditions'

export function ProjectLanguages({
  control,
  setValue,
}: {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  const languages = useWatch({ control, name: 'languages' })
  const nativeLanguages = useWatch({ control, name: 'nativeLanguages' })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-subheading">
          測試語言
          <span className="text-status-dispute-text text-required ml-1.5">
            必填
          </span>
        </h3>
        <p className="text-ink-subtle">
          勾選需要的語言；要找母語者，再勾選「需母語」。
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {languageOptions.map((language) => (
          <div
            key={language}
            className={`inline-flex min-h-11 items-stretch rounded-md border ${languages.includes(language) ? 'border-role bg-role-soft' : 'border-line-input bg-surface'}`}
          >
            <label
              className={`inline-flex cursor-pointer items-center gap-2 pr-3.5 pl-3 ${languages.includes(language) ? 'text-role-text font-bold' : ''}`}
            >
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
                }}
                className="accent-role size-4.5 cursor-pointer"
              />
              {language}
            </label>
            {languages.includes(language) && (
              <label
                className={`inline-flex cursor-pointer items-center gap-1.5 border-l border-[#a9dde3] px-3 ${nativeLanguages.includes(language) ? 'text-role-text font-bold' : 'text-[#6b6a65]'}`}
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
                  }}
                  className="accent-role size-4.5 cursor-pointer"
                />
                需母語
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
