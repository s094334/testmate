import { useRef } from 'react'
import { DisputeTerms } from '@/components/DisputeTerms'
import { CloseIcon } from '@/components/icons/CloseIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

type DisputeTermsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  agreed: boolean
  onAgreedChange: (agreed: boolean) => void
}

export function DisputeTermsDialog({
  open,
  onOpenChange,
  agreed,
  onAgreedChange,
}: DisputeTermsDialogProps) {
  const title = useRef<HTMLHeadingElement>(null)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => onOpenChange(nextOpen)}
      disablePointerDismissal
    >
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup
          initialFocus={title}
          className="bg-surface tablet:inset-x-6 tablet:top-16 tablet:bottom-auto tablet:mx-auto tablet:max-h-[calc(100dvh-8rem)] tablet:max-w-180 tablet:rounded-[12px] tablet:shadow-overlay fixed inset-0 flex flex-col overflow-hidden"
        >
          <div className="border-line tablet:py-5 tablet:pr-5 tablet:pl-8 flex flex-none items-center justify-between gap-3 border-b py-2 pr-2 pl-5">
            <DialogTitle ref={title} tabIndex={-1} className="text-heading">
              爭議處理流程
            </DialogTitle>
            <DialogClose className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out">
              <CloseIcon />
              <span className="sr-only">關閉</span>
            </DialogClose>
          </div>
          <div
            tabIndex={0}
            className="tablet:px-8 tablet:pt-7 min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-8"
          >
            <DisputeTerms />
            <label className="mt-10 flex min-h-12 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => onAgreedChange(e.target.checked)}
                className="accent-ink mt-0.5 size-5.5 flex-none"
              />
              <span className="font-bold">我已閱讀並同意爭議處理流程</span>
            </label>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
