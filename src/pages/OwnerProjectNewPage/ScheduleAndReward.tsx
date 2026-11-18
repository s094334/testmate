import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { WarningIcon } from '@/components/icons/WarningIcon'
import type { ProjectFormValues } from '@/pages/AuthPages/fields'

export function ScheduleAndReward({
  register,
  errors,
}: {
  register: UseFormRegister<ProjectFormValues>
  errors: FieldErrors<ProjectFormValues>
}) {
  return (
    <>
      <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-subheading mb-4">
            專案期間
            <span className="text-status-dispute-text text-required ml-1.5">
              必填
            </span>
          </legend>

          <div className="desktop:grid-cols-2 grid gap-x-4">
            <div className="desktop:flex-row desktop:items-center flex flex-col gap-2">
              <label htmlFor="start-date" className="sr-only">
                開始日期
              </label>
              <input
                id="start-date"
                type="date"
                {...register('startDate', { required: '請選擇開始日期' })}
                className={`bg-surface min-h-12 w-full min-w-0 rounded-md px-3 py-2.5 ${errors.startDate ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
              />
              <span className="text-ink-subtle desktop:inline hidden">–</span>
              <span className="text-ink-subtle desktop:hidden">至</span>
              <label htmlFor="end-date" className="sr-only">
                結束日期
              </label>
              <input
                id="end-date"
                type="date"
                {...register('endDate', { required: '請選擇結束日期' })}
                className={`bg-surface min-h-12 w-full min-w-0 rounded-md px-3 py-2.5 ${errors.endDate ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
              />
            </div>
          </div>
          {errors.startDate && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.startDate.message}
            </span>
          )}
          {errors.endDate && (
            <span className="text-status-dispute-text inline-flex items-center gap-1.5">
              <WarningIcon />
              {errors.endDate.message}
            </span>
          )}
        </fieldset>
      </section>

      <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
        <div className="desktop:grid-cols-2 grid gap-x-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="reward" className="text-subheading mb-2">
              報酬金額
              <span className="text-status-dispute-text text-required ml-1.5">
                必填
              </span>
            </label>
            <div className="relative">
              <span className="text-ink-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-bold">
                NT$
              </span>
              <input
                id="reward"
                type="text"
                inputMode="numeric"
                placeholder="例：1200"
                {...register('reward', {
                  required: '請填寫報酬金額',
                  // Commas only between digits: 1,200 and 12,00 pass, 1,2,, does not
                  validate: (value) =>
                    !/^\d+([,，]\d+)*$/.test(value.trim())
                      ? '請填寫報酬金額'
                      : Number(value.replace(/[,，]/g, '')) < 1
                        ? '報酬至少 1 元'
                        : Number(value.replace(/[,，]/g, '')) > 100000
                          ? '報酬最多 100,000 元'
                          : true,
                })}
                className={`bg-surface min-h-12 w-full rounded-md py-2.5 pr-3 pl-13 ${errors.reward ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
              />
            </div>
            {errors.reward && (
              <span className="text-status-dispute-text inline-flex items-center gap-1.5">
                <WarningIcon />
                {errors.reward.message}
              </span>
            )}
            <span className="text-ink-subtle">
              付給測試人員的報酬，報告通過後一次撥款。
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
