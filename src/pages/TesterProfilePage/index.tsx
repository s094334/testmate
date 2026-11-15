import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { devices, tester } from '@/data/tester'
import { BasicInfo } from './BasicInfo'
import { Devices } from './Devices'
import { Experience } from './Experience'
import { Interests } from './Interests'

export function TesterProfilePage() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(
    ['basic', 'experience', 'devices', 'interests'].find(
      (value) => value === params.get('tab')
    ) ?? 'basic'
  )
  const [deviceList, setDeviceList] = useState(devices)
  const [interestList, setInterestList] = useState(tester.interests)

  return (
    <div className="max-w-page tablet:px-6 desktop:gap-8 desktop:pt-12 desktop:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
        <TabsList className="desktop:gap-1 relative z-1 -mb-px flex gap-0.5">
          <TabsTrigger
            value="basic"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-3 text-[17px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            基本資料
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-3 text-[17px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            經歷
          </TabsTrigger>
          <TabsTrigger
            value="devices"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-3 text-[17px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            裝置
            <span className="bg-tester-strong text-surface font-num h-6 min-w-6 rounded-full px-1.5 text-center text-[16px] leading-6 font-semibold">
              {deviceList.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="interests"
            className="text-ink-subtle data-active:border-ink data-active:bg-surface data-active:text-ink desktop:px-6 desktop:text-[20px] flex h-12 items-center gap-2 rounded-t-md border border-b-0 border-transparent px-3 text-[17px] font-medium whitespace-nowrap transition-colors duration-150 ease-out data-active:font-bold"
          >
            興趣
          </TabsTrigger>
        </TabsList>

        <div
          className={`bg-surface border-ink rounded-md border ${tab === 'basic' ? 'rounded-tl-none' : ''}`}
        >
          {/* keepMounted: what was typed stays when switching to another tab and back */}
          <TabsContent value="basic" keepMounted>
            <BasicInfo />
          </TabsContent>
          <TabsContent value="experience" keepMounted>
            <Experience />
          </TabsContent>
          <TabsContent value="devices" keepMounted>
            <Devices devices={deviceList} onChange={setDeviceList} />
          </TabsContent>
          <TabsContent value="interests" keepMounted>
            <Interests interests={interestList} onChange={setInterestList} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
