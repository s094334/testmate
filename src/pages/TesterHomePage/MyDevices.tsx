import { Link } from 'react-router'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { devices } from '@/data/tester'

export function MyDevices() {
  return (
    <aside className="bg-surface border-ink desktop:flex desktop:mt-[47px] desktop:grow desktop:basis-75 hidden min-w-0 flex-col gap-4 rounded-md border p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-subheading">我的裝置</h2>
        <Link to="/tester/profile" className="underline">
          編輯
        </Link>
      </div>

      <ol className="flex min-h-0 flex-1 flex-col overflow-y-auto">
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

      <Link
        to="/tester/profile"
        className="border-ink bg-surface hover:border-role hover:bg-role hover:text-on-role mt-auto flex min-h-12 items-center justify-center gap-2 rounded-md border font-bold transition-colors duration-150 ease-out"
      >
        <PlusIcon />
        新增裝置
      </Link>
    </aside>
  )
}
