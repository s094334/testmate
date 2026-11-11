export function HomeProjectsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 420 420"
        className="tablet:block absolute -top-20 -right-30 hidden size-105"
      >
        <circle cx="210" cy="210" r="200" className="fill-owner/16" />
        <circle
          cx="210"
          cy="210"
          r="200"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="2 8"
          strokeLinecap="round"
          className="stroke-owner"
        />
      </svg>
      <svg
        viewBox="0 0 360 360"
        className="tablet:block absolute -bottom-30 -left-35 hidden size-90"
      >
        <circle cx="180" cy="180" r="170" className="fill-owner/12" />
      </svg>
      <svg
        viewBox="0 0 96 96"
        className="tablet:block absolute right-[10%] bottom-12 hidden size-24"
      >
        <rect
          x="8"
          y="8"
          width="80"
          height="80"
          rx="20"
          fill="none"
          strokeWidth="2"
          transform="rotate(14 48 48)"
          className="stroke-owner"
        />
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="tablet:hidden absolute top-2 -right-[70px] size-50"
      >
        <circle cx="100" cy="100" r="96" className="fill-owner/16" />
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="2 6"
          strokeLinecap="round"
          className="stroke-owner"
        />
      </svg>
      <svg
        viewBox="0 0 140 140"
        className="tablet:hidden absolute bottom-15 -left-[50px] size-35"
      >
        <circle cx="70" cy="70" r="66" className="fill-owner/12" />
      </svg>
    </div>
  )
}
