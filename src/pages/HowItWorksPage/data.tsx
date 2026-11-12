import { Link } from 'react-router'

export const ownerSteps = [
  {
    title: '註冊帳號',
    description: (
      <>
        還沒註冊嗎？
        <Link
          to="/signup"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          這裡可以註冊
        </Link>
        。
      </>
    ),
  },
  {
    title: '發布測試需求',
    description: (
      <>
        設定產業、目標裝置、專案時間、測試範圍與成功標準，也可以使用我們
        <a
          href="#"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          提供的小工具
        </a>
        快速發布需求。
      </>
    ),
  },
  {
    title: '挑選測試人員',
    description: (
      <>
        每個專案配對一位測試人員。依據裝置和經驗推薦，看看
        <a
          href="#"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          誰來應徵
        </a>
        。
      </>
    ),
  },
  {
    title: '付款並提供測試環境',
    description: '報酬交由平台保管，驗收通過後撥款給測試人員。',
  },
  {
    title: '驗收測試報告',
    description: '驗收時選擇「通過」或「要求修改」，最多可以修改 2 次。',
  },
  {
    title: '給予評分',
    description:
      '在平台給測試人員 1 到 5 星與評論，專案結束後會公開在對方的簡介。',
  },
]

export const testerSteps = [
  {
    title: '註冊帳號',
    description: (
      <>
        還沒註冊嗎？
        <Link
          to="/signup"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          這裡可以註冊
        </Link>
        。
      </>
    ),
  },
  {
    title: '建立個人檔案',
    description: (
      <>
        <a
          href="#"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          建立個人檔案
        </a>
        ，包含裝置、過去經驗、興趣與語言，平台會推薦適合的專案。
      </>
    ),
  },
  {
    title: '接案',
    description: (
      <>
        接受邀請，或
        <a
          href="#"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          主動應徵
        </a>
        有興趣的專案。
      </>
    ),
  },
  {
    title: '簽保密協議、取得測試環境',
    description:
      '簽訂保密協議後，專案負責人會寄測試環境到信箱中，報酬會先由平台保管，安心測試。',
  },
  {
    title: '測試並提交報告',
    description: '按下「開始測試」，在期限內提交測試報告。截止前會收到提醒。',
  },
  {
    title: '獲得報酬並給予評分',
    description:
      '驗收通過後，平台扣除抽成撥款給你。在平台給專案負責人 1 到 5 星與評論，專案結束後會公開在對方的簡介。',
  },
]
