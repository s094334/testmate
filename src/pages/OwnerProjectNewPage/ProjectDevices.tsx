import { useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { AddedDevices } from '@/components/Devices/AddedDevices'
import { CustomDeviceForm } from '@/components/Devices/CustomDeviceForm'
import { PickDeviceForm } from '@/components/Devices/PickDeviceForm'
import { ComputerIcon } from '@/components/icons/ComputerIcon'
import { CustomDeviceIcon } from '@/components/icons/CustomDeviceIcon'
import { PhoneIcon } from '@/components/icons/PhoneIcon'
import { TabletIcon } from '@/components/icons/TabletIcon'
import { TvIcon } from '@/components/icons/TvIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Device } from '@/data/tester'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function ProjectDevices({
  control,
}: {
  control: Control<ProjectFormValues>
}) {
  const [type, setType] = useState<Device['type']>('phone')
  const {
    field: { value: devices, onChange },
    fieldState: { error },
  } = useController({ control, name: 'devices' })

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-subheading">目標裝置</h3>

      <Tabs value={type} onValueChange={setType} className="flex flex-col">
        <TabsList className="relative z-1 -mb-px flex gap-1">
          <TabsTrigger
            value="phone"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <PhoneIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">手機</span>
          </TabsTrigger>
          <TabsTrigger
            value="tablet"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <TabletIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">平板</span>
          </TabsTrigger>
          <TabsTrigger
            value="tv"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <TvIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">電視</span>
          </TabsTrigger>
          <TabsTrigger
            value="computer"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <ComputerIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">電腦</span>
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <CustomDeviceIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">自訂</span>
          </TabsTrigger>
        </TabsList>

        <div
          className={`border-ink desktop:p-6 flex flex-col gap-4 rounded-md border p-4 ${type === 'phone' ? 'rounded-tl-none' : ''} ${type === 'custom' ? 'max-desktop:rounded-tr-none' : ''}`}
        >
          {type !== 'custom' && (
            <PickDeviceForm
              key={type}
              type={type}
              forProject
              onAdd={(device) => onChange([...devices, device])}
            />
          )}

          {type === 'custom' && (
            <CustomDeviceForm
              forProject
              onAdd={(device) => onChange([...devices, device])}
            />
          )}
        </div>
      </Tabs>

      <AddedDevices
        devices={devices}
        forProject
        onRemove={(id) =>
          onChange(devices.filter((device) => device.id !== id))
        }
      />
      {error && (
        <span className="text-status-dispute-text inline-flex items-center gap-1.5">
          <WarningIcon />
          {error.message}
        </span>
      )}
    </div>
  )
}
