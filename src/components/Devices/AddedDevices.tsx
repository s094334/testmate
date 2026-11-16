import { CloseIcon } from '@/components/icons/CloseIcon'
import { ComputerIcon } from '@/components/icons/ComputerIcon'
import { CustomDeviceIcon } from '@/components/icons/CustomDeviceIcon'
import { PhoneIcon } from '@/components/icons/PhoneIcon'
import { TabletIcon } from '@/components/icons/TabletIcon'
import { TvIcon } from '@/components/icons/TvIcon'
import type { Device } from '@/data/tester'
import { deviceTypeLabels } from './deviceData'

export function AddedDevices({
  devices,
  onRemove,
  forProject = false,
}: {
  devices: Device[]
  onRemove: (id: string) => void
  forProject?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <b className="text-[18px]">已加入 {devices.length} 台</b>
      {devices.length > 0 && (
        <ol className="border-line rounded-md border">
          {devices.map((device) => (
            <li
              key={device.id}
              className="border-line flex items-center gap-4 border-t px-4 py-3 first:border-t-0"
            >
              <span className="bg-role size-2 flex-none rounded-full" />
              {device.type === 'phone' && <PhoneIcon className="flex-none" />}
              {device.type === 'tablet' && <TabletIcon className="flex-none" />}
              {device.type === 'tv' && <TvIcon className="flex-none" />}
              {device.type === 'computer' && (
                <ComputerIcon className="flex-none" />
              )}
              {device.type === 'custom' && (
                <CustomDeviceIcon className="flex-none" />
              )}
              <span className="flex min-w-0 flex-auto flex-col leading-normal">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <b className="min-w-0 text-[18px] wrap-anywhere">
                    {device.name}
                  </b>
                  {device.type === 'custom' && (
                    <span className="border-line-input text-ink-muted rounded-[4px] border border-dashed px-2 font-bold">
                      自訂
                    </span>
                  )}
                </span>
                <span className="text-ink-subtle wrap-anywhere">
                  {device.type === 'custom'
                    ? device.os || '未填系統版本'
                    : `${deviceTypeLabels[device.type]}、${device.os}`}
                  {forProject && device.os && ' 以上'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(device.id)}
                className="text-ink-muted hover:bg-platform-soft inline-flex size-11 flex-none items-center justify-center rounded-full transition-colors duration-150 ease-out"
              >
                <CloseIcon />
                <span className="sr-only">移除 {device.name}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
