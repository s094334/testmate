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

export function ReceivedEnvDialog({
  open,
  onOpenChange,
  ownerEmail,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  ownerEmail: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-status-pending-bg text-status-pending-text flex size-11 flex-none items-center justify-center rounded-full">
              <MailIcon />
            </span>
            <DialogTitle className="text-heading">
              確認已收到測試環境？
            </DialogTitle>
          </div>
          <DialogDescription className="text-ink-muted">
            負責人會用 Email
            寄送測試版下載方式、測試帳號等資料。還沒收到前請先不要點選開始測試，以免測到錯的版本。沒收到時，可以聯絡負責人：
            <b className="text-ink wrap-anywhere">{ownerEmail}</b>
          </DialogDescription>
          <div className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3">
            <DialogClose className="border-role bg-surface hover:bg-role-soft min-h-12 cursor-pointer rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0">
              還沒收到，再等等
            </DialogClose>
            <DialogClose className="border-role bg-role text-on-role hover:bg-surface hover:text-ink min-h-12 cursor-pointer rounded-full border-2 px-6 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0">
              已收到，開始測試
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
