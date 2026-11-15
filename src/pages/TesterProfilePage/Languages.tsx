import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import type { FormValues } from './BasicInfo'
import { languageOptions } from './data'

export function Languages({
  control,
  setValue,
  onChange,
}: {
  control: Control<FormValues>
  setValue: UseFormSetValue<FormValues>
  onChange: () => void
}) {
  const languages = useWatch({ control, name: 'languages' })
  const nativeLanguages = useWatch({ control, name: 'nativeLanguages' })

  return (
    <div className="flex flex-col gap-6 pt-6">
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
                  onChange()
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
                    onChange()
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
  )
}
