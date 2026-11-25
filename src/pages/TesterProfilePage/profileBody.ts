import type { SaveProfileBody, Tag, TesterProfile } from '@/api/types'
import { deviceTypeLabels } from '@/components/Devices/deviceData'
import type { Device } from '@/data/tester'
import type { FormValues } from './BasicInfo'

// PUT replaces the whole profile, but each tab has its own 儲存.
// A tab sends this, what was last saved, with only its own part swapped in,
// so what is typed but not saved on another tab is not sent.
export function toSaveProfileBody(profile: TesterProfile): SaveProfileBody {
  return {
    real_name: profile.real_name,
    nickname: profile.nickname,
    phone: profile.phone,
    city: profile.city,
    has_qa_experience: profile.has_qa_experience,
    experiences: profile.experiences,
    languages: profile.languages,
    devices: profile.devices.map((device) => ({
      device_tag_id: device.device_tag?.id ?? null,
      brand: device.brand,
      model: device.model,
      os_version: device.os_version,
      custom_name: device.custom_name,
    })),
    interest_tag_ids: profile.interests.map((tag) => tag.id),
  }
}

// The device tags are named like the tabs (手機, 平板…); 自訂 has no tag
export function devicesOf(profile: TesterProfile): Device[] {
  return profile.devices.map((device) =>
    device.device_tag
      ? {
          id: device.id,
          type:
            (Object.keys(deviceTypeLabels) as Device['type'][]).find(
              (type) => deviceTypeLabels[type] === device.device_tag?.name
            ) ?? 'custom',
          name: device.model || device.brand || '',
          os: device.os_version ?? '',
          brand: device.brand ?? '',
          model: device.model ?? '',
        }
      : {
          id: device.id,
          type: 'custom',
          name: device.custom_name ?? '',
          os: device.os_version ?? '',
        }
  )
}

export function toDeviceBodies(
  devices: Device[],
  deviceTags: Tag[]
): SaveProfileBody['devices'] {
  return devices.map((device) =>
    device.type === 'custom'
      ? {
          device_tag_id: null,
          custom_name: device.name,
          os_version: device.os || null,
        }
      : {
          // '' fails the backend's uuid check, like on 發布專案
          device_tag_id:
            deviceTags.find((tag) => tag.name === deviceTypeLabels[device.type])
              ?.id ?? '',
          brand: device.brand ?? '',
          // '' for a brand without models (e.g. Windows)
          model: device.model || null,
          os_version: device.os,
        }
  )
}

// 居住地 is a select with no error style, so its message goes to the save bar
export function formFieldOf(apiField: string): keyof FormValues | undefined {
  return (
    {
      real_name: 'name',
      nickname: 'nickname',
      phone: 'phone',
    } as Record<string, keyof FormValues | undefined>
  )[apiField.split(/[.[]/)[0]]
}
