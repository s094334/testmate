import { useState } from 'react'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { MailIcon } from '@/components/icons/MailIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export function DisputeDialog({
  open,
  onOpenChange,
  ownerName,
  company,
  ownerEmail,
  deadline,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  ownerName: string
  company: string
  ownerEmail: string
  deadline: string
}) {
  const [choice, setChoice] = useState<'continue' | 'accept' | 'end' | null>(
    null
  )
  const [now] = useState(() => Date.now())
  const end = new Date(deadline)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-35 tablet:max-h-[calc(100dvh-11rem)] tablet:px-8 tablet:py-7 fixed inset-x-4 top-18 mx-auto flex max-h-[calc(100dvh-6rem)] max-w-150 flex-col gap-5 overflow-y-auto rounded-[12px] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-heading">爭議處理</DialogTitle>
              <p className="text-ink-muted">驗收結果有爭議</p>
            </div>
            <DialogClose className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out">
              <CloseIcon />
              <span className="sr-only">關閉</span>
            </DialogClose>
          </div>

          <div className="bg-role-soft flex flex-col gap-1 rounded-md px-4 py-3.5">
            <span className="text-ink-muted">專案負責人</span>
            <b className="text-[18px]">
              {ownerName}、{company}
            </b>
            <a
              href={`mailto:${ownerEmail}`}
              className="link text-role inline-flex min-h-8 items-center gap-1.5 self-start font-bold wrap-anywhere"
            >
              <MailIcon className="size-4.5" />
              {ownerEmail}
            </a>
            <span className="text-ink-muted">
              可以先用 Email 溝通，再決定處理方式。
            </span>
          </div>

          <fieldset>
            <legend className="mb-2 font-bold">
              選擇處理方式
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </legend>
            <div className="flex flex-col gap-2.5">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 ${choice === 'continue' ? 'border-role bg-role-soft ring-role ring-1 ring-inset' : 'border-line-input'}`}
              >
                <input
                  type="radio"
                  name="dispute"
                  checked={choice === 'continue'}
                  onChange={() => setChoice('continue')}
                  className="accent-role mt-1 size-5 flex-none cursor-pointer"
                />
                <span className="flex flex-col">
                  <b className="text-[18px]">繼續進行</b>
                  <span className="text-ink-muted">
                    回到「測試中」，修改後重新提交報告
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 ${choice === 'accept' ? 'border-role bg-role-soft ring-role ring-1 ring-inset' : 'border-line-input'}`}
              >
                <input
                  type="radio"
                  name="dispute"
                  checked={choice === 'accept'}
                  onChange={() => setChoice('accept')}
                  className="accent-role mt-1 size-5 flex-none cursor-pointer"
                />
                <span className="flex flex-col">
                  <b className="text-[18px]">已完成</b>
                  <span className="text-ink-muted">
                    負責人接受目前的報告，撥款給你
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-3.5 ${choice === 'end' ? 'border-role bg-role-soft ring-role ring-1 ring-inset' : 'border-line-input'}`}
              >
                <input
                  type="radio"
                  name="dispute"
                  checked={choice === 'end'}
                  onChange={() => setChoice('end')}
                  className="accent-role mt-1 size-5 flex-none cursor-pointer"
                />
                <span className="flex flex-col">
                  <b className="text-[18px]">結束專案</b>
                  <span className="text-ink-muted">
                    不再繼續，報酬全額退回負責人
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <p className="bg-status-dispute-bg rounded-md px-4 py-3">
            <b className="text-status-dispute-text">
              請在 {end.getFullYear()}/
              {String(end.getMonth() + 1).padStart(2, '0')}/
              {String(end.getDate()).padStart(2, '0')} 前選擇（剩{' '}
              {Math.max(0, Math.ceil((end.getTime() - now) / 86400000))} 天）。
            </b>
            雙方選擇相同就照該結果處理；不同或期限內沒選，視為結果未達成一致。扣除平台抽成
            15% 後，剩下的報酬由測試人員和負責人各拿一半，專案變成「已退款」。
          </p>

          <div className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3">
            <DialogClose className="btn btn-secondary">取消</DialogClose>
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
