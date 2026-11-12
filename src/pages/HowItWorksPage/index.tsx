import { useState } from 'react'
import { Link } from 'react-router'
import { ownerSteps, testerSteps } from './data'
import { DesktopSteps } from './DesktopSteps'
import { FlowChartCard } from './FlowChartCard'
import { MobileSteps } from './MobileSteps'

export function HowItWorksPage() {
  const [role, setRole] = useState<'owner' | 'tester'>('owner')

  const steps = role === 'owner' ? ownerSteps : testerSteps

  return (
    <div data-role={role}>
      <section className="max-w-page tablet:gap-4 tablet:px-6 tablet:pt-24 tablet:pb-8 mx-auto flex flex-col items-center gap-3 px-4 pt-12 pb-6 text-center">
        <h1>
          測試咖
          <span className="from-owner to-tester tablet:bg-[length:100%_10px] bg-linear-to-r bg-[length:100%_8px] bg-[position:0_88%] bg-no-repeat px-1">
            怎麼運作
          </span>
        </h1>
        <p className="text-ink-muted tablet:text-[20px] text-[18px]">
          <span className="tablet:hidden">左右滑動，看看每一步要做什麼。</span>
          <span className="tablet:inline hidden">
            選擇角色，看看接下來要做什麼。
          </span>
        </p>
      </section>

      {/* Desktop: role toggle */}
      <section className="max-w-page tablet:flex mx-auto hidden justify-center px-6 pb-12">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`border-ink min-h-12 rounded-md border px-6 text-[18px] font-bold transition-colors duration-150 ease-out ${role === 'owner' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
          >
            我是專案負責人
          </button>
          <button
            type="button"
            onClick={() => setRole('tester')}
            className={`border-ink min-h-12 rounded-md border px-6 text-[18px] font-bold transition-colors duration-150 ease-out ${role === 'tester' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
          >
            我是測試人員
          </button>
        </div>
      </section>

      <DesktopSteps steps={steps} />

      <MobileSteps key={role} steps={steps} />

      <FlowChartCard role={role} />

      {/* Bottom call to action: title and button change with the role */}
      <section className="bg-surface border-line border-t">
        <div className="max-w-page tablet:px-6 tablet:py-16 mx-auto flex flex-col items-center gap-4 px-4 py-12 text-center">
          <h2 className="tablet:text-[26px]">
            {role === 'owner' ? '有產品要測試嗎？' : '手上有裝置、想接案？'}
          </h2>
          <Link
            to="/login"
            className="bg-role text-on-role tablet:self-auto inline-flex min-h-12 items-center justify-center self-stretch rounded-md px-8 text-[18px] font-bold"
          >
            {role === 'owner' ? '發布專案' : '開始測試'}
          </Link>
        </div>
      </section>

      {/* Mobile: role toggle pinned to the bottom of the screen */}
      <div className="bg-surface border-line tablet:hidden sticky bottom-0 z-2 flex gap-2 border-t px-4 py-3">
        <button
          type="button"
          onClick={() => setRole('owner')}
          className={`border-ink min-h-12 flex-1 rounded-md border px-2 font-bold transition-colors duration-150 ease-out ${role === 'owner' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
        >
          我是專案負責人
        </button>
        <button
          type="button"
          onClick={() => setRole('tester')}
          className={`border-ink min-h-12 flex-1 rounded-md border px-2 font-bold transition-colors duration-150 ease-out ${role === 'tester' ? 'bg-role text-on-role' : 'bg-surface text-ink'}`}
        >
          我是測試人員
        </button>
      </div>
    </div>
  )
}
