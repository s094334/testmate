import { CheckIcon } from '@/components/icons/CheckIcon'
import { ExclamationIcon } from '@/components/icons/ExclamationIcon'
import { MegaphoneIcon } from '@/components/icons/MegaphoneIcon'
import { MinusCircleIcon } from '@/components/icons/MinusCircleIcon'

export function OwnerStatusTag({
  status,
  needsAttention,
}: {
  status: 'recruiting' | 'testing' | 'ended'
  needsAttention: boolean
}) {
  return (
    <span
      className={`relative inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap ${status === 'ended' ? 'bg-status-progress-bg text-status-progress-text' : 'bg-owner-soft text-owner-strong'}`}
    >
      {status === 'recruiting' && (
        <>
          <MegaphoneIcon />
          招募中
        </>
      )}
      {status === 'testing' && (
        <>
          <MinusCircleIcon className="size-4" />
          進行中
        </>
      )}
      {status === 'ended' && (
        <>
          <CheckIcon />
          已結束
        </>
      )}

      {needsAttention && (
        <span className="bg-alert text-surface absolute -top-[9px] -right-[9px] flex size-[18px] items-center justify-center rounded-full shadow-[0_0_0_2px_var(--color-surface)]">
          <ExclamationIcon />
        </span>
      )}
    </span>
  )
}
