import { useState } from 'react'
import { ApiError } from '@/api/client'
import { useSaveProfile } from '@/api/profile'
import { useTags } from '@/api/tags'
import type { TesterProfile } from '@/api/types'
import { BottomBar } from '@/components/BottomBar'
import { AddedDevices } from '@/components/Devices/AddedDevices'
import { CustomDeviceForm } from '@/components/Devices/CustomDeviceForm'
import { PickDeviceForm } from '@/components/Devices/PickDeviceForm'
import { ComputerIcon } from '@/components/icons/ComputerIcon'
import { CustomDeviceIcon } from '@/components/icons/CustomDeviceIcon'
import { PhoneIcon } from '@/components/icons/PhoneIcon'
import { TabletIcon } from '@/components/icons/TabletIcon'
import { TvIcon } from '@/components/icons/TvIcon'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Device } from '@/data/tester'
import { devicesOf, toDeviceBodies, toSaveProfileBody } from './profileBody'

export function Devices({ profile }: { profile: TesterProfile }) {
  const [type, setType] = useState<Device['type']>('phone')
  const [devices, setDevices] = useState(() => devicesOf(profile))
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { data: deviceTags } = useTags('device')
  const saveProfile = useSaveProfile()

  function save() {
    setSaved(false)
    setSaveError('')
    // Every save sends the nickname too, and the backend rejects an empty one
    if (profile.nickname === '') {
      setSaveError('請先到基本資料填寫暱稱')
      return
    }
    if (!deviceTags) {
      setSaveError('無法連線，請稍後再試')
      return
    }
    saveProfile.mutate(
      {
        ...toSaveProfileBody(profile),
        devices: toDeviceBodies(devices, deviceTags.items),
      },
      {
        onSuccess: () => setSaved(true),
        onError: (error) =>
          setSaveError(
            error instanceof ApiError ? error.message : '無法連線，請稍後再試'
          ),
      }
    )
  }

  return (
    <section className="desktop:gap-6 desktop:p-8 flex flex-col gap-5 px-4 py-5">
      <h2 className="text-section-title">裝置</h2>

      <Tabs value={type} onValueChange={setType} className="flex flex-col">
        <TabsList className="relative z-1 -mb-px flex gap-1">
          <TabsTrigger
            value="phone"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[20px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <PhoneIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">手機</span>
          </TabsTrigger>
          <TabsTrigger
            value="tablet"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[20px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <TabletIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">平板</span>
          </TabsTrigger>
          <TabsTrigger
            value="tv"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[20px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <TvIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">電視</span>
          </TabsTrigger>
          <TabsTrigger
            value="computer"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[20px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            <ComputerIcon className="desktop:size-5 desktop:translate-y-[1.5px]" />
            <span className="max-desktop:sr-only">電腦</span>
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:flex-none desktop:px-6 flex h-12 flex-1 items-center justify-center gap-2 rounded-t-md border border-b-0 border-transparent px-2 text-[20px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
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
              onAdd={(device) => {
                setDevices([...devices, device])
                setSaved(false)
              }}
            />
          )}

          {type === 'custom' && (
            <CustomDeviceForm
              onAdd={(device) => {
                setDevices([...devices, device])
                setSaved(false)
              }}
            />
          )}
        </div>
      </Tabs>

      <AddedDevices
        devices={devices}
        onRemove={(id) => {
          setDevices(devices.filter((device) => device.id !== id))
          setSaved(false)
        }}
      />

      <div className="desktop:flex hidden items-center justify-end gap-3">
        <span className="text-ink-subtle">
          {saved && '已儲存'}
          {saveError}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={saveProfile.isPending}
          className="btn btn-secondary px-8"
        >
          儲存
        </button>
      </div>

      <BottomBar className="border-line bg-surface desktop:hidden fixed inset-x-0 bottom-0 flex flex-col gap-2 border-t px-4 py-3">
        {saved && <span className="text-tester-text">已儲存</span>}
        {saveError && (
          <span className="text-status-dispute-text">{saveError}</span>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saveProfile.isPending}
          className="btn btn-secondary px-4"
        >
          儲存
        </button>
      </BottomBar>
    </section>
  )
}
