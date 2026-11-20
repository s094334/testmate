export function NdaText({
  testerName,
  signedDate,
}: {
  testerName: string
  signedDate: string
}) {
  return (
    <>
      <p>
        本附件 A《保密及不揭露協議》是您（「受測者」或「您」）與
        TestMate（「TestMate」或「我們」）之間具有約束力的契約。本協議規範您在所有測試週期中的測試活動。
      </p>
      <p>
        請仔細閱讀本協議，確保您了解每一條款。若您不同意這些條款，將無法進入本測試週期。簽署或點擊接受本協議，即表示您接受並同意受這些條款約束並遵守之。
      </p>

      <h3 className="text-subheading mt-2">附件 A 保密及不揭露協議</h3>
      <p>
        本協議 由 TestMate（以下稱「本公司」）與{' '}
        <mark className="bg-role-soft text-role-text rounded px-1 font-bold">
          {testerName}
        </mark>
        （以下稱「接收方」）訂立，接收方自{' '}
        <mark className="bg-role-soft text-role-text font-num rounded px-1 font-bold">
          {signedDate}
        </mark>
        （「生效日」，即簽署當日）起為本公司的社群受測者。
      </p>
      <p>
        鑑於，本公司委託接收方提供與本公司及其客戶技術測試相關的特定服務（「服務」），且接收方同意提供該等服務；
      </p>
      <p>
        鑑於，接收方在提供服務的過程中，將取得屬於本公司機密及專有的資訊（定義如下，「機密資訊」）；
      </p>
      <p>鑑於，接收方與本公司欲訂明接收方對機密資訊的不揭露及保密義務；且</p>
      <p>
        鑑於，接收方須確認接受本協議的條款與條件（此為接收方獲准向本公司提供服務的前提），方式為依本公司平台的指示點擊接受（此情況下無須簽署文末簽名欄），或透過文末簽名欄直接與本公司簽署本協議。
      </p>
      <p>因此，雙方茲同意如下：</p>

      <ol className="flex flex-col gap-4">
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            01
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <b>定義</b>
            <p>
              <b>A.</b>{' '}
              本協議所稱「機密資訊」，係指與本公司（或本公司依保密義務所持有之他方資訊）過去、現在或未來有關的一切資訊，不論其傳遞形式為何，包括：(i)
              內部事務；(ii) 研究、開發或業務計畫；(iii)
              營運或系統（包括但不限於財務資料、研究及報告、軟體、平台、備忘錄、草稿及其他有形或無形形式的資訊）；(iv)
              與本公司會員相關的資訊；(v)
              與本公司網站、平台、應用程式或本公司控制之任何其他網站、平台或應用程式的使用者相關的資訊（包括但不限於測試週期中所指定之本公司客戶的任何應用程式，以及與該等應用程式直接或間接相關的任何應用程式，即不論其名稱是否相同）；(vi)
              任何發現、發明、營業秘密、研發成果、專門技術（know-how 及
              show-how），以及上述各項的所有交付成果、衍生物、改良及強化；(vii)
              本公司指定為機密及／或專有的任何其他資訊，或合理之人不論有無此指定均會視為機密的資訊；以及接收方在提供服務過程中所取得、被分享、傳輸或以其他方式接收的任何個人資料。
            </p>
            <p>
              下列資訊不視為本協議所稱之機密、個人及／或專有資訊，接收方對其不負任何義務：(a)
              揭露時接收方已知悉者；(b)
              非因接收方不法行為而已公開或成為公眾所知者；(c)
              接收方從第三方取得、無類似限制且未違反本協議者；(d)
              由接收方獨立開發者；或 (e)
              依法須向任何政府機關揭露或依法律要求必須揭露者（前提是接收方已依第
              2.B 條行事）。
            </p>
            <p>
              <b>B.</b>{' '}
              「機密資料」係指所有含有機密資訊的有形資料，包括但不限於書面或印刷文件、電子傳輸資料，以及電腦磁碟或磁帶，不論是否為機器或使用者可讀取。所有機密資訊及機密資料均屬且將始終屬於本公司所有。本公司向接收方揭露資訊，並不代表授予接收方任何專利、著作權、商標或營業秘密資訊的明示或默示權利。
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            02
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <b>義務與限制</b>
            <p>
              <b>A.</b>{' '}
              接收方了解機密資訊對本公司而言是有價值且獨特的資產。接收方僅得為提供服務之目的使用機密資訊，不得為接收方自身或任何其他方的利益揭露、散布、轉讓、出售、分享、銷毀或以其他方式使用（「使用」）機密資訊。未經本公司事先書面同意，接收方不得向任何第三方揭露或散布機密資訊。
            </p>
            <p>
              <b>B.</b>{' '}
              自本公司向接收方揭露機密資訊後，接收方在任何時候均不得向第三方揭露任何機密資訊，但依下述規定向接收方之顧問揭露者除外。然而，接收方得依司法或其他政府命令揭露機密資訊，惟接收方應於揭露前至少十（10）天通知本公司，使本公司得以尋求適當的保護令或類似措施，並遵守所有適用的保護令（或同等命令）。
            </p>
            <p>
              <b>C.</b>{' '}
              接收方應採取合理的安全預防措施（至少等同於其保護自身機密及專有資訊的程度），對機密資訊保密。接收方僅得在「必要知悉」的基礎上，向接收方的員工或顧問揭露機密資訊或機密資料。含有個人資料的機密資訊，接收方在任何情況下均不得分享、使用、儲存及／或傳輸，除非依司法或政府命令要求，且須遵守第
              2.B
              條規定的通知本公司義務。接收方應與其員工及顧問簽訂或已簽訂適當的書面協議，足以使其遵守本協議的所有規定。
            </p>
            <p>
              <b>D.</b>{' '}
              機密資訊及機密資料僅得為推動接收方與本公司的業務關係，並僅在本協議另有規定的範圍內揭露、複製、摘要或散布。接收方同意將所有此類機密資料與他人的機密資料分開存放，以防混雜。
            </p>
            <p>
              <b>E.</b>{' '}
              未經本公司事先書面同意，接收方不得向依本協議得揭露機密資訊以外之人公開或揭露促成本協議的相關討論。
            </p>
            <p>
              <b>F.</b>{' '}
              接收方一旦得知任何未經授權的使用，包括未經授權的存取、資料外洩或疑似濫用任何機密資訊，應立即通知本公司。
            </p>
            <p>
              <b>G.</b>{' '}
              客戶資訊。在不減損本協議其他義務的前提下，接收方特別確認，與本公司任何客戶相關的所有資訊，包括客戶的業務、產品計畫、策略合作關係等，均須以最嚴格的方式保密。接收方不得在任何資料中揭露有關服務、本公司或客戶身分或機密資訊的任何內容，包括但不限於在社群媒體或本公司或接收方網站上的貼文。除為提供服務所絕對必要者外，接收方不得複製接收方提供給本公司（或本公司客戶）或本公司提供給接收方的任何圖片、文字、影片、音訊或任何其他內容。
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            03
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <b>權利、義務及救濟</b>
            <p>
              <b>A.</b>{' '}
              接收方應依本公司要求，返還機密資訊或機密資料的所有原件、副本、複製品及摘要，或依本公司選擇，證明已銷毀該等資料。
            </p>
            <p>
              <b>B.</b>{' '}
              接收方確認，若發生任何違反或可能違反本協議規定的情形，本公司有權在不放棄其他任何權利或救濟、且無須提供擔保金的情況下，向有管轄權的法院請求其認為適當的禁制令或衡平救濟。
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            04
          </span>
          <p>
            <b>獨立承攬人。</b>
            本協議的任何內容均不得解釋為使任一方成為另一方的合夥人、合資人、代理人或員工，任一方亦無權以任何方式約束另一方，雙方各自為獨立承攬人，並對其自身行為負責。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            05
          </span>
          <p>
            <b>繼受人及受讓人。</b>
            本協議對雙方及其各自的繼受人及受讓人具有約束力，並為其利益而生效。未經另一方事先書面同意，任一方均不得轉讓其在本協議下的權利或義務。任何違反本條規定的轉讓均屬無效。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            06
          </span>
          <p>
            <b>完整協議；修訂。</b>
            本協議構成雙方就本協議標的之完整理解與協議，並取代雙方先前就本協議標的所有口頭及書面，以及同時期的口頭協商、承諾與理解。本協議僅得以經雙方簽署的書面文件修改或修訂。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            07
          </span>
          <p>
            <b>可分割性。</b>
            本協議任何條款在任何司法管轄區內若屬無效、違法或無法執行，則僅在該司法管轄區及該無效、違法或無法執行的範圍內不生效力，不影響其餘條款在該司法管轄區的效力，亦不使該條款或本協議其他條款在其他司法管轄區內無效、違法或無法執行。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            08
          </span>
          <p>
            <b>準據法。</b>
            本協議以中華民國法律為準據法；因本協議涉訟時，雙方同意以臺灣
            <b className="text-status-revise-text">【臺北】</b>
            地方法院為第一審管轄法院。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            09
          </span>
          <p>
            <b>條款標題。</b>
            條款標題僅為方便雙方閱讀而設，絕不改變、修改、修訂、限制或約束雙方的契約義務。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            10
          </span>
          <p>
            <b>棄權。</b>
            任一方在要求另一方履行本協議或行使本協議任何權利時有所延遲或疏忽，均不構成放棄本協議任何條款或任何權利；且於某一場合放棄、疏忽或延遲要求履行或行使任何權利，不得解釋為日後任何場合禁止或放棄該履行或權利，或本協議下任何權利或救濟。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            11
          </span>
          <p>
            <b>存續。</b>第 1、2、3 及 8
            條之規定，於本協議終止或期滿後仍繼續有效。
          </p>
        </li>
        <li className="flex gap-3">
          <span className="font-num text-ink-subtle min-w-6 flex-none text-[18px] font-semibold">
            12
          </span>
          <p>
            <b>期限。</b>
            只要接收方持續為本公司提供服務，本協議即持續完全有效。然而，本協議下的保密義務將無限期持續有效。
          </p>
        </li>
      </ol>
    </>
  )
}
