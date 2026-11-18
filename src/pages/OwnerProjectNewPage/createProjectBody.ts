import type { Path } from 'react-hook-form'
import type { CreateProjectBody, Tag } from '@/api/types'
import { deviceTypeLabels } from '@/components/Devices/deviceData'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function toCreateProjectBody(
  values: ProjectFormValues,
  deviceTags: Tag[],
  interestTags: Tag[]
): CreateProjectBody {
  return {
    name: values.name,
    summary: values.summary,
    devices: values.devices.map((device) =>
      device.type === 'custom'
        ? {
            device_tag_id: null,
            custom_name: device.name,
            min_os_version: device.os || null,
          }
        : {
            // The device tags are named like the tabs (手機, 平板…).
            // '' fails the backend's uuid check, which then points at 目標裝置.
            device_tag_id:
              deviceTags.find(
                (tag) => tag.name === deviceTypeLabels[device.type]
              )?.id ?? '',
            brand: device.brand ?? '',
            model:
              device.model && device.model !== '不限型號' ? device.model : null,
            min_os_version: device.os,
          }
    ),
    languages: values.languages.map((language) => ({
      name: language,
      native_required: values.nativeLanguages.includes(language),
    })),
    interest_tag_ids: interestTags
      .filter((tag) => values.interests.includes(tag.name))
      .map((tag) => tag.id),
    qa_experience_required: values.experience === 'yes',
    min_qa_years: values.experience === 'yes' ? values.years : undefined,
    test_mode: values.mode,
    test_city: values.mode === 'onsite' ? values.city : undefined,
    start_date: values.startDate,
    end_date: values.endDate,
    reward: Number(values.reward.replace(/[,，]/g, '')),
    how_to_test: values.howToTest,
    success_criteria: values.successCriteria,
    special_requirements: values.specialRequirements,
  }
}

export function formFieldOf(
  apiField: string
): Path<ProjectFormValues> | undefined {
  return (
    {
      name: 'name',
      summary: 'summary',
      devices: 'devices',
      languages: 'languages',
      interest_tag_ids: 'interests',
      qa_experience_required: 'experience',
      min_qa_years: 'years',
      test_mode: 'mode',
      test_city: 'city',
      start_date: 'startDate',
      end_date: 'endDate',
      reward: 'reward',
      how_to_test: 'howToTest',
      success_criteria: 'successCriteria',
      special_requirements: 'specialRequirements',
    } as Record<string, Path<ProjectFormValues> | undefined>
  )[apiField.split(/[.[]/)[0]]
}
