export const disputeSteps = [
  {
    title: '進入爭議',
    body: '負責人第 3 次退回報告時，案件會自動進入「爭議處理中」。',
  },
  {
    title: '暫停撥款與退款',
    body: '爭議期間，代管款不會撥款也不會退款，測試也暫停。',
  },
  {
    title: '雙方協商',
    body: '平台不介入爭議內容，請雙方在平台外協商，再各自回平台勾選結果。每人只能勾選一次，送出後不能更改。期限為進入爭議後 7 天或專案結束時間，以較晚時間為準。',
  },
  {
    title: '處理結果',
    body: '按照雙方選擇，有相對應的結果，請參考下方查看完整流程',
  },
]

// Options of the 公司產業 select on the owner company page.
// Signup does not use this list: it sends a tag id, so its options come from GET /api/tags.
export const industries = [
  '金融保險',
  '半導體與電子',
  '電商零售',
  '遊戲',
  '影音娛樂',
  '旅遊住宿',
  '餐飲外送',
  '生活服務',
  '教育',
  '醫療健康',
  '交通運輸',
  '政府與公共服務',
  '軟體與 SaaS',
  '其他',
]
