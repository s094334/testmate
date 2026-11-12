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
import { tester } from '@/data/tester'

export function TesterHeader() {
  const { pathname } = useLocation()

  return (
    <header className="bg-surface border-line relative z-3 border-b">
      <nav className="max-w-page tablet:gap-3 tablet:px-6 tablet:py-3 tablet:min-h-17 mx-auto flex min-h-15 items-center justify-between gap-2 py-2 pr-2 pl-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/tester" className="flex min-w-0 items-center">
            <img
              src={logo}
              alt="TestMate 測試咖"
              className="tablet:h-8 block h-6 w-auto"
            />
          </Link>

          <Link
            to="/tester"
            className={`tablet:block hidden py-2 ${pathname === '/tester' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : 'hover:shadow-[inset_0_-2px_0_var(--color-tester)]'}`}
          >
            首頁
          </Link>
          <Link
            to="/tester/profile"
            className={`tablet:block hidden py-2 ${pathname === '/tester/profile' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : 'hover:shadow-[inset_0_-2px_0_var(--color-tester)]'}`}
          >
            我的檔案
          </Link>
          <Link
            to="/tester/projects"
            className={`tablet:block hidden py-2 ${pathname === '/tester/projects' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : 'hover:shadow-[inset_0_-2px_0_var(--color-tester)]'}`}
          >
            搜尋專案
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="tablet:gap-3 tablet:pl-0 inline-flex min-h-12 flex-none items-center gap-2 rounded-md px-2">
            <span className="border-tester bg-tester-soft tablet:size-11 tablet:text-[18px] inline-flex size-10 items-center justify-center rounded-full border-3 font-bold">
              {tester.name[0]}
            </span>
            <b>{tester.name}</b>
            <ChevronDownIcon />
          </DropdownMenuTrigger>

          {/* The menu renders outside the layout, so it needs its own data-role to get the green role color */}
          <DropdownMenuContent
            data-role="tester"
            align="end"
            className="bg-surface text-ink tablet:w-50 w-55 rounded-md px-0 py-2 shadow-[0_2px_8px_#0c0c0d1f,0_16px_32px_-4px_#0c0c0d2e] ring-0"
          >
            {/* Mobile: page links live in the menu */}
            <DropdownMenuItem
              render={<Link to="/tester" />}
              className="focus:bg-platform-soft tablet:hidden min-h-12 rounded-none px-4 text-base"
            >
              <span
                className={`py-2 ${pathname === '/tester' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : ''}`}
              >
                首頁
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link to="/tester/profile" />}
              className="focus:bg-platform-soft tablet:hidden min-h-12 rounded-none px-4 text-base"
            >
              <span
                className={`py-2 ${pathname === '/tester/profile' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : ''}`}
              >
                我的檔案
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link to="/tester/projects" />}
              className="focus:bg-platform-soft tablet:hidden min-h-12 rounded-none px-4 text-base"
            >
              <span
                className={`py-2 ${pathname === '/tester/projects' ? 'font-bold shadow-[inset_0_-2px_0_var(--color-role)]' : ''}`}
              >
                搜尋專案
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-line tablet:hidden mx-0 my-2" />

            {/* No real login yet, so logging out just goes back to the public home page */}
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
