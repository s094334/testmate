import { CloseIcon } from '@/components/icons/CloseIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { InfoPopover } from '@/components/InfoPopover'
import type { ReportBug } from '@/data/tester'

export function BugReports({
  bugs,
  setBugs,
  env,
  tried,
}: {
  bugs: ReportBug[]
  setBugs: (bugs: ReportBug[]) => void
  env: string
  tried: boolean
}) {
  function update(index: number, patch: Partial<ReportBug>) {
    setBugs(
      bugs.map((bug, other) => (other === index ? { ...bug, ...patch } : bug))
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading tablet:text-heading">回報 bug</h2>
      </div>
      <p className="text-ink-subtle">
        測試項目選「不通過」時，在旁邊填上相關的 bug 編號，當同個項目有好幾個
        bug 時，可以填多個編號。
      </p>

      {bugs.map((bug, index) => {
        const no = String(index + 1).padStart(2, '0')

        return (
          <section
            key={bug.id}
            className="bg-surface border-ink tablet:p-6 flex flex-col gap-4 rounded-md border p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-num text-[22px] font-semibold">BUG {no}</h3>
                <span
                  className={`rounded-[4px] px-2.5 font-bold ${bug.type === 'Bug' ? 'bg-status-dispute-bg text-status-dispute-text' : 'bg-status-progress-bg text-status-progress-text'}`}
                >
                  {bug.type}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBugs(bugs.filter((other) => other.id !== bug.id))
                }
                className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out"
              >
                <CloseIcon />
                <span className="sr-only">刪除 BUG {no}</span>
              </button>
            </div>

            {bug.type !== '語言' && (
              <>
                <div className="desktop:grid-cols-[150px_2fr_1.5fr] grid gap-4">
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">類型</span>
                    <select
                      value={bug.type}
                      onChange={(event) =>
                        update(index, {
                          type: event.target.value as ReportBug['type'],
                        })
                      }
                      className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
                    >
                      <option>Bug</option>
                      <option>語言</option>
                      <option>建議</option>
                      <option>介面體驗</option>
                      <option>效能</option>
                      <option>其他</option>
                    </select>
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">
                      標題
                      <span className="text-status-dispute-text text-required ml-1.5">
                        必填
                      </span>
                    </span>
                    <input
                      type="text"
                      value={bug.title}
                      onChange={(event) =>
                        update(index, { title: event.target.value })
                      }
                      placeholder="一句話描述 bug"
                      className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !bug.title.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">
                      環境
                      <span className="text-status-dispute-text text-required ml-1.5">
                        必填
                      </span>
                    </span>
                    <input
                      type="text"
                      value={bug.env}
                      onChange={(event) =>
                        update(index, { env: event.target.value })
                      }
                      placeholder="例：iPhone 15、iOS 18.1、App 1.2.0"
                      className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !bug.env.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                    />
                  </label>
                </div>

                <div className="tablet:grid-cols-[200px_240px] grid gap-4">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <label
                        htmlFor={`bug-${no}-priority`}
                        className="font-bold"
                      >
                        嚴重度
                      </label>
                      <InfoPopover label="嚴重度說明">
                        <ul className="flex flex-col gap-1">
                          <li>
                            <b>致命</b>：無法繼續使用，或資料、金錢出錯
                          </li>
                          <li>
                            <b>嚴重</b>：主要功能壞掉，但有方法繞過
                          </li>
                          <li>
                            <b>一般</b>：次要功能異常或顯示錯誤
                          </li>
                          <li>
                            <b>輕微</b>：不影響使用的小瑕疵
                          </li>
                        </ul>
                      </InfoPopover>
                    </div>
                    <select
                      id={`bug-${no}-priority`}
                      value={bug.priority}
                      onChange={(event) =>
                        update(index, {
                          priority: event.target.value as ReportBug['priority'],
                        })
                      }
                      className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
                    >
                      <option>致命</option>
                      <option>嚴重</option>
                      <option>一般</option>
                      <option>輕微</option>
                    </select>
                  </div>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">頻率</span>
                    <select
                      value={bug.frequency}
                      onChange={(event) =>
                        update(index, {
                          frequency: event.target
                            .value as ReportBug['frequency'],
                        })
                      }
                      className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
                    >
                      <option>每次都會發生</option>
                      <option>偶爾才發生</option>
                      <option>無法穩定重置</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="font-bold">
                    內容（重現步驟、目前結果與預期結果）
                    <span className="text-status-dispute-text text-required ml-1.5">
                      必填
                    </span>
                  </span>
                  <textarea
                    rows={6}
                    value={bug.steps}
                    onChange={(event) =>
                      update(index, { steps: event.target.value })
                    }
                    placeholder={
                      '重現步驟：\n1. 進入…\n2. 點擊…\n目前結果：…\n預期結果：…'
                    }
                    className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !bug.steps.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                  />
                </label>
              </>
            )}

            {bug.type === '語言' && (
              <>
                <div className="desktop:grid-cols-[150px_2fr_220px] grid gap-4">
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">類型</span>
                    <select
                      value={bug.type}
                      onChange={(event) =>
                        update(index, {
                          type: event.target.value as ReportBug['type'],
                        })
                      }
                      className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
                    >
                      <option>Bug</option>
                      <option>語言</option>
                      <option>建議</option>
                      <option>介面體驗</option>
                      <option>效能</option>
                      <option>其他</option>
                    </select>
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">
                      位置（頁面）
                      <span className="text-status-dispute-text text-required ml-1.5">
                        必填
                      </span>
                    </span>
                    <input
                      type="text"
                      value={bug.location}
                      onChange={(event) =>
                        update(index, { location: event.target.value })
                      }
                      placeholder="例：第一關、提示視窗"
                      className={`bg-surface min-h-12 w-full rounded-md px-3 ${tried && !bug.location.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="font-bold">問題類型</span>
                    <select
                      value={bug.languageIssue}
                      onChange={(event) =>
                        update(index, {
                          languageIssue: event.target
                            .value as ReportBug['languageIssue'],
                        })
                      }
                      className="bg-surface border-line-input min-h-12 w-full rounded-md border px-3"
                    >
                      <option>錯字</option>
                      <option>翻譯不自然</option>
                      <option>文字被截斷</option>
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="font-bold">
                    原文
                    <span className="text-status-dispute-text text-required ml-1.5">
                      必填
                    </span>
                  </span>
                  <textarea
                    rows={2}
                    value={bug.original}
                    onChange={(event) =>
                      update(index, { original: event.target.value })
                    }
                    placeholder="照畫面上的文字填寫"
                    className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !bug.original.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-bold">
                    建議修改
                    <span className="text-status-dispute-text text-required ml-1.5">
                      必填
                    </span>
                  </span>
                  <textarea
                    rows={2}
                    value={bug.suggestion}
                    onChange={(event) =>
                      update(index, { suggestion: event.target.value })
                    }
                    placeholder="你建議改成的文字"
                    className={`bg-surface w-full resize-y rounded-md px-3 py-2.5 ${tried && !bug.suggestion.trim() ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                  />
                </label>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="font-bold">
                {bug.type === '語言' ? '位置截圖' : '截圖或錄影'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {bug.files.map((name, fileIndex) => (
                  <span
                    key={fileIndex}
                    className="border-line bg-page inline-flex min-w-0 items-center gap-1 rounded-md border pl-3 wrap-anywhere"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        update(index, {
                          files: bug.files.filter(
                            (_, other) => other !== fileIndex
                          ),
                        })
                      }
                      className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out"
                    >
                      <CloseIcon />
                      <span className="sr-only">移除 {name}</span>
                    </button>
                  </span>
                ))}
                <label className="text-ink-muted bg-surface has-focus-visible:outline-ink tablet:order-none tablet:basis-auto tablet:justify-start border-line-input order-first inline-flex min-h-12 basis-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed px-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2">
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
                    onChange={(event) => {
                      update(index, {
                        files: [
                          ...bug.files,
                          ...Array.from(
                            event.target.files ?? [],
                            (file) => file.name
                          ),
                        ],
                      })
                      event.target.value = ''
                    }}
                    className="sr-only"
                  />
                  <PlusIcon />
                  上傳
                </label>
              </div>
            </div>
          </section>
        )
      })}

      <button
        type="button"
        onClick={() =>
          setBugs([
            ...bugs,
            {
              id: crypto.randomUUID(),
              type: 'Bug',
              title: '',
              env,
              steps: '',
              priority: '一般',
              frequency: '每次都會發生',
              location: '',
              original: '',
              languageIssue: '錯字',
              suggestion: '',
              files: [],
            },
          ])
        }
        className="btn btn-secondary self-end"
      >
        <PlusIcon />
        新增 bug
      </button>
    </section>
  )
}
