import { AuthBackground } from '@/components/backgrounds/AuthBackground'
import { privacyNotice, privacySections } from './data'
import { InfoNotice } from './InfoNotice'

export function PrivacyPage() {
  return (
    <div className="tablet:px-6 tablet:py-16 mx-auto w-full max-w-4xl px-4 pt-6 pb-12">
      <AuthBackground />
      <article className="bg-surface border-ink tablet:p-12 flex flex-col gap-8 rounded-md border px-5 py-6">
        <h1>隱私權聲明</h1>
        <InfoNotice>{privacyNotice}</InfoNotice>
        {privacySections.map((section, index) => (
          <section
            key={section.title}
            className="border-line tablet:text-[18px] flex flex-col gap-3 border-t pt-8"
          >
            <h2 className="tablet:text-[26px] flex items-baseline gap-3">
              <span
                className={`font-num font-semibold ${index % 2 === 0 ? 'text-owner-strong' : 'text-tester-strong'}`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.title}
            </h2>
            {section.intro && <p>{section.intro}</p>}
            {section.items && (
              <ul className="flex list-disc flex-col gap-2 pl-6">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.outro && <p>{section.outro}</p>}
          </section>
        ))}
        <p className="text-ink-subtle text-right">最後更新：2026/11/01</p>
      </article>
    </div>
  )
}
