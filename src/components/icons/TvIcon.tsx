// Device type 電視. className is optional: pass a size (e.g. desktop:size-5) when it should not be 24px
export function TvIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h18v12H3zM8 21h8M12 17v4" />
    </svg>
  )
}
