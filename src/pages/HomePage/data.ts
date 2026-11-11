export const popularIndustries = ['電商零售', '金融保險', '遊戲']

export const missingDevices = ['iPhone SE', 'Linux', 'iPad']

// 目前專案，示意資料，之後換成 API
export const currentProjects = [
  {
    id: '01',
    title: '電商 App 結帳測試',
    industry: '電商零售',
    devices: ['iPhone SE'],
    reward: 1200,
    deadline: '2026/11/05',
  },
  {
    id: '03',
    title: '保險試算網頁跨瀏覽器測試',
    industry: '金融保險',
    devices: ['Windows Chrome'],
    reward: 1800,
    deadline: '2026/11/08',
  },
  {
    id: '077',
    title: '手機遊戲的新手教學體驗測試',
    industry: '遊戲',
    devices: ['iPad'],
    reward: 900,
    deadline: '2026/11/12',
  },
]

// role：這一步由誰做，決定編號顏色
export const testingSteps = [
  {
    role: 'owner',
    title: '發布需求',
    description: '寫下要測的裝置、項目，報酬由平台代管。',
  },
  {
    role: 'tester',
    title: '接案測試',
    description: '測試人員依測試說明執行，並回報結果。',
  },
  {
    role: 'platform',
    title: '驗收撥款',
    description: '每一項都確認通過，平台才撥出報酬。',
  },
]
