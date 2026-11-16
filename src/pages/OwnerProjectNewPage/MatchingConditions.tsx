import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Device } from '@/data/tester'
import { ProjectDevices } from './ProjectDevices'
import { ProjectExperience } from './ProjectExperience'
import { ProjectInterests } from './ProjectInterests'
import { ProjectLanguages } from './ProjectLanguages'
import { ProjectTestMode } from './ProjectTestMode'

export type FormValues = {
  languages: string[]
  nativeLanguages: string[]
  experience: 'any' | 'yes'
  years: string
  mode: 'remote' | 'onsite'
  city: string
}

export function MatchingConditions() {
  const { register, control, setValue } = useForm<FormValues>({
    defaultValues: {
      languages: [],
      nativeLanguages: [],
      experience: 'any',
      years: '未滿 1 年',
      mode: 'remote',
      city: '',
    },
  })

  const [devices, setDevices] = useState<Device[]>([])
  const [interests, setInterests] = useState<string[]>([])

  return (
    <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading desktop:text-heading">媒合條件</h2>
        <p className="text-ink-muted">
          和測試人員的個人檔案用同一套選項，平台會依這些條件推薦人選。
        </p>
      </div>

      <ProjectDevices devices={devices} onChange={setDevices} />

      <ProjectLanguages control={control} setValue={setValue} />

      <ProjectInterests interests={interests} onChange={setInterests} />

      <ProjectExperience register={register} control={control} />

      <ProjectTestMode register={register} control={control} />
    </section>
  )
}
