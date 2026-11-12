import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { invitedProjects, joinedProjects } from '@/data/tester'
import { InvitedProjects } from './InvitedProjects'
import { JoinedProjects } from './JoinedProjects'
import { MyDevices } from './MyDevices'
import { MyDevicesMobile } from './MyDevicesMobile'

export function TesterHomePage() {
  const [tab, setTab] = useState('joined')

  return (
    <div className="max-w-page desktop:flex-row desktop:flex-wrap tablet:px-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <MyDevicesMobile />

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="desktop:contain-size desktop:grow-2 desktop:basis-160 flex min-w-0 flex-col"
      >
        <TabsList className="relative z-1 -mb-px flex gap-1">
          <TabsTrigger
            value="joined"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-4 text-[18px] font-medium transition-colors duration-150 ease-out data-active:font-bold"
          >
            參與的專案
            <span className="bg-alert text-surface font-num h-6 min-w-6 rounded-full px-1.5 text-center leading-6 font-semibold">
              {joinedProjects.filter((project) => project.needsAction).length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="invited"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-4 text-[18px] font-medium transition-colors duration-150 ease-out data-active:font-bold"
          >
            受邀的專案
            <span className="bg-tester-strong text-surface font-num h-6 min-w-6 rounded-full px-1.5 text-center leading-6 font-semibold">
              {invitedProjects.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div
          className={`bg-surface border-ink flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border ${tab === 'joined' ? 'rounded-tl-none' : ''}`}
        >
          {/* Mobile: the joined list stops at 420px and scrolls */}
          <TabsContent
            value="joined"
            className="desktop:max-h-none max-h-105 min-h-0 flex-1 overflow-y-auto"
          >
            <JoinedProjects />
          </TabsContent>
          <TabsContent
            value="invited"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <InvitedProjects />
          </TabsContent>
        </div>
      </Tabs>

      <MyDevices />
    </div>
  )
}
