// Device type 自訂 (a phone with a question mark). className is optional: pass a size (e.g. desktop:size-5) when it should not be 24px
export function CustomDeviceIcon({ className }: { className?: string }) {
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
      <path d="M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM10 9a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.3M12 15h.01" />
    </svg>
  )
}
