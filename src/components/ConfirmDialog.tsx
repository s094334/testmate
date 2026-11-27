import type { ReactNode } from 'react'
import { useSession } from '@/api/session'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

// While busy it cannot be closed or sent again
export function ConfirmDialog({
  title,
  children,
  busy,
  onClose,
  onConfirm,
}: {
  title: string
  children: ReactNode
  busy: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const { data: user } = useSession()

  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-45 tablet:px-8 tablet:py-7 fixed inset-x-4 top-30 mx-auto flex max-w-130 flex-col gap-4 rounded-[12px] px-4 py-5">
          <DialogTitle className="text-heading">{title}</DialogTitle>
          <DialogDescription className="text-ink-muted wrap-anywhere">
            {children}
          </DialogDescription>
          {/* The popup renders outside the layout, so it takes the role color from the logged-in user */}
          <div data-role={user?.role} className="tablet:justify-end flex gap-3">
            <DialogClose
              disabled={busy}
              className="btn btn-secondary tablet:flex-none tablet:px-6 flex-1 px-4"
            >
              取消
            </DialogClose>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="btn btn-primary tablet:flex-none tablet:px-6 flex-1 px-4"
            >
              確認
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
