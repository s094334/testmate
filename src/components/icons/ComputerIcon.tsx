// Device type 電腦. className is optional: pass a size (e.g. desktop:size-5) when it should not be 24px
export function ComputerIcon({ className }: { className?: string }) {
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
      <path d="M5 5h14v10H5zM2 19h20" />
    </svg>
  )
}
