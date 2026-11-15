// className is optional: leave it out for the 12px icon on the home page project cards
export function MinusCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  )
}
