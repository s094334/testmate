import { MailIcon } from '@/components/icons/MailIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export function ConfirmEnvDialog({
  open,
  onOpenChange,
  testerName,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  testerName: string
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop forceRender className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-owner-soft text-owner-text flex size-11 flex-none items-center justify-center rounded-full">
              <MailIcon />
            </span>
            <DialogTitle className="text-heading">
              確認已提供測試環境？
            </DialogTitle>
          </div>
          <DialogDescription className="text-ink-muted">
            確認後，{testerName}
            就能開始測試。請確定已經把測試版下載方式和測試帳號寄給對方。
          </DialogDescription>
          <div
            data-role="owner"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <DialogClose className="btn btn-secondary">
              還沒寄，再等等
            </DialogClose>
            <DialogClose onClick={onConfirm} className="btn btn-primary">
              確認已提供
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
