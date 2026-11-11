// 版權聲明開頭的灰底提示框
export const copyrightNotice =
  '本網站為「火箭隊 23 梯」學員專題作品，僅供學習、作品展示與專題發表使用，非正式上線的商業服務。'

// 版權聲明的段落，編號 01、02… 依順序自動產生
export const copyrightSections = [
  {
    title: '非營利聲明',
    items: [
      '本平台不會實際營利，也不收取任何費用或抽成',
      '頁面上出現的報酬、平台抽成、撥款與退款等金額與流程，皆為功能展示用途',
      <>
        金流功能串接金流服務的「測試環境」，不會產生真實交易或扣款，
        <b>請勿輸入真實的信用卡或銀行帳戶資訊</b>
      </>,
    ],
  },
  {
    title: '智慧財產權',
    items: [
      '本網站的介面設計、文字內容與程式碼，著作權屬於專題作者所有，未經同意請勿轉載、重製或用於商業用途',
      '網站中使用的第三方字型、圖示、圖片或套件，版權歸原作者所有，依各自的授權條款使用',
      '網站中提及的公司或品牌名稱僅作為範例說明，與本專題沒有任何合作或代言關係',
    ],
  },
  {
    title: '聯絡方式',
    items: [
      <>
        如有任何問題，歡迎來信：
        <a
          href="mailto:no-reply@xin-ping.com"
          className="text-platform-strong font-bold decoration-2 underline-offset-3 hover:underline"
        >
          no-reply@xin-ping.com
        </a>
      </>,
    ],
  },
]

// 隱私權聲明開頭的灰底提示框
export const privacyNotice =
  '本網站為「火箭隊 23 梯」學員專題作品，僅供學習、作品展示與專題發表使用，非正式上線的商業服務。本平台不會實際營利，也不收取任何費用或抽成。'

// 隱私權聲明的段落；intro 是清單前的說明，outro 是清單後的補充
export const privacySections = [
  {
    title: '收集的資料',
    intro: '我們只收集提供功能所需的資料：',
    items: [
      <>
        <b>帳號資訊：</b>Email、密碼與暱稱，用於註冊與登入
      </>,
      <>
        <b>個人檔案：</b>裝置型號與系統版本、經歷、興趣，用於媒合測試專案
      </>,
      <>
        <b>專案與測試資料：</b>
        專案內容、測試報告、bug 回報，以及上傳的截圖或錄影
      </>,
      <>
        <b>簽署紀錄：</b>受測者同意書與保密協議的簽署時間
      </>,
      <>
        <b>金流測試資料：</b>
        金流測試環境產生的交易紀錄，不會產生真實扣款，
        <b>請勿輸入真實的信用卡或銀行帳戶資訊</b>
      </>,
    ],
    outro: (
      <>
        建議使用測試用的資料，<b>不要填寫真實姓名、電話或其他敏感資訊。</b>
      </>
    ),
  },
  {
    title: '資料的用途',
    items: [
      '提供註冊、登入與個人檔案功能',
      '媒合專案負責人與測試人員，並在雙方之間顯示必要資訊，例如簽署保密協議後才開放測試環境與聯絡方式',
      '展示代管、驗收與撥款等流程，這些金額與流程皆為功能展示用途',
      '除錯與維護網站安全',
      '專題發表時展示功能，展示時會使用測試資料',
    ],
    outro: '資料不會用於行銷或廣告，也不會販售或分享給他人。',
  },
  {
    title: '第三方服務與 Cookie',
    items: [
      <>
        網站使用第三方服務（如主機、資料庫、金流測試環境），資料會存放在這些服務上，並依各自的隱私政策處理，請參閱{' '}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noreferrer"
          className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
        >
          Cloudflare 的隱私政策
        </a>
      </>,
      '網站使用 Cookie 或瀏覽器儲存空間維持登入狀態，不用於廣告追蹤',
    ],
  },
  {
    title: '保存期限',
    items: [
      '資料只保存到專題結束為止，專題結束或網站下線後會刪除所有資料',
      '由於本網站可能隨時變動，資料可能被修改或清除，對於資料的存取與保存不負任何責任',
    ],
  },
  {
    title: '安全性',
    items: [
      '密碼以雜湊方式儲存，連線使用 HTTPS 加密',
      '本網站為火箭隊專題，無法保證與正式商業服務相同的安全等級，請勿提供真實的敏感資訊',
    ],
  },
  {
    title: '你的權利',
    items: [
      '你可以隨時在「我的檔案」查看或修改自己的資料',
      '如需刪除帳號或資料，請來信聯絡，我們會在 30 天內回覆',
    ],
  },
  {
    title: '聲明的變更',
    items: ['本聲明可能隨專題進度修改，修改後會更新於此頁並標示更新日期'],
  },
  {
    title: '聯絡方式',
    items: [
      <>
        如有任何問題，歡迎來信：
        <a
          href="mailto:no-reply@xin-ping.com"
          className="text-platform-strong font-bold decoration-2 underline-offset-3 hover:underline"
        >
          no-reply@xin-ping.com
        </a>
      </>,
    ],
  },
]
