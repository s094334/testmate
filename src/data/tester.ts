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
  // Payout bank account. null = not set yet
  payout: {
    bankCode: '822',
    branchCode: '0012',
    accountNumber: '123456781234',
    holderName: '哇哩勒',
  } as Payout | null,
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
    due: '2026/12/05',
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
  {
    id: 'p8',
    name: '寵物用品電商退貨流程測試',
    owner: '毛孩生活',
    due: '2026/11/15',
    devices: ['iPhone 15'],
    status: 'DISPUTED',
    needsAction: true,
  },
  {
    id: 'p9',
    name: '美食外送平台優惠券測試',
    owner: '飽飽外送',
    due: '2026/11/10',
    devices: ['Pixel 8'],
    status: 'CANCELLED',
    needsAction: false,
  },
  {
    id: 'p10',
    name: '智慧家電 App 配對測試',
    owner: '家居智聯',
    due: '2026/10/25',
    devices: ['iPad Air'],
    status: 'REFUNDED',
    needsAction: false,
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
    // ISO time with the offset; only while waiting for the owner to pay
    payDeadline?: string
    // Only after the owner has paid
    ownerName?: string
    ownerEmail?: string
    howToTest?: string
    successCriteria?: string
    // ISO times with the offset, each only in its own status:
    // TESTING, DISPUTED, COMPLETED (before the first rating)
    submitDeadline?: string
    disputeDeadline?: string
    rateDeadline?: string
    // SUBMITTED, COMPLETED
    submittedAt?: string
    paidAt?: string
  }
> = {
  p1: {
    rating: 4.5,
    reviews: 8,
    intro:
      '新版結帳流程上線前的回歸測試，確認加入購物車、優惠券、付款到訂單通知都正常。',
    requirements: [
      '每一項都要附上螢幕截圖',
      '使用平台提供的測試卡號，不需要真的付款',
    ],
    place: '遠端',
    startDate: '2026/11/01',
    endDate: '2026/11/05',
    pay: 'NT$ 1,200',
    ownerName: '王大明',
    ownerEmail: 'owner@haomai.example.com',
    howToTest:
      '加入購物車與修改數量\n套用優惠券後金額正確\n信用卡付款（測試卡號）\n訂單成立推播與 Email\n申請退貨流程',
    successCriteria:
      '5 個項目都能順利完成，金額與訂單通知正確。\n發現問題時附上截圖與重現步驟。',
  },
  p2: {
    rating: 4.8,
    reviews: 21,
    intro:
      '會員中心改版後的易用性測試，看第一次使用的人能不能順利找到訂單、修改個人資料和查看點數。',
    requirements: ['每項任務都要錄下操作畫面', '邊操作邊說出心裡的想法'],
    place: '遠端',
    startDate: '2026/11/01',
    endDate: '2026/11/08',
    pay: 'NT$ 1,500',
    ownerName: '林怡君',
    ownerEmail: 'ux@lohas.example.com',
    howToTest:
      '找到最近一筆訂單的物流狀態\n修改收件地址\n查看點數到期日\n綁定 LINE 帳號',
    successCriteria:
      '4 個任務都能在 3 分鐘內完成。\n卡住超過 1 分鐘的地方要說明原因。',
    submitDeadline: '2026-11-08T23:59:00+08:00',
  },
  p3: {
    rating: 4.1,
    reviews: 9,
    intro:
      '確認保費試算網頁在不同瀏覽器的顯示與計算結果一致，包含表單驗證和 PDF 下載。',
    requirements: ['每個瀏覽器都要截圖', '發現計算差異時寫下輸入的條件'],
    place: '遠端',
    startDate: '2026/10/24',
    endDate: '2026/10/30',
    pay: 'NT$ 800',
    ownerName: '陳志豪',
    ownerEmail: 'web@anxin.example.com',
    howToTest:
      '填寫試算表單並送出\n欄位未填時的錯誤提示\n試算結果金額\n下載試算結果 PDF',
    successCriteria:
      'Safari、Chrome、Edge 試算結果一致。\nPDF 內容與畫面上的金額相同。',
    submittedAt: '2026/10/30',
  },
  p4: {
    rating: 4.6,
    reviews: 14,
    intro:
      '從安裝到完成新手教學的第一次體驗，看教學說明是否清楚、會不會在哪一步卡住。',
    requirements: ['用全新帳號開始', '每個卡住的地方都要截圖並說明'],
    place: '遠端',
    startDate: '2026/10/14',
    endDate: '2026/10/20',
    pay: 'NT$ 1,000',
    ownerName: '張雅婷',
    ownerEmail: 'qa@starsand.example.com',
    howToTest: '下載並安裝遊戲\n建立角色\n完成新手教學第一章\n領取新手禮包',
    successCriteria: '從安裝到領取禮包全程不閃退。\n記下每一步花費的時間。',
    rateDeadline: '2026-11-27T23:59:00+08:00',
    paidAt: '2026/11/20',
  },
  p7: {
    rating: 4.4,
    reviews: 11,
    intro:
      '測試課程搜尋、預約與取消預約的流程，確認額滿、候補和提醒通知都正常。',
    requirements: ['預約與取消都要截圖', '平台會提供測試用的會員帳號'],
    place: '遠端',
    startDate: '2026/11/20',
    endDate: '2026/11/30',
    pay: 'NT$ 1,100',
    ownerName: '黃建宏',
    ownerEmail: 'app@powerfit.example.com',
    howToTest:
      '依日期與地點搜尋課程\n預約一堂課\n額滿課程加入候補\n取消預約\n上課前一小時的提醒通知',
    successCriteria:
      '預約、候補、取消都能完成，並收到對應通知。\n每個步驟附上截圖。',
    submitDeadline: '2026-11-30T23:59:00+08:00',
  },
  p8: {
    rating: 3.9,
    reviews: 7,
    intro:
      '測試退貨申請、上傳照片到退款進度通知的流程，確認每一步都能順利完成。',
    requirements: ['每一項都要附上螢幕截圖', '不需要真的寄回商品'],
    place: '遠端',
    startDate: '2026/11/08',
    endDate: '2026/11/15',
    pay: 'NT$ 1,300',
    ownerName: '李美玲',
    ownerEmail: 'service@maohai.example.com',
    howToTest: '從訂單申請退貨\n上傳商品照片\n選擇退款方式\n退款進度通知',
    successCriteria:
      '退貨申請能送出，退款進度通知正確。\n照片上傳失敗時要記下檔案大小與格式。',
    disputeDeadline: '2026-11-28T23:59:00+08:00',
  },
  p9: {
    rating: 4.0,
    reviews: 4,
    intro: '測試領取、套用優惠券和結帳金額，確認不同店家的優惠規則都正確。',
    requirements: ['使用平台提供的測試卡號，不需要真的付款'],
    place: '遠端',
    startDate: '2026/11/05',
    endDate: '2026/11/10',
    pay: 'NT$ 700',
  },
  p10: {
    rating: 3.6,
    reviews: 5,
    intro: '測試智慧插座與 App 的配對、定時開關和離線重新連線。',
    requirements: ['需要家中有 2.4GHz Wi-Fi', '平台會寄送測試用的智慧插座'],
    place: '遠端',
    startDate: '2026/10/18',
    endDate: '2026/10/25',
    pay: 'NT$ 1,400',
  },
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
  p6: {
    rating: 4.7,
    reviews: 15,
    intro:
      '測試課程影片的播放、暫停、倍速與字幕切換，確認換章節和重新整理後能接著上次的進度播放。',
    requirements: ['Safari、Chrome 都要測', '平台會提供已購買課程的測試帳號'],
    place: '遠端',
    startDate: '2026/11/28',
    endDate: '2026/12/05',
    pay: 'NT$ 900',
    payDeadline: '2026-11-27T23:59:00+08:00',
  },
}

