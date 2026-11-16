import type { ReactNode } from 'react'
import { InfoIcon } from '@/components/icons/InfoIcon'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type InfoPopoverProps = {
  children: ReactNode
  label: string
}

export function InfoPopover({ children, label }: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        className="text-ink-subtle hover:text-role data-popup-open:text-role -my-3 -ml-1.5 inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-out"
      >
        <InfoIcon className="size-5 translate-y-px" />
        <span className="sr-only">{label}</span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={4}
        className="bg-surface text-ink block w-72 max-w-(--available-width) rounded-md px-4 py-3 text-[length:inherit] shadow-(--shadow-overlay) ring-0 outline-none data-[side=bottom]:slide-in-from-top-0! data-[side=top]:slide-in-from-bottom-0!"
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
