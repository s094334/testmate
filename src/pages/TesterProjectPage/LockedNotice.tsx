import type { ReactNode } from 'react'
import { LockIcon } from '@/components/icons/LockIcon'

export function LockedNotice({ children }: { children: ReactNode }) {
  return (
    <div className="border-line-input bg-page text-ink-muted flex items-center gap-3 rounded-md border border-dashed px-6 py-5 font-bold">
      <LockIcon className="size-5" />
      {children}
    </div>
  )
}
