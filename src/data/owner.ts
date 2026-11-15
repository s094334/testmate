// Mock data shaped like the API (GET /api/auth/company and GET /api/auth/projects)

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
  // Recruiting deadline, not the test end date. Not shown on the card.
  endsAt: string
  // The latest engagement that is not CANCELLED, so CANCELLED never shows up here
  engagement: {
    id: string
    status:
      | 'PENDING_NDA'
      | 'PENDING_PAYMENT'
      | 'FUNDED'
      | 'TESTING'
      | 'SUBMITTED'
      | 'DISPUTED'
      | 'COMPLETED'
      | 'REFUNDED'
    testerName: string
  } | null
  createdAt: string
  // Front-end only for now: the API has not defined when an owner needs to act
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

// Turns the API fields into the three tags the owner sees
export function getOwnerStatus(
  project: OwnerProject
): 'recruiting' | 'testing' | 'ended' {
  // Owner's decision: a cancelled project looks the same as 已結束
  if (project.recruitmentStatus === 'cancelled') {
    return 'ended'
  }
  // Still looking for a tester: 招募中
  if (project.recruitmentStatus === 'recruiting') {
    return 'recruiting'
  }
  // Closed but nobody was chosen: 已結束 (assumption, not in the API doc)
  if (project.engagement === null) {
    return 'ended'
  }
  // Test finished and paid out: 已結束
  if (project.engagement.status === 'COMPLETED') {
    return 'ended'
  }
  // Money went back to the owner: 已結束 (assumption, not in the API doc)
  if (project.engagement.status === 'REFUNDED') {
    return 'ended'
  }
  // Everything else is 進行中. Owner's decision: PENDING_NDA, PENDING_PAYMENT
  // and FUNDED count too, along with TESTING, SUBMITTED and DISPUTED.
  return 'testing'
}
