export function ProjectProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="bg-surface border-ink desktop:px-7 desktop:py-5 flex flex-col gap-3 rounded-md border px-5 py-4">
      <b className="text-subheading">
        {step === 1 && '基本資料與媒合條件'}
        {step === 2 && '時程與報酬'}
        {step === 3 && '測試要求'}
      </b>
      <div className="flex gap-2">
        <span className="bg-role h-2 flex-1 rounded-full" />
        <span
          className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-role' : 'bg-line'}`}
        />
        <span
          className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-role' : 'bg-line'}`}
        />
      </div>
    </div>
  )
}
