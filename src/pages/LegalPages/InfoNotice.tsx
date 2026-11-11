import type { ReactNode } from 'react'
import { InfoIcon } from '@/components/icons/InfoIcon'

export function InfoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="bg-platform-soft tablet:px-6 tablet:py-5 tablet:text-[18px] flex gap-3 rounded-md p-4">
      <InfoIcon className="text-platform-strong mt-1 flex-none" />
      <p>{children}</p>
    </div>
  )
}
