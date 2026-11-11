import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="bg-surface border-line text-ink-subtle border-t">
      <div className="max-w-page items-center justify-between px-6 min-h-15 tablet:min-h-17 mx-auto flex gap-3">
        <b className="text-ink tablet:block hidden">TestMate 測試咖</b>
        <div className="flex gap-x-6">
          <Link
            to="/privacy"
            className="hover:text-ink py-2 underline transition-colors duration-150 ease-out"
          >
            隱私權聲明
          </Link>
          <Link
            to="/copyright"
            className="hover:text-ink py-2 underline transition-colors duration-150 ease-out"
          >
            版權聲明
          </Link>
        </div>
        <span>© 2026 TestMate</span>
      </div>
    </footer>
  )
}
