import { CheckIcon } from '@/components/icons/CheckIcon'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'
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
import { owner } from '@/data/owner'

export function SendEnvDialog({
  open,
  onOpenChange,
  testerName,
  testerEmail,
  projectName,
  testPeriod,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  testerName: string
  testerEmail: string
  projectName: string
  testPeriod: string
}) {
  const subject = `【測試咖】${projectName}｜測試環境與說明`
  const body = `${testerName} 您好：

感謝參與「${projectName}」，以下是測試環境與內容：

• 測試版下載：（TestFlight、APK 連結）
• 測試帳號：（帳號、密碼）
• App 版本：（例：1.2.0）
• 測試期間：${testPeriod}
• 測試說明文件：（連結）

有任何問題可以直接回信給我。

${owner.name} ${owner.realName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-30 tablet:max-h-[calc(100dvh-9rem)] tablet:px-8 tablet:py-7 fixed inset-x-4 top-18 mx-auto flex max-h-[calc(100dvh-6rem)] max-w-160 flex-col gap-5 overflow-y-auto rounded-[12px] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-tester-soft text-tester-text flex size-11 flex-none items-center justify-center rounded-full">
                <CheckIcon className="size-5.5" />
              </span>
              <div className="flex flex-col">
                <DialogTitle className="text-heading">付款完成</DialogTitle>
                <DialogDescription className="text-ink-muted">
                  報酬已由平台代管，驗收通過才會撥款。
                </DialogDescription>
              </div>
            </div>
            <DialogClose className="hover:bg-platform-soft inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition duration-150 ease-out">
              <CloseIcon />
              <span className="sr-only">關閉</span>
            </DialogClose>
          </div>

          <section className="bg-role-soft flex flex-col gap-2.5 rounded-md p-4">
            <h3 className="text-[18px]">
              下一步：寄信給{testerName}，提供測試環境
            </h3>
            <p>對方收到後才能開始測試。信裡建議包含：</p>
            <ul className="flex flex-col gap-1">
              <li className="flex gap-2">
                <span className="bg-role mt-2.5 size-1.5 flex-none rounded-full" />
                測試版本的下載方式（TestFlight、APK 或測試網址）
              </li>
              <li className="flex gap-2">
                <span className="bg-role mt-2.5 size-1.5 flex-none rounded-full" />
                測試帳號與密碼
              </li>
              <li className="flex gap-2">
                <span className="bg-role mt-2.5 size-1.5 flex-none rounded-full" />
                App 或網站版本號
              </li>
              <li className="flex gap-2">
                <span className="bg-role mt-2.5 size-1.5 flex-none rounded-full" />
                測試相關說明文件及其注意事項
              </li>
              <li className="flex gap-2">
                <span className="bg-role mt-2.5 size-1.5 flex-none rounded-full" />
                有問題時的聯絡資訊
              </li>
            </ul>
          </section>

          <div className="flex flex-col gap-2">
            <div
              data-role="owner"
              className="flex items-center justify-between gap-3"
            >
              <h3 className="text-base">信件範本</h3>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(body)}
                className="btn btn-secondary min-h-11 px-3.5"
              >
                <CopyIcon />
                複製範本
              </button>
            </div>
            <div className="border-line bg-page max-h-60 overflow-auto rounded-md border px-4 py-3.5">
              <p className="text-ink-subtle">收件人：{testerEmail}</p>
              <p className="text-ink-subtle mb-2">主旨：{subject}</p>
              <p className="whitespace-pre-line">{body}</p>
            </div>
          </div>

          <div data-role="owner" className="tablet:justify-end flex gap-3">
            <DialogClose className="btn btn-secondary tablet:min-w-40 flex-1 px-2 tablet:flex-none">
              稍後再寄
            </DialogClose>
            <a
              href={`mailto:${testerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="btn btn-primary tablet:min-w-40 flex-1 px-2 tablet:flex-none"
            >
              <MailIcon className="size-4.5" />用 Email 寄出
            </a>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
