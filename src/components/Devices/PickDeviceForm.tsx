import { useState } from 'react'
import { PlusIcon } from '@/components/icons/PlusIcon'
import type { Device } from '@/data/tester'
import { deviceOptions } from './deviceData'

export function PickDeviceForm({
  type,
  onAdd,
  forProject = false,
}: {
  type: Exclude<Device['type'], 'custom'>
  onAdd: (device: Device) => void
  forProject?: boolean
}) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [version, setVersion] = useState('')
  const [message, setMessage] = useState('')

  const chosen = brand !== '' ? deviceOptions[type][brand] : undefined

  const canAdd =
    chosen !== undefined &&
    (chosen.models.length === 0 || model !== '') &&
    version !== ''

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="device-brand" className="text-label">
            品牌
          </label>
          <select
            id="device-brand"
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value)
              setModel('')
              setVersion('')
              setMessage('')
            }}
            className={`border-line-input bg-surface min-h-12 w-full rounded-md border px-3 ${brand ? 'text-ink' : 'text-ink-subtle'}`}
          >
            <option value="">請選擇品牌</option>
            {Object.keys(deviceOptions[type]).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        {(chosen === undefined || chosen.models.length > 0) && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="device-model" className="text-label">
              型號
            </label>
            <select
              id="device-model"
              value={model}
              disabled={brand === ''}
              onChange={(event) => {
                setModel(event.target.value)
                setMessage('')
              }}
              className={`border-line-input bg-surface disabled:border-line disabled:bg-platform-soft min-h-12 w-full rounded-md border px-3 ${model ? 'text-ink' : 'text-ink-subtle'}`}
            >
              <option value="">{brand ? '請選擇型號' : '先選品牌'}</option>
              {forProject && chosen !== undefined && <option>不限型號</option>}
              {chosen?.models.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="device-version" className="text-label">
            {forProject && '最低'}系統版本
          </label>
          <select
            id="device-version"
            value={version}
            disabled={brand === ''}
            onChange={(event) => {
              setVersion(event.target.value)
              setMessage('')
            }}
            className={`border-line-input bg-surface disabled:border-line disabled:bg-platform-soft min-h-12 w-full rounded-md border px-3 ${version ? 'text-ink' : 'text-ink-subtle'}`}
          >
            <option value="">
              {brand ? `請選擇${forProject ? '最低' : ''}系統版本` : '先選品牌'}
            </option>
            {chosen?.versions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-role-text min-w-0 wrap-anywhere">
          {message ||
            (canAdd
              ? '選好了，按「加入裝置」。'
              : chosen?.models.length === 0
                ? `依序選好品牌和${forProject ? '最低' : ''}系統版本。`
                : `依序選好品牌、型號和${forProject ? '最低' : ''}系統版本。`)}
        </span>
        <button
          type="button"
          disabled={!canAdd}
          onClick={() => {
            const name =
              model === '不限型號' ? `${brand}（不限型號）` : model || brand
            onAdd({ id: String(Date.now()), type, name, os: version })
            setBrand('')
            setModel('')
            setVersion('')
            setMessage(`已加入：${name}`)
          }}
          className="border-role bg-surface text-ink enabled:hover:bg-role enabled:hover:text-on-role max-desktop:basis-full inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out enabled:active:translate-y-px disabled:cursor-not-allowed disabled:border-dashed disabled:border-[#b5b4ae] disabled:text-line-input motion-reduce:active:translate-y-0"
        >
          <PlusIcon />
          加入裝置
        </button>
      </div>
    </>
  )
}
