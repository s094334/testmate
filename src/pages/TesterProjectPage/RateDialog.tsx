import { useState } from 'react'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { MailIcon } from '@/components/icons/MailIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

export type Rating = {
  stars: number
  reasons: string[]
  comment: string
  // ISO time: 7 days after the first rating was sent
  editableUntil: string
}

// Mounted only while open, so an unsaved draft is thrown away on close
export function RateDialog({
  onClose,
  ownerName,
  company,
  ownerEmail,
  rateDeadline,
  saved,
  onSave,
}: {
  onClose: () => void
  ownerName: string
  company: string
  ownerEmail: string
  rateDeadline: string
  saved: Rating | null
  onSave: (rating: Rating) => void
}) {
  const [stars, setStars] = useState(saved?.stars ?? 0)
  const [reasons, setReasons] = useState(saved?.reasons ?? [])
  const [comment, setComment] = useState(saved?.comment ?? '')

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogBackdrop className="bg-ink/55 fixed inset-0" />
        <DialogPopup className="bg-surface shadow-overlay tablet:top-25 tablet:max-h-[calc(100dvh-8rem)] tablet:px-8 tablet:py-7 fixed inset-x-4 top-18 mx-auto flex max-h-[calc(100dvh-6rem)] max-w-150 flex-col gap-5 overflow-y-auto rounded-[12px] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-heading">評價{company}</DialogTitle>
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
              專案已完成，有問題可以直接聯絡。
            </span>
          </div>

          <fieldset>
            <legend className="mb-2 font-bold">
              評分
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </legend>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="has-focus-visible:outline-ink flex size-13 cursor-pointer items-center justify-center rounded-full has-focus-visible:outline-2"
                  >
                    <input
                      type="radio"
                      name="stars"
                      checked={stars === n}
                      onChange={() => {
                        setStars(n)
                        setReasons([])
                      }}
                      className="sr-only"
                    />
                    <StarIcon
                      className={`size-10 ${n <= stars ? 'text-star' : 'text-line'}`}
                    />
                    <span className="sr-only">{n} 顆星</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {stars > 0 && (
            <fieldset>
              <legend className="mb-2 font-bold">
                {stars >= 4 ? '讚一個' : '選取一個或多個問題'}
              </legend>
              <div data-role="tester" className="flex flex-wrap gap-2">
                {(stars >= 4
                  ? [
                      '需求說明清楚',
                      '測試環境給得完整',
                      '回覆迅速',
                      '準時付款',
                      '尊重測試結果',
                    ]
                  : [
                      '需求說明不清楚',
                      '測試環境給得不明確',
                      '回覆很慢',
                      '驗收標準不一致',
                      '要求超出範圍',
                    ]
                ).map((reason) => (
                  <label
                    key={reason}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border pr-4 pl-3 ${reasons.includes(reason) ? 'border-role bg-role-soft text-role-text font-bold' : 'border-line-input bg-surface'}`}
                  >
                    <input
                      type="checkbox"
                      checked={reasons.includes(reason)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReasons([...reasons, reason])
                        } else {
                          setReasons(reasons.filter((r) => r !== reason))
                        }
                      }}
                      className="accent-role size-4.5 cursor-pointer"
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="rate-comment" className="font-bold">
              評論
            </label>
            <textarea
              id="rate-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="這邊可以再補充說明唷。"
              className="bg-surface border-line-input min-h-12 resize-y rounded-md border px-3 py-2.5"
            />
          </div>

          <p className="bg-page text-ink-muted rounded-md px-4 py-3">
            {saved
              ? `已送出評價，${new Date(saved.editableUntil).toLocaleString(
                  'zh-TW',
                  {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }
                )} 前都可以修改；修改期限結束後才會公開。`
              : `請在 ${new Date(rateDeadline).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })} 前送出。修改期限結束後會公開評論。`}
          </p>

          <div
            data-role="tester"
            className="tablet:flex-row tablet:justify-end flex flex-col-reverse gap-3"
          >
            <button
              type="button"
              disabled={stars === 0}
              onClick={() => {
                onSave({
                  stars,
                  reasons,
                  comment,
                  editableUntil:
                    saved?.editableUntil ??
                    new Date(Date.now() + 7 * 86400000).toISOString(),
                })
                onClose()
              }}
              className="btn btn-primary min-w-40"
            >
              {saved ? '儲存修改' : '送出評價'}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
