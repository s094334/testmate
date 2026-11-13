export function SignupProgress({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex gap-2">
      <span className="bg-role h-2 flex-1 rounded-full" />
      <span
        className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-role' : 'bg-line'}`}
      />
      <span
        className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-role' : 'bg-line'}`}
      />
      <span
        className={`h-2 flex-1 rounded-full ${step >= 4 ? 'bg-role' : 'bg-line'}`}
      />
    </div>
  )
}
