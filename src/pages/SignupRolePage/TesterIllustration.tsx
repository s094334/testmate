export function TesterIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="tablet:w-45 block h-auto w-24 max-w-full flex-none"
    >
      <circle cx="120" cy="100" r="86" fill="#96D962" fillOpacity="0.28" />
      <circle
        cx="120"
        cy="100"
        r="86"
        fill="none"
        stroke="#96D962"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <path
        d="M36 178 H204"
        stroke="#1E1E1C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g stroke="#1E1E1C" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x="98"
          y="40"
          width="94"
          height="136"
          rx="12"
          fill="#FFFFFF"
          strokeWidth="2.5"
        />
        <rect
          x="106"
          y="52"
          width="78"
          height="108"
          rx="4"
          fill="#F6F6F3"
          strokeWidth="1.5"
        />
        <circle cx="145" cy="168" r="2.5" fill="#1E1E1C" stroke="none" />
        <path d="M114 62 H134" strokeWidth="2" />
        <circle cx="174" cy="62" r="3" fill="none" strokeWidth="1.5" />
        <path
          d="M116 142 H174 M116 150 H150"
          stroke="#878680"
          strokeWidth="2"
        />
      </g>
      <circle
        cx="145"
        cy="102"
        r="22"
        fill="#FFFFFF"
        stroke="#3F7F22"
        strokeWidth="2"
      />
      <path
        pathLength={1}
        d="M134 102 L142 110 L157 93"
        fill="none"
        stroke="#3F7F22"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-data-selected:animate-draw [stroke-dasharray:1] [stroke-dashoffset:1]"
      />
      <g stroke="#1E1E1C" strokeLinecap="round" strokeLinejoin="round">
        <rect
          x="54"
          y="86"
          width="56"
          height="92"
          rx="10"
          fill="#FFFFFF"
          strokeWidth="2.5"
        />
        <rect
          x="60"
          y="98"
          width="44"
          height="66"
          rx="3"
          fill="#F6F6F3"
          strokeWidth="1.5"
        />
        <path d="M76 92 H88" strokeWidth="2" />
        <circle cx="82" cy="171" r="2" fill="#1E1E1C" stroke="none" />
        <rect
          x="66"
          y="106"
          width="9"
          height="9"
          rx="2"
          fill="#FFFFFF"
          strokeWidth="1.5"
        />
        <rect
          x="66"
          y="122"
          width="9"
          height="9"
          rx="2"
          fill="#FFFFFF"
          strokeWidth="1.5"
        />
        <rect
          x="66"
          y="138"
          width="9"
          height="9"
          rx="2"
          fill="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d="M80 110.5 H98 M80 126.5 H94 M80 142.5 H96"
          stroke="#878680"
          strokeWidth="2"
        />
      </g>
      <path
        pathLength={1}
        d="M67.5 110.5 L70 113 L74 108 M67.5 126.5 L70 129 L74 124"
        fill="none"
        stroke="#3F7F22"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-data-selected:animate-draw [stroke-dasharray:1] [stroke-dashoffset:1]"
      />
      <g stroke="#3F7F22" strokeWidth="2" strokeLinecap="round">
        <path d="M204 44 V56 M198 50 H210" />
        <path d="M40 70 V78 M36 74 H44" />
      </g>
      <circle cx="196" cy="84" r="3" fill="#96D962" />
    </svg>
  )
}
