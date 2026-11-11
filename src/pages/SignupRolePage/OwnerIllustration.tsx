export function OwnerIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="tablet:w-45 block h-auto w-24 max-w-full flex-none"
    >
      <circle cx="120" cy="96" r="86" fill="#14CCDE" fillOpacity="0.22" />
      <circle
        cx="120"
        cy="96"
        r="86"
        fill="none"
        stroke="#14CCDE"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <g stroke="#1E1E1C" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x="50"
          y="28"
          width="140"
          height="96"
          rx="10"
          fill="#FFFFFF"
          strokeWidth="2.5"
        />
        <path d="M50 46 H190" strokeWidth="1.5" />
        <circle cx="62" cy="37" r="2.5" fill="#1E1E1C" stroke="none" />
        <circle cx="71" cy="37" r="2.5" fill="#1E1E1C" stroke="none" />
        <circle cx="80" cy="37" r="2.5" fill="#1E1E1C" stroke="none" />
        <rect
          x="64"
          y="58"
          width="13"
          height="13"
          rx="3"
          fill="#FFFFFF"
          strokeWidth="2"
        />
        <rect
          x="64"
          y="78"
          width="13"
          height="13"
          rx="3"
          fill="#FFFFFF"
          strokeWidth="2"
        />
        <rect
          x="64"
          y="98"
          width="13"
          height="13"
          rx="3"
          fill="#FFFFFF"
          strokeWidth="2"
        />
        <path d="M86 64.5 H150" strokeWidth="2.5" />
        <path d="M86 84.5 H136" strokeWidth="2.5" />
        <path d="M86 104.5 H128" stroke="#878680" strokeWidth="2.5" />
      </g>
      <path
        pathLength={1}
        d="M66.5 64.5 L69.5 67.5 L75 61 M66.5 84.5 L69.5 87.5 L75 81"
        fill="none"
        stroke="#0E7C8A"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-data-selected:animate-draw [stroke-dasharray:1] [stroke-dashoffset:1]"
      />
      <circle
        cx="182"
        cy="116"
        r="17"
        fill="#96D962"
        stroke="#1E1E1C"
        strokeWidth="2"
      />
      <path
        pathLength={1}
        d="M174 116 L180 122 L191 110"
        fill="none"
        stroke="#1E1E1C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-data-selected:animate-draw [stroke-dasharray:1] [stroke-dashoffset:1]"
      />
      <g
        stroke="#1E1E1C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="78" cy="150" r="10" fill="#14CCDE" />
        <path
          d="M60 184 C60 170 68 163 78 163 C88 163 96 170 96 184 Z"
          fill="#14CCDE"
        />
        <circle cx="162" cy="150" r="10" fill="#96D962" />
        <path
          d="M144 184 C144 170 152 163 162 163 C172 163 180 170 180 184 Z"
          fill="#96D962"
        />
      </g>
      <g
        fill="#FFFFFF"
        stroke="#0E7C8A"
        strokeWidth="2.4"
        transform="rotate(-30 120 166)"
      >
        <rect x="103" y="160" width="20" height="12" rx="6" />
        <rect x="117" y="160" width="20" height="12" rx="6" />
      </g>
      <path
        d="M98 168 H104 M136 168 H142"
        stroke="#0E7C8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 4"
      />
    </svg>
  )
}
