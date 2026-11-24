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

export function SubmitDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-status-pending-bg text-status-pending-text flex size-11 flex-none items-center justify-center rounded-full">
              <WarningIcon className="size-5.5 flex-none" />
            </span>
            <DialogTitle className="text-heading">
              確定要繳交測試報告嗎？
            </DialogTitle>
          </div>
          <DialogDescription className="text-ink-muted">
            繳交後不能再修改；如果負責人退回報告，才能回來編輯。
          </DialogDescription>
          <div
            data-role="tester"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <DialogClose className="btn btn-secondary">再檢查一下</DialogClose>
            <DialogClose onClick={onConfirm} className="btn btn-primary">
              確定繳交
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
