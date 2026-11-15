import { Link, useLocation } from 'react-router'
import logo from '@/assets/logo.png'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { LogoutIcon } from '@/components/icons/LogoutIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { owner } from '@/data/owner'

export function OwnerHeader() {
  const { pathname } = useLocation()

  return (
    <header className="bg-surface border-line relative z-3 border-b">
      <nav className="max-w-page tablet:gap-3 tablet:px-6 tablet:py-3 tablet:min-h-17 mx-auto flex min-h-15 items-center justify-between gap-2 py-2 pr-2 pl-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/owner" className="flex min-w-0 items-center">
            <img
              src={logo}
              alt="TestMate 測試咖"
              className="tablet:h-8 block h-6 w-auto"
            />
          </Link>

          <Link
            to="/owner"
            className={`tablet:block hidden py-2 ${pathname === '/owner' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : 'hover:shadow-[inset_0_-2px_0_var(--color-owner)]'}`}
          >
            首頁
          </Link>
          <Link
            to="/owner/company"
            className={`tablet:block hidden py-2 ${pathname === '/owner/company' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : 'hover:shadow-[inset_0_-2px_0_var(--color-owner)]'}`}
          >
            公司資料
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="tablet:gap-3 tablet:pl-0 inline-flex min-h-12 flex-none items-center gap-2 rounded-md px-2">
            <span className="border-owner bg-owner-soft tablet:size-11 tablet:text-[18px] inline-flex size-10 items-center justify-center rounded-full border-3 font-bold">
              {owner.name[0]}
            </span>
            <b>{owner.name}</b>
            <ChevronDownIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            data-role="owner"
            align="end"
            className="bg-surface text-ink tablet:w-50 w-55 rounded-md px-0 py-2 shadow-[0_2px_8px_#0c0c0d1f,0_16px_32px_-4px_#0c0c0d2e] ring-0"
          >
            <DropdownMenuItem
              render={<Link to="/owner" />}
              className="focus:bg-platform-soft tablet:hidden min-h-12 rounded-none px-4 text-base"
            >
              <span
                className={`py-2 ${pathname === '/owner' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : ''}`}
              >
                首頁
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link to="/owner/company" />}
              className="focus:bg-platform-soft tablet:hidden min-h-12 rounded-none px-4 text-base"
            >
              <span
                className={`py-2 ${pathname === '/owner/company' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : ''}`}
              >
                公司資料
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-line tablet:hidden mx-0 my-2" />

            <DropdownMenuItem
              render={<Link to="/" />}
              className="text-ink-subtle focus:bg-platform-soft min-h-12 rounded-none px-4 text-base"
            >
              <span className="flex translate-y-0.25">
                <LogoutIcon />
              </span>
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
