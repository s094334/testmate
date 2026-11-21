// 相關興趣 in 媒合條件. Same categories as the tester's 興趣, folded behind a button
// because it's optional.
import { useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { MinusIcon } from '@/components/icons/MinusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { interestCategories } from '@/data/interests'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function ProjectInterests({
  control,
}: {
  control: Control<ProjectFormValues>
}) {
  const {
    field: { value: interests, onChange },
    fieldState: { error },
  } = useController({ control, name: 'interests' })
  const [showInterests, setShowInterests] = useState(false)
  const [openCategory, setOpenCategory] = useState('遊戲')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-subheading">相關興趣</h3>
        <p className="text-ink-subtle">
          加入和專案相關的興趣，平台會優先推薦有這些興趣的測試人員。
        </p>
      </div>

      {showInterests && (
        <ul className="border-line rounded-md border">
          {interestCategories.map((category) => {
            const count = category.groups
              .flatMap((group) => group.items)
              .filter((item) => interests.includes(item)).length

            return (
              <li
                key={category.name}
                className="border-line border-t first:border-t-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(
                      openCategory === category.name ? '' : category.name
                    )
                  }
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left"
                >
                  <b className="text-[18px]">{category.name}</b>
                  <span className="inline-flex items-center gap-3">
                    {count > 0 && (
                      <span className="text-role-text font-bold">
                        已選 {count} 項
                      </span>
                    )}
                    {count === 0 && (
                      <span className="text-ink-subtle">未選</span>
                    )}
                    <ChevronDownIcon
                      className={`transition-transform duration-200 motion-reduce:transition-none ${openCategory === category.name ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {openCategory === category.name && (
                  <div className="flex flex-col gap-4 px-4 pb-5">
                    {category.groups.map((group) => (
                      <div key={group.title} className="flex flex-col gap-2">
                        {group.title && (
                          <span className="text-ink-subtle font-bold">
                            {group.title}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <label
                              key={item}
                              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border pr-4 pl-3 ${interests.includes(item) ? 'border-role bg-role-soft text-role-text font-bold' : 'border-line-input bg-surface'}`}
                            >
                              <input
                                type="checkbox"
                                checked={interests.includes(item)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    onChange([...interests, item])
                                  } else {
                                    onChange(
                                      interests.filter((i) => i !== item)
                                    )
                                  }
                                }}
                                className="accent-role size-4.5 cursor-pointer"
                              />
                              {item}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setShowInterests(!showInterests)}
        className="border-role bg-surface text-role-text hover:bg-role hover:text-on-role inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-dashed px-5 font-bold transition-colors duration-150 ease-out"
      >
        {showInterests ? <MinusIcon /> : <PlusIcon />}
        {showInterests
          ? '收合相關興趣'
          : interests.length > 0
            ? `相關興趣（已選 ${interests.length} 項）`
            : '加入相關興趣'}
      </button>
      {error && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {error.message}
        </span>
      )}
    </div>
  )
}
