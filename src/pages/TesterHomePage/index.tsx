import { MyDevices } from './MyDevices'

export function TesterHomePage() {
  return (
    <div className="max-w-page tablet:flex-row tablet:flex-wrap tablet:px-6 tablet:pt-12 tablet:pb-16 mx-auto flex w-full flex-col gap-6 px-4 pt-6 pb-12">
      <section className="flex min-w-0 grow-2 basis-160 flex-col">
        <div className="bg-surface border-ink min-h-60 rounded-md border" />
      </section>

      <MyDevices />
    </div>
  )
}
