import { AboutSection } from './AboutSection'
import { IdentitySection } from './IdentitySection'
import { TrendSection } from './TrendSection'

export function HomePage() {
  return (
    <>
      <div className="bg-home-sky">
        <section className="max-w-page tablet:gap-4 tablet:px-6 tablet:pt-24 tablet:pb-12 mx-auto flex flex-col items-center gap-3 px-4 pt-12 pb-8 text-center">
          <h1 className="text-title-hero tablet:text-[clamp(40px,5vw,64px)]">
            找測試，
            <span className="from-owner to-tester tablet:bg-[length:100%_12px] bg-linear-to-r bg-[length:100%_8px] bg-[position:0_88%] bg-no-repeat px-1">
              找對咖
            </span>
            。
          </h1>
          <p className="text-ink-muted max-w-measure tablet:max-w-none tablet:text-[20px]">
            專為軟體測試打造的媒合平台。
            <br className="tablet:hidden" />
            用你手上的裝置接案，或為產品找到測試人員；
            <br />
            報酬全程代管，驗收通過才撥款。
          </p>
        </section>
        <TrendSection />
        <IdentitySection />
      </div>
      <AboutSection />
    </>
  )
}
