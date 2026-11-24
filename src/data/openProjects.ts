// Mock data for 搜尋專案: projects still recruiting that match the tester's device types.
// The API filters by device type, so a TV project never shows for a tester without a TV.

export type OpenProject = {
  id: string
  name: string
  owner: string
  rating: number
  reviews: number
  category: string
  pay: string
  // The application deadline is the day testing starts
  startDate: string
  endDate: string
  place: string
  devices: { name: string; platform: 'iOS' | 'Android' | 'macOS' | 'Windows' }[]
  intro: string
  requirements: string[]
}

export const openProjects: OpenProject[] = [
  {
    id: 'r1',
    name: '公式計算小工具',
    owner: '數感工作室',
    rating: 4.8,
    reviews: 9,
    category: '軟體與 SaaS',
    pay: 'NT$ 1,200',
    startDate: '2026/11/25',
    endDate: '2026/12/25',
    place: '遠端',
    devices: [
      { name: 'Windows', platform: 'Windows' },
      { name: 'Mac', platform: 'macOS' },
    ],
    intro:
      '一個幫業務快速算報價的網頁小工具，想確認各種公式組合會不會算錯、按鈕會不會卡住。',
    requirements: [
      '需要使用 Chrome 或 Safari 最新版',
      '每項測試請附上輸入的數字和結果截圖',
    ],
  },
  {
    id: 'r2',
    name: '密室逃脫遊戲',
    owner: '謎境互動',
    rating: 4.6,
    reviews: 12,
    category: '遊戲',
    pay: 'NT$ 1,500',
    startDate: '2026/11/27',
    endDate: '2026/12/08',
    place: '遠端',
    devices: [{ name: 'iPhone', platform: 'iOS' }],
    intro:
      '一款解謎手機遊戲的前三關，請從新手教學玩到第三關結束，回報卡關、提示不清楚和閃退的地方。',
    requirements: [
      'iOS 18 以上',
      '需要錄下第一次遊玩的螢幕畫面',
      '不能事先看攻略',
    ],
  },
  {
    id: 'r3',
    name: '外送 App 訂單追蹤測試',
    owner: '快送科技',
    rating: 4.4,
    reviews: 21,
    category: '生活服務',
    pay: 'NT$ 1,600',
    startDate: '2026/11/28',
    endDate: '2026/12/20',
    place: '實地（臺北市）',
    devices: [{ name: 'iPhone', platform: 'iOS' }],
    intro:
      '測試下單後的即時地圖、通知推播與訂單狀態，需要實際在戶外移動時操作。',
    requirements: ['需在臺北市內', '每次測試約 40 分鐘', '車馬費另計'],
  },
  {
    id: 'r4',
    name: '線上記帳網站跨瀏覽器測試',
    owner: '小帳本',
    rating: 4.2,
    reviews: 5,
    category: '金融保險',
    pay: 'NT$ 1,000',
    startDate: '2026/11/30',
    endDate: '2026/12/15',
    place: '遠端',
    devices: [
      { name: 'Mac', platform: 'macOS' },
      { name: 'Windows', platform: 'Windows' },
    ],
    intro: '檢查新增帳目、匯出報表在不同瀏覽器的顯示與操作是否一致。',
    requirements: [
      'Safari、Chrome、Edge 都要測',
      '不需要真實帳戶資料，平台會提供測試帳號',
    ],
  },
  {
    id: 'r5',
    name: '健身課程預約 App 測試',
    owner: '動力健康',
    rating: 4.7,
    reviews: 14,
    category: '醫療健康',
    pay: 'NT$ 1,300',
    startDate: '2026/12/01',
    endDate: '2026/12/20',
    place: '遠端',
    devices: [{ name: 'Android 手機', platform: 'Android' }],
    intro:
      '從註冊、選課、付款到取消預約，走完整個流程，特別注意通知時間有沒有錯。',
    requirements: ['Android 14 以上', '有健身習慣者優先'],
  },
  {
    id: 'r6',
    name: '寵物用品電商結帳流程測試',
    owner: '毛孩好物',
    rating: 4.3,
    reviews: 10,
    category: '電商零售',
    pay: 'NT$ 900',
    startDate: '2026/12/02',
    endDate: '2026/12/18',
    place: '遠端',
    devices: [
      { name: 'iPhone', platform: 'iOS' },
      { name: 'Android 手機', platform: 'Android' },
    ],
    intro: '從加入購物車、使用優惠券到結帳，確認金額計算與付款頁面正確。',
    requirements: ['有養寵物者優先', '不需要真的付款，使用測試卡號'],
  },
  {
    id: 'r7',
    name: '平板繪本閱讀 App 測試',
    owner: '小樹出版',
    rating: 4.9,
    reviews: 3,
    category: '教育',
    pay: 'NT$ 1,100',
    startDate: '2026/12/04',
    endDate: '2026/12/24',
    place: '遠端',
    devices: [
      { name: 'iPad', platform: 'iOS' },
      { name: 'Android 平板', platform: 'Android' },
    ],
    intro: '測試繪本翻頁、朗讀與家長設定，確認在不同平板尺寸下排版正常。',
    requirements: ['家中有學齡前或國小孩童者優先', '需同時測試直向與橫向'],
  },
  {
    id: 'r8',
    name: '飯店訂房網站比價測試',
    owner: '遊程旅行社',
    rating: 4.5,
    reviews: 6,
    category: '生活服務',
    pay: 'NT$ 1,400',
    startDate: '2026/12/06',
    endDate: '2026/12/22',
    place: '遠端',
    devices: [
      { name: 'iPhone', platform: 'iOS' },
      { name: 'Android 手機', platform: 'Android' },
    ],
    intro: '測試依日期、人數與價格篩選住宿，確認搜尋結果和地圖顯示一致。',
    requirements: ['iOS 17 或 Android 13 以上', '每個篩選條件都要截圖'],
  },
  {
    id: 'r9',
    name: '記帳 App 小工具測試',
    owner: '小帳本',
    rating: 4.2,
    reviews: 5,
    category: '金融保險',
    pay: 'NT$ 800',
    startDate: '2026/12/08',
    endDate: '2026/12/15',
    place: '遠端',
    devices: [{ name: 'iPhone', platform: 'iOS' }],
    intro: '測試桌面小工具的快速記帳、分類與每日提醒。',
    requirements: ['iOS 18 以上', '連續使用 3 天'],
  },
  {
    id: 'r10',
    name: '藥局預約網站無障礙測試',
    owner: '安心藥局',
    rating: 4.8,
    reviews: 4,
    category: '生活服務',
    pay: 'NT$ 1,500',
    startDate: '2026/12/10',
    endDate: '2026/12/24',
    place: '遠端',
    devices: [{ name: 'Windows', platform: 'Windows' }],
    intro: '用鍵盤與螢幕報讀軟體完成預約，回報無法操作或唸錯的地方。',
    requirements: ['會使用 NVDA 或 JAWS', '全程只用鍵盤操作'],
  },
  {
    id: 'r11',
    name: '相簿備份 App 同步測試',
    owner: '雲朵科技',
    rating: 4.4,
    reviews: 8,
    category: '軟體與 SaaS',
    pay: 'NT$ 1,100',
    startDate: '2026/12/12',
    endDate: '2026/12/26',
    place: '遠端',
    devices: [
      { name: 'Android 手機', platform: 'Android' },
      { name: 'Mac', platform: 'macOS' },
    ],
    intro: '在手機拍照後確認電腦端多久同步完成，以及刪除、改名後兩邊是否一致。',
    requirements: ['手機和電腦都要登入同一個測試帳號', '至少同步 100 張照片'],
  },
]
