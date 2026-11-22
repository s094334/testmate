// Mock data shaped like the API (GET /api/auth/company and GET /api/auth/projects)

import { type ProjectStatus } from '@/data/tester'
import type { AvatarShape } from '../../shared/avatar-shapes'

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

export type OwnerProject = {
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

// applied: applied by themselves; noreply: invited, no answer yet; declined: the owner declined
export type RecruitCandidate = {
  id: string
  name: string
  fullName: string
  email: string
  avatarShape: AvatarShape
  rating: number
  reviews: number
  city: string
  years: string
  devices: string[]
  languages: string[]
  interests: string[]
  status: 'interest' | 'applied' | 'noreply' | 'declined'
  invitedAt?: string
}

// The picked tester, shown unmasked on 測試進度
export type EngagedTester = Pick<
  RecruitCandidate,
  | 'fullName'
  | 'email'
  | 'avatarShape'
  | 'rating'
  | 'reviews'
  | 'city'
  | 'years'
  | 'devices'
  | 'languages'
>

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
export const recruitCandidates: Record<string, RecruitCandidate[]> = {
  o1: [
    {
      id: 'c5',
      name: '劉Ｏ君',
      fullName: '劉怡君',
      email: 'yichun.liu@example.com',
      avatarShape: 'petals',
      rating: 4.7,
      reviews: 15,
      city: '臺北市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Pixel 8'],
      languages: ['中文', '日文'],
      interests: ['旅遊', 'Netflix'],
      status: 'interest',
    },
    {
      id: 'c1',
      name: '陳Ｏ文',
      fullName: '陳大文',
      email: 'tawen.chen@example.com',
      avatarShape: 'clover',
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
      fullName: '王小明',
      email: 'hsiaoming.wang@example.com',
      avatarShape: 'burst',
      rating: 4.5,
      reviews: 12,
      city: '桃園市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Pixel 8'],
      languages: ['中文', '英文', '日文'],
      interests: ['手機遊戲', '線上遊戲', '動漫'],
      status: 'applied',
    },
    {
      id: 'c3',
      name: '周Ｏ豪',
      fullName: '周志豪',
      email: 'chihhao.chou@example.com',
      avatarShape: 'leaf',
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
      fullName: '吳建宏',
      email: 'chienhung.wu@example.com',
      avatarShape: 'seal',
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

// Testers the platform suggests for a recruiting project, by project id.
// Inviting one moves them into recruitCandidates as noreply.
export const recommendedTesters: Record<
  string,
  {
    id: string
    name: string
    fullName: string
    email: string
    avatarShape: AvatarShape
    rating: number
    reviews: number
    city: string
    years: string
    devices: string[]
    languages: string[]
    interests: string[]
  }[]
> = {
  o1: [
    {
      id: 'r1',
      name: '許Ｏ明',
      fullName: '許志明',
      email: 'chihming.hsu@example.com',
      avatarShape: 'octastar',
      rating: 5.0,
      reviews: 27,
      city: '新北市',
      years: '5 年以上',
      devices: ['iPhone 16', 'Galaxy S24'],
      languages: ['中文', '英文', '韓文', '泰文'],
      interests: ['科技 3C', 'AI 工具', '理財投資'],
    },
    {
      id: 'r2',
      name: '蔡Ｏ珊',
      fullName: '蔡佩珊',
      email: 'peishan.tsai@example.com',
      avatarShape: 'scallop',
      rating: 4.6,
      reviews: 11,
      city: '高雄市',
      years: '3–5 年',
      devices: ['iPhone 15 Pro'],
      languages: ['中文', '英文', '日文'],
      interests: ['美食料理', '攝影'],
    },
  ],
}

export const ownerProjects: OwnerProject[] = [
  {
    id: 'o1',
    name: '多國語系 App 測試',
    summary: '確認英文、日文、韓文、泰文四種語言的翻譯與排版。',
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
    id: 'o5',
    name: '線上課程網站播放器測試',
    summary: '影片播放、倍速與字幕切換，以及換章節後接著上次的進度播放。',
    details: {
      location: '遠端',
      equipment: '自備電腦',
      testPeriod: '2026/11/28–2026/12/05',
    },
    recruitmentStatus: 'closed',
    applicationCount: 3,
    endsAt: '2026-11-20T15:59:59.000Z',
    engagement: { id: 'e5', status: 'PENDING_PAYMENT', testerName: '哇哩勒' },
    createdAt: '2026-11-10T02:00:00.000Z',
    needsAttention: true,
  },
  {
    id: 'o2',
    name: '電商 App 結帳回歸測試',
    summary: '新版結帳流程的回歸測試，從加入購物車、優惠券、付款到訂單通知。',
    details: {
      location: '遠端',
      equipment: '自備手機',
      testPeriod: '2026/11/01–2026/11/05',
    },
    recruitmentStatus: 'closed',
    applicationCount: 5,
    endsAt: '2026-10-25T15:59:59.000Z',
    engagement: { id: 'e2', status: 'FUNDED', testerName: '哇哩勒' },
    createdAt: '2026-10-15T02:00:00.000Z',
    needsAttention: true,
  },
  {
    id: 'o4',
    name: '會員中心改版易用性測試',
    summary: '第一次使用的人能不能順利找到訂單、修改個人資料和查看點數。',
    details: {
      location: '遠端',
      equipment: '自備手機',
      testPeriod: '2026/11/01–2026/11/08',
    },
    recruitmentStatus: 'closed',
    applicationCount: 4,
    endsAt: '2026-10-25T15:59:59.000Z',
    engagement: { id: 'e4', status: 'TESTING', testerName: '哇哩勒' },
    createdAt: '2026-10-12T02:00:00.000Z',
    needsAttention: true,
  },
  {
    id: 'o6',
    name: '保險試算網頁跨瀏覽器測試',
    summary: '保費試算網頁在不同瀏覽器的顯示、計算結果與 PDF 下載。',
    details: {
      location: '遠端',
      equipment: '自備電腦',
      testPeriod: '2026/10/24–2026/10/30',
    },
    recruitmentStatus: 'closed',
    applicationCount: 2,
    endsAt: '2026-10-18T15:59:59.000Z',
    engagement: { id: 'e6', status: 'SUBMITTED', testerName: '哇哩勒' },
    createdAt: '2026-10-05T02:00:00.000Z',
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

export type EngagementDetails = {
  tester: EngagedTester
  // PENDING_PAYMENT
  ndaSignedAt?: string
  // TESTING. submitDeadline is an ISO time with the offset; past it the report is overdue
  startedAt?: string
  submitDeadline?: string
  // SUBMITTED
  submittedAt?: string
}

// What 測試進度 shows for a project with an engagement, by project id.
// o5, o2, o4 and o6 are the tester's p6, p1, p2 and p3 seen from the owner side.
export const ownerEngagementDetails: Record<string, EngagementDetails> = {
  o5: {
    tester: {
      fullName: '哇哩勒',
      email: 'walile.test@gmail.com',
      avatarShape: 'sparkle',
      rating: 4.8,
      reviews: 18,
      city: '臺北市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Galaxy Tab S9'],
      languages: ['中文', '英文', '日文'],
    },
    ndaSignedAt: '2026/11/24',
  },
  o2: {
    tester: {
      fullName: '哇哩勒',
      email: 'walile.test@gmail.com',
      avatarShape: 'sparkle',
      rating: 4.8,
      reviews: 18,
      city: '臺北市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Galaxy Tab S9'],
      languages: ['中文', '英文', '日文'],
    },
  },
  o4: {
    tester: {
      fullName: '哇哩勒',
      email: 'walile.test@gmail.com',
      avatarShape: 'sparkle',
      rating: 4.8,
      reviews: 18,
      city: '臺北市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Galaxy Tab S9'],
      languages: ['中文', '英文', '日文'],
    },
    startedAt: '2026/11/01',
    submitDeadline: '2026-11-08T23:59:00+08:00',
  },
  o6: {
    tester: {
      fullName: '哇哩勒',
      email: 'walile.test@gmail.com',
      avatarShape: 'sparkle',
      rating: 4.8,
      reviews: 18,
      city: '臺北市',
      years: '1–2 年',
      devices: ['iPhone 15', 'Galaxy Tab S9'],
      languages: ['中文', '英文', '日文'],
    },
    submittedAt: '2026/10/30',
  },
  o3: {
    tester: {
      fullName: '林小美',
      email: 'hsiaomei.lin@example.com',
      avatarShape: 'halves',
      rating: 4.4,
      reviews: 3,
      city: '臺南市',
      years: '1–2 年',
      devices: ['iPhone 13'],
      languages: ['中文', '英文'],
    },
  },
}

// What 專案資訊 shows on top of ownerProjects, by project id
export const ownerProjectInfo: Record<
  string,
  {
    platforms: string[]
    languages: string[]
    pay: string
    howToTest: string
    successCriteria: string
    specialRequirements: string
  }
> = {
  o1: {
    platforms: ['iOS', 'Android'],
    languages: ['英文', '日文', '韓文', '泰文'],
    pay: 'NT$ 1,200',
    howToTest:
      '1. 下載測試版 App，把手機語系依序切換成英文、日文、韓文、泰文。\n' +
      '2. 每種語言都走過註冊、首頁、商品頁、購物車與結帳流程。\n' +
      '3. 遇到翻譯錯誤、文字被截斷或排版跑掉的畫面，截圖並記下所在頁面。',
    successCriteria:
      '1. 四種語言都完成從註冊到結帳的完整流程。\n' +
      '2. 每個問題都附上截圖、所在頁面與裝置型號。\n',
    specialRequirements:
      '1. iOS 與 Android 都要測到，每種語言至少用其中一種測過。\n' +
      '2. 截圖請保留完整畫面，不要裁切。',
  },
}
