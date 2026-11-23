import { WarningIcon } from '@/components/icons/WarningIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export function RejectDisputeDialog({
  open,
  onOpenChange,
  onConfirm,
  testerName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  testerName: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-status-dispute-bg text-status-dispute-text flex size-11 flex-none items-center justify-center rounded-full">
              <WarningIcon className="size-5" />
            </span>
            <DialogTitle className="text-heading">
              這次退回會進入爭議處理中
            </DialogTitle>
          </div>
          <DialogDescription className="text-ink-muted">
            這是第 3
            次退回報告。確定後專案狀態會改為「爭議處理中」，平台暫停撥款與退款，並寄信通知
            {testerName}
            （信裡附上這次的退回原因）。請雙方協商後，回到平台選擇結果。
          </DialogDescription>
          <div
            data-role="owner"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <DialogClose className="btn btn-secondary">再看一下</DialogClose>
            <DialogClose onClick={onConfirm} className="btn btn-primary">
              確定退回
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
