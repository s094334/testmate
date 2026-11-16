import { useState } from 'react'
import { PlusIcon } from '@/components/icons/PlusIcon'
import type { Device } from '@/data/tester'

export function CustomDeviceForm({
  onAdd,
  forProject = false,
}: {
  onAdd: (device: Device) => void
  forProject?: boolean
}) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [message, setMessage] = useState('')

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-name" className="text-label">
            裝置名稱
          </label>
          <input
            id="custom-name"
            type="text"
            value={name}
            maxLength={40}
            onChange={(event) => {
              setName(event.target.value)
              setMessage('')
            }}
            placeholder="填入品牌、型號"
            className="border-line-input bg-surface min-h-12 w-full rounded-md border px-3"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-version" className="text-label">
            {forProject && '最低'}系統版本
          </label>
          <input
            id="custom-version"
            type="text"
            value={version}
            maxLength={30}
            onChange={(event) => {
              setVersion(event.target.value)
              setMessage('')
            }}
            placeholder="例如：HyperOS 2"
            className="border-line-input bg-surface min-h-12 w-full rounded-md border px-3"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-role-text min-w-0 wrap-anywhere">
          {message ||
            (name.trim()
              ? '輸入好了，按「加入自訂裝置」。'
              : '先輸入裝置名稱。')}
        </span>
        <button
          type="button"
          disabled={name.trim() === ''}
          onClick={() => {
            // Mock id from the clock; the API will give real ones
            onAdd({
              id: String(Date.now()),
              type: 'custom',
              name: name.trim(),
              os: version.trim(),
            })
            setName('')
            setVersion('')
            setMessage(`已加入：${name.trim()}`)
          }}
          className="border-role bg-surface text-ink enabled:hover:bg-role enabled:hover:text-on-role max-desktop:basis-full inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out enabled:active:translate-y-px disabled:cursor-not-allowed disabled:border-dashed disabled:border-[#b5b4ae] disabled:text-line-input motion-reduce:active:translate-y-0"
        >
          <PlusIcon />
          加入自訂裝置
        </button>
      </div>
    </>
  )
}
