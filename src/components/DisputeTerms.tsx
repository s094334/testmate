// The complete dispute process, shown in signup step 4 and later in the project page's dispute dialog.
// It is the one copy of this text: when the wording changes, bump disputeTermsVersion in src/data/disputeTerms.ts.
export function DisputeTerms() {
  return (
    <div className="text-ink-muted flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            01
          </span>
          什麼時候會進入爭議處理
        </h3>
        <p>
          爭議處理不需要、也不能自己提出。只有一種情況會進入：
          <b className="text-ink">測試報告第 3 次被退回</b>。
        </p>
        <ul className="flex list-disc flex-col gap-1.5 pl-6">
          <li>
            <b className="text-ink">第 1 次、第 2 次退回：</b>
            回到「測試中」，測試人員依退回理由修改後重新提交。
          </li>
          <li>
            <b className="text-ink">第 3 次退回：</b>
            不再回到「測試中」，專案自動進入「爭議處理中」。
          </li>
          <li>負責人每次退回都會詳細寫上需要修改的部分。</li>
        </ul>
        <h4 className="text-ink mt-3 text-[18px]">這些情況不會進入爭議處理</h4>
        <p>
          付款前取消合作、測試報告逾期沒有提交，這兩種情況有各自的處理方式。
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            02
          </span>
          進入之後會發生什麼
        </h3>
        <ul className="flex list-disc flex-col gap-1.5 pl-6">
          <li>專案狀態變成「爭議處理中」</li>
          <li>報酬繼續由平台代管：暫停撥款，也不會退款</li>
          <li>保密協議仍持續有效</li>
          <li>互相評價要等爭議結束後才能填寫</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            03
          </span>
          雙方各自選擇處理方式（爭議期限內）
        </h3>
        <p>建議雙方使用 Email 進行溝通討論，再各自在專案頁選一種處理方式：</p>
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-ink font-bold">繼續進行</dt>
            <dd>回到「測試中」，測試人員修改後重新提交報告。</dd>
          </div>
          <div>
            <dt className="text-ink font-bold">已完成</dt>
            <dd>負責人接受目前的報告，報酬撥給測試人員。</dd>
          </div>
          <div>
            <dt className="text-ink font-bold">結束專案</dt>
            <dd>不再繼續，報酬全額退回負責人。</dd>
          </div>
        </dl>
        <ul className="flex list-disc flex-col gap-1.5 pl-6">
          <li>
            期限是進入爭議後 7
            天或專案結束時間，以較晚時間為準，專案頁會顯示時間
          </li>
          <li>送出後不能修改</li>
          <li>
            <b className="text-ink">雙方選的一樣：</b>
            後續會按照所選的結果，進行處理。
          </li>
          <li>
            <b className="text-ink">雙方都沒有選、只有一方選，或選的不一樣：</b>
            視為未達成一致。扣除平台抽成 15%
            後，剩下的報酬由測試人員和負責人各拿一半，專案變成「已退款」。
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            04
          </span>
          四種結果
        </h3>
        <p>
          結果會是下面四種之一。前三種要雙方選的一樣，第四種是雙方沒有達成一致時的結果。
        </p>
        <h4 className="text-ink mt-3 text-[18px]">繼續進行</h4>
        <p>
          雙方都選「繼續進行」時，專案回到「測試中」，報酬繼續由平台代管。測試人員依照負責人退回時寫的修改內容修正報告，在平台通知的新提交期限內重新提交，負責人再照一般流程驗收。如果這份報告又被退回，專案會再次進入爭議處理。
        </p>
        <h4 className="text-ink mt-3 text-[18px]">已完成</h4>
        <p>
          雙方都選「已完成」時，代表負責人接受目前的測試報告。專案變成「已完成」，扣除平台抽成
          15% 後，平台把報酬撥到測試人員設定的收款帳戶，雙方都會收到 Email
          通知。之後雙方可以互相評價。
        </p>
        <h4 className="text-ink mt-3 text-[18px]">結束專案</h4>
        <p>
          雙方都選「結束專案」時，代表雙方同意不再繼續。專案變成「已退款」，報酬全額退回負責人，測試人員不會收到報酬。
        </p>
        <h4 className="text-ink mt-3 text-[18px]">未達成一致</h4>
        <p>
          只要不是雙方選了同一種，就是這個結果，包括雙方都沒有選、只有一方選，或雙方選的不一樣。爭議期限一到，平台會自動處理，不需要任何人再操作：先扣除平台抽成
          15%，剩下的報酬平均分成兩份，一份撥給測試人員，一份退回負責人。專案變成「已退款」。
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            05
          </span>
          期限一覽
        </h3>
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-ink font-bold">進入爭議處理</dt>
            <dd>報告第 3 次被退回時</dd>
          </div>
          <div>
            <dt className="text-ink font-bold">雙方選擇處理方式</dt>
            <dd>進入爭議後 7 天或專案結束時間，以較晚時間為準</dd>
          </div>
          <div>
            <dt className="text-ink font-bold">未達成一致時自動處理</dt>
            <dd>爭議期限到的時候</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink flex items-baseline gap-3">
          <span className="font-num text-num-heading text-ink-subtle w-6 flex-none">
            06
          </span>
          其他注意事項
        </h3>
        <ul className="flex list-disc flex-col gap-1.5 pl-6">
          <li>爭議期間請雙方理性、和平溝通</li>
          <li>爭議的內容只有雙方和平台看得到，不會公開</li>
          <li>提供不實的資料，情節嚴重會停用帳號</li>
          <li>
            對流程有疑問，請寫信到{' '}
            <a
              href="mailto:support@xin-ping.com"
              className="text-platform-strong font-bold decoration-2 underline-offset-3 hover:underline"
            >
              support@xin-ping.com
            </a>
            。
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-subheading text-ink">同意聲明</h3>
        <p>
          勾選「我已閱讀並同意爭議處理流程」並完成註冊，就代表你已經閱讀、了解，並同意這份爭議處理流程的
          <b className="text-ink">全部內容</b>。
        </p>
        <p>
          之後你參與的專案如果進入爭議處理，都會依照這份流程處理，包括未達成一致時自動平分報酬的規則。不同意的話，將無法完成註冊。
        </p>
      </section>
    </div>
  )
}
