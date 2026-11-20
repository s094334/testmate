// Avatar (2026/11/20, style C2): white circle, role-colour ring, and a geometric
// shape in the role's strong colour. Only the shape is saved (users.avatar_shape);
// the colours come from the role.
import type { ReactNode } from 'react'
import type { AvatarShape } from '../../shared/avatar-shapes'

// For the menu where people change their avatar
export const AVATAR_SHAPE_NAMES: Record<AvatarShape, string> = {
  scallop: '波浪花',
  burst: '鋸齒星',
  sparkle: '四角星',
  clover: '幸運草',
  asterisk: '米字',
  seal: '圓章',
  leaf: '葉形',
  halves: '雙半圓',
  octastar: '八角星',
  petals: '六瓣花',
}

// The theme colours, so changing them in theme.css changes every avatar
const ROLE_COLORS = {
  owner: {
    ring: 'var(--color-owner)',
    shape: 'var(--color-owner-strong)',
  },
  tester: {
    ring: 'var(--color-tester)',
    shape: 'var(--color-tester-strong)',
  },
}

// Each shape is drawn in a 100×100 box and filled with currentColor
const SHAPES: Record<AvatarShape, ReactNode> = {
  // 波浪花
  scallop: (
    <polygon
      points="50.00,21.00 51.51,21.11 53.00,21.42 54.44,21.95 55.81,22.68 57.07,23.63 58.18,24.82 59.06,26.39 60.29,26.90 62.02,26.41 63.65,26.36 65.21,26.58 66.69,27.02 68.08,27.67 69.36,28.50 70.51,29.49 71.50,30.64 72.33,31.92 72.98,33.31 73.42,34.79 73.64,36.35 73.59,37.98 73.10,39.71 73.61,40.94 75.18,41.82 76.37,42.93 77.32,44.19 78.05,45.56 78.58,47.00 78.89,48.49 79.00,50.00 78.89,51.51 78.58,53.00 78.05,54.44 77.32,55.81 76.37,57.07 75.18,58.18 73.61,59.06 73.10,60.29 73.59,62.02 73.64,63.65 73.42,65.21 72.98,66.69 72.33,68.08 71.50,69.36 70.51,70.51 69.36,71.50 68.08,72.33 66.69,72.98 65.21,73.42 63.65,73.64 62.02,73.59 60.29,73.10 59.06,73.61 58.18,75.18 57.07,76.37 55.81,77.32 54.44,78.05 53.00,78.58 51.51,78.89 50.00,79.00 48.49,78.89 47.00,78.58 45.56,78.05 44.19,77.32 42.93,76.37 41.82,75.18 40.94,73.61 39.71,73.10 37.98,73.59 36.35,73.64 34.79,73.42 33.31,72.98 31.92,72.33 30.64,71.50 29.49,70.51 28.50,69.36 27.67,68.08 27.02,66.69 26.58,65.21 26.36,63.65 26.41,62.02 26.90,60.29 26.39,59.06 24.82,58.18 23.63,57.07 22.68,55.81 21.95,54.44 21.42,53.00 21.11,51.51 21.00,50.00 21.11,48.49 21.42,47.00 21.95,45.56 22.68,44.19 23.63,42.93 24.82,41.82 26.39,40.94 26.90,39.71 26.41,37.98 26.36,36.35 26.58,34.79 27.02,33.31 27.67,31.92 28.50,30.64 29.49,29.49 30.64,28.50 31.92,27.67 33.31,27.02 34.79,26.58 36.35,26.36 37.98,26.41 39.71,26.90 40.94,26.39 41.82,24.82 42.93,23.63 44.19,22.68 45.56,21.95 47.00,21.42 48.49,21.11"
      fill="currentColor"
    />
  ),
  // 鋸齒星
  burst: (
    <polygon
      points="50.00,21.00 54.92,31.65 64.50,24.89 63.44,36.56 75.11,35.50 68.35,45.08 79.00,50.00 68.35,54.92 75.11,64.50 63.44,63.44 64.50,75.11 54.92,68.35 50.00,79.00 45.08,68.35 35.50,75.11 36.56,63.44 24.89,64.50 31.65,54.92 21.00,50.00 31.65,45.08 24.89,35.50 36.56,36.56 35.50,24.89 45.08,31.65"
      fill="currentColor"
    />
  ),
  // 四角星
  sparkle: (
    <path
      d="M50 20 Q54 46 80 50 Q54 54 50 80 Q46 54 20 50 Q46 46 50 20 Z"
      fill="currentColor"
    />
  ),
  // 幸運草
  clover: (
    <>
      <circle cx="50" cy="37" r="12" fill="currentColor" />
      <circle cx="63" cy="50" r="12" fill="currentColor" />
      <circle cx="50" cy="63" r="12" fill="currentColor" />
      <circle cx="37" cy="50" r="12" fill="currentColor" />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
    </>
  ),
  // 米字
  asterisk: (
    <>
      <line
        x1="76.00"
        y1="50.00"
        x2="24.00"
        y2="50.00"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="68.38"
        y1="68.38"
        x2="31.62"
        y2="31.62"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="50.00"
        y1="76.00"
        x2="50.00"
        y2="24.00"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="31.62"
        y1="68.38"
        x2="68.38"
        y2="31.62"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </>
  ),
  // 圓章
  seal: (
    <polygon
      points="50.00,22.00 53.75,26.30 58.65,23.37 60.90,28.62 66.46,27.35 66.97,33.03 72.65,33.54 71.38,39.10 76.63,41.35 73.70,46.25 78.00,50.00 73.70,53.75 76.63,58.65 71.38,60.90 72.65,66.46 66.97,66.97 66.46,72.65 60.90,71.38 58.65,76.63 53.75,73.70 50.00,78.00 46.25,73.70 41.35,76.63 39.10,71.38 33.54,72.65 33.03,66.97 27.35,66.46 28.62,60.90 23.37,58.65 26.30,53.75 22.00,50.00 26.30,46.25 23.37,41.35 28.62,39.10 27.35,33.54 33.03,33.03 33.54,27.35 39.10,28.62 41.35,23.37 46.25,26.30"
      fill="currentColor"
    />
  ),
  // 葉形
  leaf: (
    <path
      d="M27 73 L27 50 A23 23 0 0 1 50 27 L73 27 L73 50 A23 23 0 0 1 50 73 Z"
      fill="currentColor"
    />
  ),
  // 雙半圓
  halves: (
    <>
      <path d="M25 48 A25 25 0 0 1 75 48 Z" fill="currentColor" />
      <path d="M25 54 A25 25 0 0 0 75 54 Z" fill="currentColor" />
    </>
  ),
  // 八角星
  octastar: (
    <polygon
      points="50.00,21.00 56.89,33.37 70.51,29.49 66.63,43.11 79.00,50.00 66.63,56.89 70.51,70.51 56.89,66.63 50.00,79.00 43.11,66.63 29.49,70.51 33.37,56.89 21.00,50.00 33.37,43.11 29.49,29.49 43.11,33.37"
      fill="currentColor"
    />
  ),
  // 六瓣花
  petals: (
    <>
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(0 50 50)"
        fill="currentColor"
      />
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(60 50 50)"
        fill="currentColor"
      />
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(120 50 50)"
        fill="currentColor"
      />
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(180 50 50)"
        fill="currentColor"
      />
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(240 50 50)"
        fill="currentColor"
      />
      <ellipse
        cx="50"
        cy="34"
        rx="8"
        ry="15"
        transform="rotate(300 50 50)"
        fill="currentColor"
      />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
    </>
  ),
}

// size: 96 profile page, 64 project cards and reviews, 48 recommended QA and
// invite lists, 40 header account button, 32 dropdowns and small lists.
// label: only when no name is shown next to it (read by screen readers);
// next to a name, leave it out and the avatar is decoration.
export function Avatar({
  shape,
  role,
  size = 40,
  label,
}: {
  shape: AvatarShape
  role: 'owner' | 'tester'
  size?: 96 | 64 | 48 | 40 | 32
  label?: string
}) {
  return (
    <>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="block flex-none"
      >
        <circle
          cx="50"
          cy="50"
          r="46.5"
          fill="var(--color-surface)"
          stroke={ROLE_COLORS[role].ring}
          strokeWidth="7"
        />
        <g
          transform="translate(50 50) scale(0.88) translate(-50 -50)"
          color={ROLE_COLORS[role].shape}
        >
          {SHAPES[shape] ?? SHAPES.sparkle}
        </g>
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </>
  )
}
