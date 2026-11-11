import { Link } from 'react-router'
import { OwnerIllustration } from '@/components/illustrations/OwnerIllustration'
import { TesterIllustration } from '@/components/illustrations/TesterIllustration'

export function IdentitySection() {
  return (
    <div className="bg-[linear-gradient(to_bottom,transparent_200px,var(--color-home-teal)_200px)]">
      <section className="max-w-page tablet:grid tablet:grid-cols-2 tablet:gap-6 tablet:px-6 tablet:pb-24 mx-auto flex flex-col gap-4 px-4 pb-16">
        <Link
          to="/signup"
          className="group/identity bg-surface border-ink hover:shadow-hover tablet:gap-4 tablet:p-8 flex flex-col items-center gap-3 rounded-md border px-4 py-6 text-center transition-[translate,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-1"
        >
          <OwnerIllustration className="tablet:w-60 w-50" />
          <p className="text-subheading tablet:text-heading">
            「找測試，找對咖。」
          </p>
          <p className="text-ink-muted max-w-95">
            產品快上線、手邊沒有 QA，也沒有裝置？
            <br />
            在這裡找到懂你產業的測試人員。
          </p>
          <span className="bg-owner-strong border-owner-strong text-on-role group-hover/identity:bg-surface group-hover/identity:text-ink tablet:self-auto tablet:px-6 tablet:text-[24px] flex min-h-12 items-center justify-center self-stretch rounded-full border-2 font-bold transition-colors duration-150 ease-out">
            發布專案
          </span>
        </Link>
        <Link
          to="/signup"
          className="group/identity bg-surface border-ink hover:shadow-hover tablet:gap-4 tablet:p-8 flex flex-col items-center gap-3 rounded-md border px-4 py-6 text-center transition-[translate,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-1"
        >
          <TesterIllustration className="tablet:w-60 w-50" />
          <p className="text-subheading tablet:text-heading">
            「缺你一個好咖。」
          </p>
          <p className="text-ink-muted max-w-95">
            用自己的手機和電腦接案。系統推薦案子，
            <br />
            開工前報酬已由平台代管。
          </p>
          <span className="bg-tester-strong border-tester-strong text-on-role group-hover/identity:bg-surface group-hover/identity:text-ink tablet:self-auto tablet:px-6 tablet:text-[24px] flex min-h-12 items-center justify-center self-stretch rounded-full border-2 font-bold transition-colors duration-150 ease-out">
            開始測試
          </span>
        </Link>
      </section>
    </div>
  )
}
