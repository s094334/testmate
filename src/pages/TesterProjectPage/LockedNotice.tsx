import type { ReactNode } from 'react'
import { LockIcon } from '@/components/icons/LockIcon'

export function LockedNotice({ children }: { children: ReactNode }) {
  return (
    <div className="border-line-input bg-page text-ink-muted flex items-center gap-3 rounded-md border border-dashed p-4 font-bold tablet:px-6 tablet:py-5">
      <LockIcon className="size-5" />
      {children}
    </div>
  )
}
