import { CheckIcon } from '@/components/icons/CheckIcon'
import { MegaphoneIcon } from '@/components/icons/MegaphoneIcon'

// Only for projects with no tester yet; matched projects use StatusTag
export function OwnerStatusTag({ status }: { status: 'recruiting' | 'ended' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap ${status === 'ended' ? 'bg-status-progress-bg text-status-progress-text' : 'bg-owner-soft text-owner-strong'}`}
    >
      {status === 'recruiting' && (
        <>
          <MegaphoneIcon />
          招募中
        </>
      )}
      {status === 'ended' && (
        <>
          <CheckIcon />
          已結束
        </>
      )}
    </span>
  )
}
