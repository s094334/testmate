import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { devices } from '@/data/tester'

export function MyDevicesMobile() {
  const [open, setOpen] = useState(false)

  return (
    <aside className="bg-surface border-ink tablet:hidden flex flex-col rounded-md border">
      <h2 className="text-subheading">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-h-16 w-full items-center gap-3 rounded-md px-4 py-2 text-left"
        >
          <span className="flex-1">我的裝置</span>
          <span className="bg-tester-soft text-tester-text font-num h-7 min-w-7 flex-none rounded-full px-2 text-center text-[18px] leading-7 font-semibold">
            {devices.length}
          </span>
          <ChevronDownIcon
            className={`size-6 flex-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h2>

      {open && (
        <div className="border-line flex flex-col gap-3 border-t px-4 pb-4">
          <ol className="flex flex-col">
            {devices.map((device) => (
              <li
                key={device.id}
                className="border-line flex items-center gap-4 border-t py-3 first:border-t-0"
              >
                <span className="bg-tester-strong size-2 flex-none rounded-full" />
                <span className="flex flex-col leading-normal">
                  <b className="text-[18px]">{device.name}</b>
                  <span className="text-ink-subtle">{device.os}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="flex gap-2">
            <Link
              to="/tester/profile"
              className="border-ink bg-surface flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md border font-bold"
            >
              <PlusIcon />
              新增裝置
            </Link>
            <Link
              to="/tester/profile"
              className="border-ink bg-surface flex min-h-12 flex-1 items-center justify-center rounded-md border font-bold"
            >
              編輯
            </Link>
          </div>
        </div>
      )}
    </aside>
  )
}
