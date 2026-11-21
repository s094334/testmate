import { useState } from 'react'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { interestCategories } from '@/data/interests'

export function Interests({
  interests,
  onChange,
}: {
  interests: string[]
  onChange: (interests: string[]) => void
}) {
  const [openCategory, setOpenCategory] = useState('遊戲')
  const [saved, setSaved] = useState(false)

  return (
    <section className="desktop:gap-6 desktop:p-8 flex flex-col gap-5 px-4 py-5">
      <h2 className="text-section-title">興趣</h2>

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
                    <span className="text-tester-text font-bold">
                      已選 {count} 項
                    </span>
                  )}
                  {count === 0 && <span className="text-ink-subtle">未選</span>}
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
                            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border pr-4 pl-3 ${interests.includes(item) ? 'border-role bg-role-soft text-tester-text font-bold' : 'border-line-input bg-surface'}`}
                          >
                            <input
                              type="checkbox"
                              checked={interests.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChange([...interests, item])
                                } else {
                                  onChange(interests.filter((i) => i !== item))
                                }
                                setSaved(false)
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

      <div className="desktop:flex hidden items-center justify-end gap-3">
        <span className="text-ink-subtle">{saved && '已儲存'}</span>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="btn btn-secondary px-8"
        >
          儲存
        </button>
      </div>

      <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 -mb-5 flex flex-col gap-2 rounded-b-md border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="btn btn-secondary px-4"
        >
          儲存
        </button>
      </div>
    </section>
  )
}
