import { Fragment } from 'react'
import { InfoPopover } from '@/components/InfoPopover'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import type { ReportItem } from '@/data/tester'

type ItemState = ReportItem & { savedBugRef: string }

export function TestResults({
  items,
  setItems,
  bugCount,
  tried,
}: {
  items: ItemState[]
  setItems: (items: ItemState[]) => void
  bugCount: number
  tried: boolean
}) {
  function update(index: number, patch: Partial<ItemState>) {
    setItems(
      items.map((item, other) =>
        other === index ? { ...item, ...patch } : item
      )
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h2 className="text-subheading tablet:text-heading">測試結果</h2>
          <InfoPopover label="測試結果說明">
            <div className="flex flex-col gap-2">
              <p>
                每個測試項目都要分開填寫一筆，包含測試項目、操作步驟，以及每個步驟實際看到的結果。填寫完成後，再選擇「通過」或「不通過」。{' '}
              </p>
            </div>
          </InfoPopover>
        </div>
        <p className="text-ink-subtle desktop:hidden">
          通過 {items.filter((item) => item.pass === true).length}／
          {items.length} 項、回報 {bugCount} 個 bug
        </p>
      </div>

      <div className="desktop:gap-0 desktop:overflow-hidden desktop:rounded-md desktop:border desktop:border-ink desktop:bg-surface flex flex-col gap-3">
        <div className="border-ink desktop:grid hidden grid-cols-[48px_1.1fr_2fr_2fr_220px_44px] gap-4 border-b px-6 py-3 font-bold">
          <span>#</span>
          <span>測試項目</span>
          <span>
            詳細步驟
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </span>
          <span>
            結果
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </span>
          <span>
            通過與否
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </span>
        </div>

        {items.map((item, index) => {
          const no = String(index + 1).padStart(2, '0')
          const refs = [...new Set(item.savedBugRef.match(/\d+/g)?.map(Number))]
            .filter((n) => n > 0)
            .sort((a, b) => a - b)

          return (
            <div
              key={index}
              className={`bg-surface border-ink desktop:grid desktop:grid-cols-[48px_1.1fr_2fr_2fr_220px_44px] desktop:items-start desktop:gap-4 desktop:rounded-none desktop:border-0 desktop:px-6 desktop:py-4 flex flex-col gap-3 rounded-md border p-4 ${index > 0 ? 'desktop:border-line desktop:border-t' : ''}`}
            >
              <div className="desktop:contents flex items-center gap-3">
                <span className="font-num text-ink-subtle desktop:pt-2 text-[22px] font-semibold">
                  {no}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setItems(items.filter((_, other) => other !== index))
                    }
                    className="hover:bg-platform-soft desktop:col-start-6 desktop:row-start-1 desktop:ml-0 ml-auto inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out"
                  >
                    <CloseIcon />
                    <span className="sr-only">刪除測試結果 {no}</span>
                  </button>
                )}
              </div>

              <label className="desktop:col-start-2 desktop:row-start-1 flex flex-col gap-1.5">
                <span className="desktop:sr-only font-bold">
                  測試項目
                  <span className="text-status-dispute-text text-required ml-1.5">
                    必填
                  </span>
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(event) =>
                    update(index, { title: event.target.value })
                  }
                  placeholder="測試項目名稱"
                  className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !item.title.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="desktop:sr-only font-bold">
                  詳細步驟
                  <span className="text-status-dispute-text text-required ml-1.5">
                    必填
                  </span>
                </span>
                <textarea
                  rows={3}
                  value={item.steps}
                  onChange={(event) =>
                    update(index, { steps: event.target.value })
                  }
                  placeholder={
                    '1. 多人同時編輯同一份檔案，確認結果1\n2. 輸入文字時，確認結果2'
                  }
                  className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !item.steps.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="desktop:sr-only font-bold">
                  結果
                  <span className="text-status-dispute-text text-required ml-1.5">
                    必填
                  </span>
                </span>
                <textarea
                  rows={3}
                  value={item.result}
                  onChange={(event) =>
                    update(index, { result: event.target.value })
                  }
                  placeholder={
                    '1. 無法多人同時輸入文字內容\n2. 輸入文字時，無法即時看到其他人輸入的內容'
                  }
                  className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !item.result.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                />
              </label>

              <div className="flex flex-col gap-2">
                <fieldset>
                  <legend className="desktop:sr-only mb-2 font-bold">
                    通過與否
                    <span className="text-status-dispute-text text-required ml-1.5">
                      必填
                    </span>
                  </legend>
                  <div className="flex gap-2">
                    <label
                      className={`has-focus-visible:outline-ink desktop:flex-none inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border px-3.5 font-bold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${item.pass === true ? 'bg-tester-soft border-ink' : `bg-surface ${tried && item.pass === null ? 'border-status-dispute-text' : 'border-ink'}`}`}
                    >
                      <input
                        type="radio"
                        name={`pass-${index}`}
                        checked={item.pass === true}
                        onChange={() => update(index, { pass: true })}
                        className="sr-only"
                      />
                      通過
                    </label>
                    <label
                      className={`has-focus-visible:outline-ink desktop:flex-none inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border px-3.5 font-bold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${item.pass === false ? 'bg-status-dispute-bg border-status-dispute-text text-status-dispute-text' : `bg-surface ${tried && item.pass === null ? 'border-status-dispute-text' : 'border-ink'}`}`}
                    >
                      <input
                        type="radio"
                        name={`pass-${index}`}
                        checked={item.pass === false}
                        onChange={() => update(index, { pass: false })}
                        className="sr-only"
                      />
                      不通過
                    </label>
                  </div>
                </fieldset>

                {item.pass === false && (
                  <>
                    <label className="flex flex-col gap-1">
                      <span className="font-bold">
                        相關 bug
                        <span className="text-status-dispute-text text-required ml-1.5">
                          必填
                        </span>
                      </span>
                      <input
                        type="text"
                        value={item.bugRef}
                        onChange={(event) =>
                          update(index, { bugRef: event.target.value })
                        }
                        placeholder="例：01、03"
                        className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !item.bugRef.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                      />
                    </label>
                    {item.bugRef === item.savedBugRef && refs.length > 0 && (
                      <p className="flex flex-wrap items-baseline">
                        <span className="text-ink-subtle mr-2">跳到</span>
                        {refs.map((n, k) => (
                          <Fragment key={n}>
                            {k > 0 && '、'}
                            {n <= bugCount && (
                              <a
                                href={`#bug-${String(n).padStart(2, '0')}`}
                                className="link text-role font-bold"
                              >
                                BUG {String(n).padStart(2, '0')}
                              </a>
                            )}
                            {n > bugCount && (
                              <span className="text-status-dispute-text">
                                BUG {String(n).padStart(2, '0')}（還沒新增）
                              </span>
                            )}
                          </Fragment>
                        ))}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          setItems([
            ...items,
            {
              title: '',
              steps: '',
              result: '',
              pass: null,
              bugRef: '',
              savedBugRef: '',
            },
          ])
        }
        className="btn btn-secondary self-end"
      >
        <PlusIcon />
        新增測試結果
      </button>
    </section>
  )
}
