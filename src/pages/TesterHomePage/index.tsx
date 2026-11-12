import { MyDevices } from './MyDevices'
import { MyDevicesMobile } from './MyDevicesMobile'

export function TesterHomePage() {
  return (
    <div className="max-w-page tablet:flex-row tablet:flex-wrap tablet:px-6 tablet:pt-12 tablet:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <MyDevicesMobile />

      <MyDevices />
    </div>
  )
}
