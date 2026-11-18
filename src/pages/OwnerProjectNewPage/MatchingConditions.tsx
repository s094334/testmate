import type { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'
import { ProjectDevices } from './ProjectDevices'
import { ProjectExperience } from './ProjectExperience'
import { ProjectInterests } from './ProjectInterests'
import { ProjectLanguages } from './ProjectLanguages'
import { ProjectTestMode } from './ProjectTestMode'

export function MatchingConditions({
  register,
  control,
  setValue,
}: {
  register: UseFormRegister<ProjectFormValues>
  control: Control<ProjectFormValues>
  setValue: UseFormSetValue<ProjectFormValues>
}) {
  return (
    <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-subheading desktop:text-heading">媒合條件</h2>
        <p className="text-ink-muted">
          和測試人員的個人檔案用同一套選項，平台會依這些條件推薦人選。
        </p>
      </div>

      <ProjectDevices control={control} />

      <ProjectLanguages control={control} setValue={setValue} />

      <ProjectInterests control={control} />

      <ProjectExperience register={register} control={control} />

      <ProjectTestMode register={register} control={control} />
    </section>
  )
}
