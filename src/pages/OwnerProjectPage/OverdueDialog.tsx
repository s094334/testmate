import { useState } from 'react'
import { CloseIcon } from '@/components/icons/CloseIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export function OverdueDialog({
  open,
  onOpenChange,
  testerName,
  deadline,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  testerName: string
  deadline: Date
}) {
  const [choice, setChoice] = useState<'extend' | 'refund' | null>(null)
  const [now] = useState(() => Date.now())
  const extended = new Date(deadline.getTime() + 3 * 86400000)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-35 tablet:max-h-[calc(100dvh-11rem)] tablet:px-8 tablet:py-7 fixed inset-x-4 top-18 mx-auto flex max-h-[calc(100dvh-6rem)] max-w-150 flex-col gap-5 overflow-y-auto rounded-[12px] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-heading">
                {testerName}的報告已逾期
              </DialogTitle>
              <p className="text-ink-muted">
                報告期限 {deadline.getFullYear()}/
                {String(deadline.getMonth() + 1).padStart(2, '0')}/
                {String(deadline.getDate()).padStart(2, '0')}，已逾期{' '}
                {Math.max(1, Math.ceil((now - deadline.getTime()) / 86400000))}{' '}
                天
              </p>
            </div>
            <DialogClose className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out">
              <CloseIcon />
              <span className="sr-only">關閉</span>
            </DialogClose>
          </div>

          <fieldset>
            <legend className="mb-2 font-bold">
              選擇處理方式
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </legend>
            <div data-role="owner" className="flex flex-col gap-2.5">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 ${choice === 'extend' ? 'border-role bg-role-soft ring-role ring-1 ring-inset' : 'border-line-input'}`}
              >
                <input
                  type="radio"
                  name="overdue"
                  checked={choice === 'extend'}
                  onChange={() => setChoice('extend')}
                  className="accent-role mt-1 size-5 flex-none cursor-pointer"
                />
                <span className="flex flex-col">
                  <b className="text-[18px]">延後 3 天</b>
                  <span className="text-ink-muted">
                    報告期限改成 {extended.getFullYear()}/
                    {String(extended.getMonth() + 1).padStart(2, '0')}/
                    {String(extended.getDate()).padStart(2, '0')}
                    ，期限只能延一次
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 ${choice === 'refund' ? 'border-role bg-role-soft ring-role ring-1 ring-inset' : 'border-line-input'}`}
              >
                <input
                  type="radio"
                  name="overdue"
                  checked={choice === 'refund'}
                  onChange={() => setChoice('refund')}
                  className="accent-role mt-1 size-5 flex-none cursor-pointer"
                />
                <span className="flex flex-col">
                  <b className="text-[18px]">不延後，專案取消</b>
                  <span className="text-ink-muted">
                    報酬將退還給你，專案狀態會改成「已退款」
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div
            data-role="owner"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <DialogClose
              disabled={!choice}
              className="btn btn-primary min-w-40"
            >
              送出選擇
            </DialogClose>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
