export function ConsentText({ company }: { company: string }) {
  return (
    <>
      <p>
        <b>「僅用於專題使用，不具任何商業用途」</b>
      </p>
      <p>接受本測試週期，即表示您明確同意：</p>
      <p>
        TestMate
        可依據本同意書及聲明，收集、處理、分享、傳輸及儲存您的個人資料（「個人資料」），用途如下：
      </p>
      <ul className="flex list-disc flex-col gap-1.5 pl-6">
        <li>測試週期招募</li>
        <li>完成測試週期</li>
        <li>支付您參與測試週期的報酬</li>
      </ul>
      <p>
        您的個人資料將分享給委託本次測試的{' '}
        <mark className="bg-role-soft text-role-text rounded px-1 font-bold">
          {company}
        </mark>
        。委託公司正在開發新產品，並希望招募多元的受測者群體，以確保其產品能代表廣泛的潛在用戶樣本。您沒有義務參與本測試週期，但提交資料是參與的必要條件。若您未提交個人資料，將無法參與測試週期或獲得報酬。
      </p>
      <p>本測試週期收集的個人資料包括：</p>
      <ul className="flex list-disc flex-col gap-1.5 pl-6">
        <li>姓名</li>
        <li>聯絡資訊（電子郵件地址、電話號碼）</li>
        <li>
          您在測試週期中可能使用之裝置的資訊（IP 位址、裝置 ID、工作階段 ID）
        </li>
      </ul>
      <p>
        您同意已詳閱測試的詳細內容，並承諾在指定時間內依照範圍與指示進行測試。
      </p>
      <ul className="flex list-disc flex-col gap-1.5 pl-6">
        <li>
          您可隨時撤回對處理您個人資料的同意。請注意，若您撤回同意，您將不再是測試週期的參與者，且可能無法獲得報酬。您的個人資料將儲存於{' '}
          <a
            href="https://www.cloudflare.com/"
            target="_blank"
            rel="noreferrer"
            className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
          >
            Cloudflare
          </a>
          ，其主機可能位於臺灣以外地區。
        </li>
        <li>
          個人資料保存期限：為客戶測試週期所收集及／或處理的任何個人資料，將於測試週期結束後九十（90）天內刪除。
        </li>
        <li>
          您可依個人資料保護法第 3
          條，請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用或刪除您的個人資料。如需行使上述權利或有任何問題，請來信{' '}
          <a
            href="mailto:support@xin-ping.com"
            className="text-role font-bold decoration-2 underline-offset-3 hover:underline"
          >
            support@xin-ping.com
          </a>
          。
        </li>
      </ul>

      <h3 className="text-subheading mt-2">資料保護聲明</h3>
      <h4 className="mt-2 text-[18px] leading-[1.4]">個人資料</h4>
      <ol className="flex flex-col gap-4">
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            01
          </span>
          <p>
            本公司應遵守所有適用的：(i)
            現行或日後生效的國際及地方法律、規則、法規及政府要求，包括但不限於與隱私權、資料保護、保密或個人資料安全相關者；以及
            (ii) 本公司的資訊安全政策及隱私權政策。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            02
          </span>
          <p>
            本公司將採取合理措施，確認任何可接觸個人資料的本公司員工（「人員」）及分包商具備保護該等個人資料的能力，包括：(i)
            選任並留用能夠維持個人資料保護措施的人員及經許可的分包商；以及 (ii)
            以合約要求人員及經許可的分包商維持該等保護措施。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            03
          </span>
          <p>
            本公司聲明並保證不會「出售」個人資料。除為遵守法律或具管轄權之政府機關的要求外，本公司不會將個人資料用於本測試以外之目的，亦不會揭露予委託本次測試之公司以外的第三方。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            04
          </span>
          <p>
            在不限制本文件其他義務的前提下，本公司應維持適當控管，以確保個人資料的機密性、安全性與完整性，並確保個人資料不會遭未經授權之揭露或存取。本公司應實施並維持適當的行政、技術及實體保護措施及其他適當的安全措施（包括但不限於針對本公司收集、處理、儲存、使用、揭露或銷毀個人資料時，保護電腦硬體、軟體及網路安全系統的措施），以確保本公司及其員工、代理人、公司及分包商：(i)
            維護個人資料的安全與機密；(ii)
            防範任何可預見對個人資料安全與完整性的威脅或危害；以及 (iii)
            防範任何安全事件。
          </p>
        </li>
      </ol>
      <p>本人已閱讀並了解本同意書。本人同意依照本同意書參與測試週期。</p>
    </>
  )
}
