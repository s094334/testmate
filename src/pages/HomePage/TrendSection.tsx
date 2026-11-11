import { missingDevices, popularIndustries } from './data'

export function TrendSection() {
  return (
    <section className="max-w-page tablet:px-6 tablet:pb-16 mx-auto px-4 pb-12">
      <div className="bg-surface border-ink overflow-hidden rounded-md border">
        <div className="border-ink tablet:flex-wrap tablet:px-6 tablet:py-4 flex items-baseline justify-between gap-2 border-b px-4 py-3">
          <h2 className="text-subheading tablet:text-[26px]">測試趨勢</h2>
        </div>
        <div className="tablet:grid tablet:grid-cols-3">
          <div className="border-line tablet:gap-3 tablet:border-r tablet:border-b-0 tablet:p-6 flex flex-col gap-2 border-b p-4">
            <span className="text-ink-subtle tablet:text-[20px] font-bold">
              熱門產業
            </span>
            <ol className="tablet:gap-2 tablet:text-[18px] flex flex-col gap-1 pl-1">
              {popularIndustries.map((industry, index) => (
                <li key={industry} className="flex gap-3">
                  <span className="font-num w-6 text-[20px] font-semibold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {industry}
                </li>
              ))}
            </ol>
          </div>
          <div className="border-line tablet:gap-3 tablet:border-r tablet:border-b-0 tablet:p-6 flex flex-col gap-2 border-b p-4">
            <span className="text-ink-subtle tablet:text-[20px] font-bold">
              最缺的裝置
            </span>
            <div className="tablet:text-[18px] flex flex-wrap gap-2 pl-1">
              {missingDevices.map((device) => (
                <span
                  key={device}
                  className="border-line-input rounded-[4px] border px-3 py-0.5"
                >
                  {device}
                </span>
              ))}
            </div>
          </div>
          <div className="tablet:flex-col tablet:justify-start tablet:p-6 flex items-center gap-8 p-4">
            <span className="text-ink-subtle tablet:text-[20px] font-bold">
              本週新案件
            </span>
            <span className="font-num tablet:text-num-display from-owner to-tester tablet:bg-[length:100%_12px] bg-linear-to-r bg-[length:100%_8px] bg-[position:0_100%] bg-no-repeat px-1 text-[40px] leading-none font-semibold">
              7
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