// One row of 測試結果, all filled in by the tester.
// bugRef: the related bugs as typed by the tester, e.g. 01、03 (only when pass is false)
export type ReportItem = {
  title: string
  steps: string
  result: string
  pass: boolean | null
  bugRef: string
}

// 語言 uses location, original, languageIssue and suggestion;
// every other type uses title, env and steps
export type ReportBug = {
  id: string
  type: 'Bug' | '語言' | '建議' | '介面體驗' | '效能' | '其他'
  title: string
  env: string
  steps: string
  priority: '致命' | '嚴重' | '一般' | '輕微'
  frequency: '每次都會發生' | '偶爾才發生'
  location: string
  original: string
  languageIssue: '錯字' | '翻譯不自然' | '文字被截斷'
  suggestion: string
  files: string[]
}

// Saved report drafts, by project id. A TESTING project without one starts
// with one empty row and one empty bug.
export const reportDrafts: Record<
  string,
  { env: string; items: ReportItem[]; bugs: ReportBug[]; savedAt: string }
> = {
  p7: {
    env: '',
    items: [
      {
        title: '依日期與地點搜尋課程',
        steps: '選擇 11/25、信義區，搜尋瑜伽課程',
        result: '列出 6 堂課，時間與地點都正確',
        pass: true,
        bugRef: '',
      },
      {
        title: '預約一堂課',
        steps: '選一堂還有空位的課，按「預約」後再按「確認」',
        result: '按下確認後 App 閃退，重新開啟後沒有預約紀錄',
        pass: false,
        bugRef: '01、02',
      },
      {
        title: '額滿課程加入候補',
        steps: '',
        result: '',
        pass: null,
        bugRef: '',
      },
      {
        title: '取消預約',
        steps: '',
        result: '',
        pass: null,
        bugRef: '',
      },
      {
        title: '上課前一小時的提醒通知',
        steps: '',
        result: '',
        pass: null,
        bugRef: '',
      },
    ],
    bugs: [
      {
        id: 'b1',
        type: 'Bug',
        title: '確認預約後 App 閃退',
        env: 'Galaxy Tab S9、One UI 6、App 2.3.0',
        steps:
          '重現步驟：\n1. 進入任一課程頁\n2. 按「預約」，再按「確認」\n目前結果：App 閃退，沒有建立預約\n預期結果：顯示預約成功，並出現在「我的預約」',
        priority: '致命',
        frequency: '每次都會發生',
        location: '',
        original: '',
        languageIssue: '錯字',
        suggestion: '',
        files: ['crash-01.mp4'],
      },
      {
        id: 'b2',
        type: '語言',
        title: '',
        env: '',
        steps: '',
        priority: '輕微',
        frequency: '每次都會發生',
        location: '預約確認視窗',
        original: '確定要預約這堂課程程嗎？',
        languageIssue: '錯字',
        suggestion: '確定要預約這堂課程嗎？',
        files: ['confirm-dialog.png'],
      },
    ],
    savedAt: '2026/11/21 17:20',
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
