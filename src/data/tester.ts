// Mock data for the logged-in tester. Replace with API data later.

export type ProjectStatus =
  | 'PENDING_NDA'
  | 'PENDING_PAYMENT'
  | 'FUNDED'
  | 'TESTING'
  | 'SUBMITTED'
  | 'DISPUTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'

export const statusLabels: Record<ProjectStatus, string> = {
  PENDING_NDA: '待簽署保密協議',
  PENDING_PAYMENT: '待付款',
  FUNDED: '代管中',
  TESTING: '測試中',
  SUBMITTED: '待驗收',
  DISPUTED: '爭議處理中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
  REFUNDED: '已退款',
}

export const tester = {
  name: '哇哩勒',
}

// Device type matches the tabs on the profile page: 手機／平板／電視／電腦／自訂
export const devices: {
  id: string
  type: 'phone' | 'tablet' | 'tv' | 'computer' | 'custom'
  name: string
  os: string
}[] = [
  { id: 'd1', type: 'phone', name: 'iPhone 15', os: 'iOS 18' },
  { id: 'd2', type: 'tablet', name: 'Galaxy Tab S9', os: 'Android 14' },
  { id: 'd3', type: 'computer', name: 'MacBook Air', os: 'macOS 15' },
  { id: 'd4', type: 'computer', name: '華碩筆電', os: 'Windows 11' },
  { id: 'd5', type: 'phone', name: 'Pixel 8', os: 'Android 15' },
  { id: 'd6', type: 'tablet', name: 'iPad Air', os: 'iPadOS 18' },
]

// Projects the tester has joined. For finished projects, `due` is the end date.
// needsAction: the tester has something to do (red "!" on the status, counted in the tab badge)
export const joinedProjects: {
  id: string
  name: string
  owner: string
  due: string
  devices: string
  status: ProjectStatus
  needsAction: boolean
}[] = [
  {
    id: 'p1',
    name: '電商 App 結帳回歸測試',
    owner: '好買股份有限公司',
    due: '2026/11/05',
    devices: 'iPhone SE',
    status: 'FUNDED',
    needsAction: false,
  },
  {
    id: 'p2',
    name: '會員中心改版易用性測試',
    owner: '樂活科技',
    due: '2026/11/08',
    devices: 'iPhone 15',
    status: 'TESTING',
    needsAction: true,
  },
  {
    id: 'p3',
    name: '保險試算網頁跨瀏覽器測試',
    owner: '安心保經',
    due: '2026/10/30',
    devices: 'Windows Chrome',
    status: 'SUBMITTED',
    needsAction: false,
  },
  {
    id: 'p4',
    name: '手遊新手教學體驗測試',
    owner: '星砂遊戲',
    due: '2026/10/20',
    devices: 'Galaxy Tab S12',
    status: 'COMPLETED',
    needsAction: false,
  },
  {
    id: 'p5',
    name: '旅遊訂房 App 搜尋測試',
    owner: '遊程旅行社',
    due: '2026/11/18',
    devices: 'iPhone 15',
    status: 'PENDING_NDA',
    needsAction: true,
  },
  {
    id: 'p6',
    name: '線上課程網站播放器測試',
    owner: '學無止境',
    due: '2026/11/20',
    devices: 'MacBook Air',
    status: 'PENDING_PAYMENT',
    needsAction: false,
  },
  {
    id: 'p7',
    name: '健身課程預約 App 測試',
    owner: '動力健康',
    due: '2026/11/30',
    devices: 'Galaxy Tab S9',
    status: 'TESTING',
    needsAction: true,
  },
]

// Projects that invited the tester and are waiting for a reply
export const invitedProjects = [
  {
    id: 'i1',
    name: '外送 App 訂單追蹤功能測試',
    owner: '快送科技',
    rating: 4.6,
    reviews: 12,
    category: '生活服務',
    pay: 'NT$ 1,600',
    replyBy: '2026/11/03',
    period: '2026/11/01–2026/11/20',
    place: '實地（臺北市）',
    devices: ['iPhone 15'],
    intro:
      '測試下單後的即時地圖、通知推播與訂單狀態，需要實際在戶外移動時操作。',
    requirements: ['需在臺北市內', '每次測試約 40 分鐘', '車馬費另計'],
  },
  {
    id: 'i2',
    name: '線上記帳網站跨瀏覽器測試',
    owner: '小帳本',
    rating: 4.2,
    reviews: 5,
    category: '金融',
    pay: 'NT$ 1,000',
    replyBy: '2026/11/05',
    period: '2026/11/03–2026/11/25',
    place: '遠端',
    devices: ['MacBook Air', 'Windows Chrome'],
    intro: '檢查新增帳目、匯出報表在不同瀏覽器的顯示與操作是否一致。',
    requirements: [
      'Safari、Chrome、Edge 都要測',
      '不需要真實帳戶資料，平台會提供測試帳號',
    ],
  },
]
