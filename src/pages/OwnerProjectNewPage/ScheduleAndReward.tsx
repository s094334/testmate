import { useForm } from 'react-hook-form'

export function ScheduleAndReward() {
  const { register } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      reward: '',
    },
  })

  return (
    <>
      <section className="bg-surface border-ink desktop:px-8 desktop:py-7 flex flex-col gap-8 rounded-md border px-4 py-5">
        <fieldset className="flex flex-col">
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
                {...register('startDate')}
                className="border-line-input bg-surface min-h-12 w-full min-w-0 rounded-md border px-3 py-2.5"
              />
              <span className="text-ink-subtle desktop:inline hidden">–</span>
              <span className="text-ink-subtle desktop:hidden">至</span>
              <label htmlFor="end-date" className="sr-only">
                結束日期
              </label>
              <input
                id="end-date"
                type="date"
                {...register('endDate')}
                className="border-line-input bg-surface min-h-12 w-full min-w-0 rounded-md border px-3 py-2.5"
              />
            </div>
          </div>
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
                {...register('reward')}
                className="border-line-input bg-surface min-h-12 w-full rounded-md border py-2.5 pr-3 pl-13"
              />
            </div>
            <span className="text-ink-subtle">
              付給測試人員的報酬，報告通過後一次撥款。
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
