// Mock data shaped like the API (GET /api/auth/company and GET /api/auth/projects)

import { type ProjectStatus } from '@/data/tester'

type Company = {
  realName: string
  email: string
  phone: string
  // name is the company name, not the person (that is realName)
  name: string
  taxId: string | null
  industryTag: { id: string; category: 'industry'; name: string }
  address: string
}

type OwnerProject = {
  id: string
  name: string
  summary: string
  details: { location: string; equipment: string; testPeriod: string }
  recruitmentStatus: 'recruiting' | 'closed' | 'cancelled'
  applicationCount: number
  endsAt: string
  // Same statuses as the tester side (the API never returns CANCELLED here)
  engagement: {
    id: string
    status: ProjectStatus
    testerName: string
  } | null
  createdAt: string
  needsAttention: boolean
}

export const owner: Company = {
  realName: '王大明',
  email: 'daming.wang@example.com',
  phone: '0922123456',
  name: '好買股份有限公司',
  taxId: '12345678',
  industryTag: { id: 'tag-industry-1', category: 'industry', name: '電商零售' },
  address: '臺北市信義區松仁路 100 號',
}

// Testers who applied to or were invited to a recruiting project, by project id.
// Names stay masked until the owner picks someone.
// applied: applied by themselves; noreply: invited, no answer yet; declined: the owner declined
export const recruitCandidates: Record<
  string,
  {
    id: string
    name: string
    initial: string
    rating: number
    reviews: number
    city: string
    years: string
    devices: string[]
    languages: string[]
    interests: string[]
    status: 'applied' | 'noreply' | 'declined'
    invitedAt?: string
  }[]
> = {
  o1: [
    {
      id: 'c1',
      name: '陳Ｏ文',
      initial: '陳',
      rating: 4.6,
      reviews: 7,
      city: '臺北市',
      years: '1–2 年',
      devices: ['Pixel 8', 'MacBook Air'],
      languages: ['中文', '英文', '韓文'],
      interests: ['Netflix', 'Spotify', '科技 3C'],
      status: 'applied',
    },
    {
      id: 'c2',
      name: '王Ｏ明',
      initial: '王',
      rating: 4.5,
      reviews: 12,
      city: '桃園市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Pixel 8'],
      languages: ['中文', '英文', '日語'],
      interests: ['手機遊戲', '線上遊戲', '動漫'],
      status: 'applied',
    },
    {
      id: 'c3',
      name: '周Ｏ豪',
      initial: '周',
      rating: 4.2,
      reviews: 5,
      city: '新竹市',
      years: '1–2 年',
      devices: ['Windows 筆電'],
      languages: ['中文', '英文'],
      interests: ['跑步', '科技 3C'],
      status: 'noreply',
      invitedAt: '2026/10/28',
    },
    {
      id: 'c4',
      name: '吳Ｏ宏',
      initial: '吳',
      rating: 4.3,
      reviews: 4,
      city: '臺中市',
      years: '1–2 年',
      devices: ['Pixel 7'],
      languages: ['中文', '英文'],
      interests: ['球類運動', '手機遊戲'],
      status: 'declined',
    },
  ],
}

export const ownerProjects: OwnerProject[] = [
  {
    id: 'o1',
    name: '多國語系 App 測試',
    summary: '確認英文、日語、韓文、泰文四種語言的翻譯與排版。',
    details: {
      location: '遠端',
      equipment: '自備手機',
      testPeriod: '2026/11/20–2026/12/05',
    },
    recruitmentStatus: 'recruiting',
    applicationCount: 3,
    endsAt: '2026-11-19T15:59:59.000Z',
    engagement: null,
    createdAt: '2026-11-09T02:00:00.000Z',
    needsAttention: true,
  },
  {
    id: 'o4',
    name: '會員集點功能測試',
    summary: '集點、兌換與點數到期提醒的完整流程測試。',
    details: {
      location: '遠端',
      equipment: '自備手機',
      testPeriod: '2026/11/01–2026/11/25',
    },
    recruitmentStatus: 'closed',
    applicationCount: 4,
    endsAt: '2026-10-31T15:59:59.000Z',
    engagement: { id: 'e4', status: 'TESTING', testerName: '張家豪' },
    createdAt: '2026-10-15T02:00:00.000Z',
    needsAttention: false,
  },
  {
    id: 'o2',
    name: '相簿備份 App 測試',
    summary: '自動備份、大量上傳與相簿分享的穩定度測試。',
    details: {
      location: '遠端',
      equipment: '自備手機',
      testPeriod: '2026/10/01–2026/11/15',
    },
    recruitmentStatus: 'closed',
    applicationCount: 5,
    endsAt: '2026-09-30T15:59:59.000Z',
    engagement: { id: 'e2', status: 'FUNDED', testerName: '陳志明' },
    createdAt: '2026-09-15T02:00:00.000Z',
    needsAttention: true,
  },
  {
    id: 'o3',
    name: '官網改版跨瀏覽器測試',
    summary: '新版官網在 Safari、Chrome、Edge 的顯示與操作。',
    details: {
      location: '遠端',
      equipment: '自備電腦',
      testPeriod: '2026/09/01–2026/09/20',
    },
    recruitmentStatus: 'closed',
    applicationCount: 2,
    endsAt: '2026-08-31T15:59:59.000Z',
    engagement: { id: 'e3', status: 'COMPLETED', testerName: '林小美' },
    createdAt: '2026-08-15T02:00:00.000Z',
    needsAttention: false,
  },
]
