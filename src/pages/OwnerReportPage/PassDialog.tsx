import { CheckIcon } from '@/components/icons/CheckIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export function PassDialog({
  open,
  onOpenChange,
  onConfirm,
  testerName,
  amount,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  testerName: string
  amount: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-tester-soft text-tester-text flex size-11 flex-none items-center justify-center rounded-full">
              <CheckIcon className="size-5" />
            </span>
            <DialogTitle className="text-heading">
              確定要通過這份報告嗎？
            </DialogTitle>
          </div>
          <DialogDescription className="text-ink-muted">
            確認後會扣除平台費撥款報酬 {amount} 給{testerName}
            ，專案狀態改為「已完成」，之後不能再退回修改。
          </DialogDescription>
          <div
            data-role="owner"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <DialogClose className="btn btn-secondary">再看一下</DialogClose>
            <DialogClose onClick={onConfirm} className="btn btn-primary">
              確定通過
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
