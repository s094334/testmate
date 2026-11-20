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

export type Payout = {
  bankCode: string
  branchCode: string
  accountNumber: string
  holderName: string
}

export const tester = {
  name: '哇哩勒',
  // The login account: shown read-only on the profile page
  email: 'walile.test@gmail.com',
  city: '臺北市',
  phone: '0912-345-678',
  languages: ['中文', '英文', '日文'],
  // Subset of languages
  nativeLanguages: ['中文'],
  interests: [
    '手機遊戲',
    'Netflix',
    '巴哈姆特動畫瘋',
    'Spotify',
    '咖啡／茶飲',
    '科技 3C',
  ],
  experience: {
    hasExperience: 'yes' as 'yes' | 'no',
    jobs: [{ years: '1–2 年', company: '好買股份有限公司' }],
  },
  // Payout bank account. null = not set yet. Once saved it looks like:
  // { bankCode: '822', branchCode: '0012', accountNumber: '123456781234', holderName: '哇哩勒' }
  payout: {
    bankCode: '822',
    branchCode: '0012',
    accountNumber: '123456781234',
    holderName: '哇哩勒',
  },
  // null as Payout | null,
}

// Device type matches the tabs on the profile page: 手機／平板／電視／電腦／自訂
// name: the model, or the brand when it has no models (e.g. Windows); for 自訂 what the tester typed
// os: the system version; may be '' for 自訂
// brand, model: what was picked on PickDeviceForm, kept apart for the API.
// model is '' for a brand without models (e.g. Windows), or 不限型號.
export type Device = {
  id: string
  type: 'phone' | 'tablet' | 'tv' | 'computer' | 'custom'
  name: string
  os: string
  brand?: string
  model?: string
}

export const devices: Device[] = [
  { id: 'd1', type: 'phone', name: 'iPhone 15', os: 'iOS 18（18.7.11）' },
  {
    id: 'd2',
    type: 'tablet',
    name: 'Galaxy Tab S9',
    os: 'One UI 6（Android 14）',
  },
  {
    id: 'd3',
    type: 'computer',
    name: 'MacBook Air 13 吋 M2（2022）',
    os: 'macOS 15 Sequoia（15.8.2）',
  },
  { id: 'd4', type: 'custom', name: '華碩筆電', os: 'Windows 11 24H2' },
  { id: 'd5', type: 'phone', name: 'Pixel 8', os: 'Android 15' },
  {
    id: 'd6',
    type: 'tablet',
    name: 'iPad Air（第 5 代）',
    os: 'iPadOS 18（18.7.11）',
  },
]

// Projects the tester has joined. For finished projects, `due` is the end date.
// needsAction: the tester has something to do (red "!" on the status, counted in the tab badge)
export const joinedProjects: {
  id: string
  name: string
  owner: string
  due: string
  devices: string[]
  status: ProjectStatus
  needsAction: boolean
}[] = [
  {
    id: 'p1',
    name: '電商 App 結帳回歸測試',
    owner: '好買股份有限公司',
    due: '2026/11/05',
    devices: ['iPhone SE'],
    status: 'FUNDED',
    needsAction: false,
  },
  {
    id: 'p2',
    name: '會員中心改版易用性測試',
    owner: '樂活科技',
    due: '2026/11/08',
    devices: ['iPhone 15'],
    status: 'TESTING',
    needsAction: true,
  },
  {
    id: 'p3',
    name: '保險試算網頁跨瀏覽器測試',
    owner: '安心保經',
    due: '2026/10/30',
    devices: ['Windows Chrome'],
    status: 'SUBMITTED',
    needsAction: false,
  },
  {
    id: 'p4',
    name: '手遊新手教學體驗測試',
    owner: '星砂遊戲',
    due: '2026/10/20',
    devices: ['Galaxy Tab S12'],
    status: 'COMPLETED',
    needsAction: false,
  },
  {
    id: 'p5',
    name: '旅遊訂房 App 搜尋測試',
    owner: '遊程旅行社',
    due: '2026/11/18',
    devices: ['iPhone 15'],
    status: 'PENDING_NDA',
    needsAction: true,
  },
  {
    id: 'p6',
    name: '線上課程網站播放器測試',
    owner: '學無止境',
    due: '2026/11/20',
    devices: ['MacBook Air'],
    status: 'PENDING_PAYMENT',
    needsAction: false,
  },
  {
    id: 'p7',
    name: '健身課程預約 App 測試',
    owner: '動力健康',
    due: '2026/11/30',
    devices: ['Galaxy Tab S9'],
    status: 'TESTING',
    needsAction: true,
  },
]

// Project page details for joined projects, by project id
export const joinedProjectDetails: Record<
  string,
  {
    rating: number
    reviews: number
    intro: string
    requirements: string[]
    place: string
    startDate: string
    endDate: string
    pay: string
    ndaDeadline?: string
  }
> = {
  p5: {
    rating: 4.3,
    reviews: 6,
    intro:
      '測試搜尋飯店、篩選日期與人數、查看房型到加入收藏的流程，確認搜尋結果正確、操作順暢。',
    requirements: [
      '每一項都要附上螢幕截圖',
      '不需要真的訂房，測試到付款頁前即可',
    ],
    place: '遠端',
    startDate: '2026/11/10',
    endDate: '2026/11/18',
    pay: 'NT$ 1,200',
    ndaDeadline: '2026-11-23T23:59:00+08:00',
  },
}

export const invitedProjects = [
  {
    id: 'i1',
    name: '外送 App 訂單追蹤功能測試',
    owner: '快送科技',
    rating: 4.6,
    reviews: 12,
    category: '生活服務',
    pay: 'NT$ 1,600',
    replyBy: '2026/12/08',
    startDate: '2026/12/20',
    endDate: '2027/01/20',
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
    startDate: '2026/11/03',
    endDate: '2026/11/25',
    place: '遠端',
    devices: ['MacBook Air', 'Windows Chrome'],
    intro: '檢查新增帳目、匯出報表在不同瀏覽器的顯示與操作是否一致。',
    requirements: [
      'Safari、Chrome、Edge 都要測',
      '不需要真實帳戶資料，平台會提供測試帳號',
    ],
  },
]
