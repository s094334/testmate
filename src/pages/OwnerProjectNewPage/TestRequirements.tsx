import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { WarningIcon } from '@/components/icons/WarningIcon'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function TestRequirements({
  register,
  errors,
}: {
  register: UseFormRegister<ProjectFormValues>
  errors: FieldErrors<ProjectFormValues>
}) {
  return (
    <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
      <h2 className="text-subheading desktop:text-heading">測試要求</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="how-to-test" className="text-subheading">
            如何測試
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </label>
          <p className="text-ink-subtle">
            一步一行，可以用 1. 2. 3. 列點；子步驟前面空三格。
          </p>
        </div>
        {/* 8 lines on desktop, 12 on mobile (lh = one line of text) */}
        <textarea
          id="how-to-test"
          rows={8}
          placeholder={
            '1. 請確保您滿足所有要求（裝置、系統版本與語言）。\n' +
            '2. 請先完成保密協議測試案例。提交後，即可得知更多關於測試的細節。\n' +
            '3. 將引導您完成以下步驟：\n' +
            '   1. 下載測試版 App，把手機語系切換成日文後開啟。\n' +
            '   2. 從首頁進入任一商品，加入購物車並完成結帳流程。\n' +
            '   3. 錄製完整流程影片，並截取所有必要的螢幕截圖（例如：購物車頁、結帳頁、付款完成頁，以及任何文字被截斷或出現亂碼的畫面）。'
          }
          {...register('howToTest', {
            required: '請填寫如何測試',
            pattern: { value: /\S/, message: '請填寫如何測試' },
          })}
          className={`bg-surface max-desktop:h-[calc(12lh+22px)] min-h-12 resize-y rounded-md px-3 py-2.5 ${errors.howToTest ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.howToTest && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.howToTest.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="success-criteria" className="text-subheading">
            成功標準
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </label>
          <p className="text-ink-subtle">
            寫清楚怎樣算完成，驗收時會依這裡判斷。
          </p>
        </div>
        {/* 5 lines on desktop, 7 on mobile */}
        <textarea
          id="success-criteria"
          rows={5}
          placeholder={
            '您的測試在以下情況下將被視為成功：\n' +
            '・從開啟 App 到付款完成，影片完整沒有中斷。\n' +
            '・購物車、結帳、付款完成三個畫面都有螢幕截圖。\n' +
            '・發現的問題都附上重現步驟、截圖與裝置型號。'
          }
          {...register('successCriteria', {
            required: '請填寫成功標準',
            pattern: { value: /\S/, message: '請填寫成功標準' },
          })}
          className={`bg-surface max-desktop:h-[calc(7lh+22px)] min-h-12 resize-y rounded-md px-3 py-2.5 ${errors.successCriteria ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.successCriteria && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.successCriteria.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="special-requirements" className="text-subheading">
          特殊要求
        </label>
        <textarea
          id="special-requirements"
          rows={3}
          placeholder="例：每一項都要附上螢幕截圖"
          {...register('specialRequirements')}
          className={`bg-surface min-h-12 resize-y rounded-md px-3 py-2.5 ${errors.specialRequirements ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
        />
        {errors.specialRequirements && (
          <span className="text-status-dispute-text inline-flex items-center gap-1.5">
            <WarningIcon />
            {errors.specialRequirements.message}
          </span>
        )}
      </div>
    </section>
  )
}
