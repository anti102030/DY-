import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-public-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-public-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <article className="dy-policy-article">
            <h1 className="dy-policy-title">개인정보처리방침</h1>

            <div className="dy-policy-content">
              <section className="dy-policy-section">
                <h2>1. 개인정보의 처리 목적</h2>
                <p>DY다이아부동산은 맞춤 상담, 빌라투어 신청, 문의 접수, 상담 일정 조율, 매물 추천 및 고객 문의 처리를 위해 개인정보를 처리합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>2. 처리하는 개인정보 항목</h2>
                <p>필수항목: 이름, 연락처, 상담 또는 신청 내용\n선택항목: 이메일, 희망지역, 예산, 이사 예정일, 첨부파일 및 이용자가 자발적으로 입력한 정보</p>
              </section>
              <section className="dy-policy-section">
                <h2>3. 개인정보의 처리 및 보유 기간</h2>
                <p>개인정보는 상담 및 관련 업무가 종료될 때까지 보유하며, 처리 목적이 달성된 후에는 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>4. 개인정보의 제3자 제공</h2>
                <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 이용자가 사전에 동의한 경우, 법령에 특별한 규정이 있는 경우 또는 이용자가 요청한 업무 수행에 필요한 경우에는 필요한 범위에서 제공할 수 있습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>5. 개인정보 처리업무의 위탁</h2>
                <p>회사는 서비스 운영, 데이터 저장, 문자·전화 상담 및 일정 관리 등을 위해 외부 전문업체에 개인정보 처리업무를 위탁할 수 있습니다. 위탁이 발생하는 경우 관련 법령에 따라 안전하게 관리합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>6. 개인정보의 파기 절차 및 방법</h2>
                <p>보유 목적이 달성된 개인정보는 복구 또는 재생되지 않도록 안전한 방법으로 파기합니다. 전자적 파일은 복구가 불가능한 방식으로 삭제하고, 출력물은 분쇄 또는 소각합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>7. 정보주체의 권리와 행사 방법</h2>
                <p>이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 및 동의 철회를 요청할 수 있습니다. 요청은 고객상담전화로 접수할 수 있으며 회사는 관계 법령에 따라 처리합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>8. 자동 수집 장치의 운영</h2>
                <p>사이트는 서비스 이용 분석과 편의 제공을 위해 쿠키 등 자동 수집 장치를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나 일부 서비스 이용이 제한될 수 있습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>9. 개인정보 보호책임자 및 문의처</h2>
                <p>개인정보 보호책임자: 서재욱\n회사명: DY다이아부동산\n전화: 010-8426-8616\n주소: 서울특별시 강서구 등촌동 526-26 1층 다이아부동산</p>
              </section>
              <section className="dy-policy-section">
                <h2>10. 방침의 변경</h2>
                <p>본 개인정보처리방침은 법령 또는 서비스 내용 변경에 따라 수정될 수 있으며, 변경 시 사이트를 통해 공개합니다.\n시행일: 2026년 7월 19일</p>
              </section>
            </div>
          </article>
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-public-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-public-main {
          width: 100%;
          min-width: 0;
        }

        .dy-public-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        .dy-policy-article {
          width: 100%;
          background: #fff;
        }

        .dy-policy-title {
          margin: 0;
          padding: 4px 0 10px;
          border-bottom: 2px solid #222;
          color: #111;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-policy-content {
          padding: 22px 18px 32px;
          border: 1px solid #ddd;
          border-top: 0;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-policy-section {
          margin-bottom: 24px;
        }

        .dy-policy-section:last-child {
          margin-bottom: 0;
        }

        .dy-policy-section h2 {
          margin: 0 0 8px;
          color: #222;
          font-size: 16px;
          font-weight: 800;
        }

        .dy-policy-section p {
          margin: 0;
          color: #555;
          font-size: 13px;
          line-height: 1.85;
          white-space: pre-line;
        }

        @media (max-width: 1150px) {
          .dy-public-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-public-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-public-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-public-shell .km-home-left-column,
          .dy-public-shell .km-home-right-column {
            display: none !important;
          }

          .dy-policy-content {
            padding: 18px 14px 26px;
          }
        }
      `}</style>

    </>
  );
}
