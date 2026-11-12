import { ExclamationIcon } from '@/components/icons/ExclamationIcon'
import { statusLabels, type ProjectStatus } from '@/data/tester'

export function StatusTag({
  status,
  needsAction,
}: {
  status: ProjectStatus
  needsAction: boolean
}) {
  return (
    <span
      className={`relative inline-flex items-center gap-1.5 rounded-[4px] px-3 py-0.5 font-bold whitespace-nowrap ${
        {
          FUNDED: 'bg-platform-soft text-platform-strong',
          TESTING: 'bg-status-progress-bg text-status-progress-text',
          SUBMITTED: 'bg-status-pending-bg text-status-pending-text',
          PENDING_NDA: 'bg-status-pending-bg text-status-pending-text',
          PENDING_PAYMENT: 'bg-status-pending-bg text-status-pending-text',
          DISPUTED: 'bg-status-dispute-bg text-status-dispute-text',
          COMPLETED: 'border-ink bg-surface text-ink border',
          CANCELLED: 'border-ink bg-surface text-ink border',
          REFUNDED: 'border-ink bg-surface text-ink border',
        }[status]
      }`}
    >
      {statusLabels[status]}

      {needsAction && (
        <span className="bg-alert text-surface absolute -top-[9px] -right-[9px] flex size-[18px] items-center justify-center rounded-full shadow-[0_0_0_2px_var(--color-surface)]">
          <ExclamationIcon />
        </span>
      )}
    </span>
  )
}
