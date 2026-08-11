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
            <h1 className="dy-policy-title">이용약관</h1>

            <div className="dy-policy-content">
              <section className="dy-policy-section">
                <h2>제1조 목적</h2>
                <p>본 약관은 DY다이아부동산이 운영하는 웹사이트에서 제공하는 부동산 정보, 상담 신청, 빌라투어 신청 및 관련 서비스의 이용 조건과 절차를 정하는 것을 목적으로 합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제2조 서비스의 내용</h2>
                <p>회사는 부동산 매물 정보 제공, 맞춤 상담 접수, 현장 방문 일정 조율, 문의게시판 운영 및 기타 부동산 관련 안내 서비스를 제공합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제3조 이용자의 의무</h2>
                <p>이용자는 신청 또는 문의 과정에서 사실에 맞는 정보를 입력해야 하며, 타인의 개인정보를 무단으로 사용하거나 사이트 운영을 방해하는 행위를 해서는 안 됩니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제4조 게시물의 관리</h2>
                <p>회사는 관계 법령을 위반하거나 타인의 권리를 침해하는 내용, 허위·광고성 게시물 및 서비스 운영을 방해하는 게시물을 사전 통지 없이 제한하거나 삭제할 수 있습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제5조 부동산 정보와 거래</h2>
                <p>사이트에 표시된 매물 정보는 상담 및 안내를 위한 자료이며, 실제 거래 조건은 현장 확인과 계약 과정에서 달라질 수 있습니다. 거래는 부동산을 통해 안전하게 진행됩니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제6조 서비스 이용 제한</h2>
                <p>시스템 점검, 통신 장애, 천재지변 또는 기타 불가피한 사유가 있는 경우 서비스 제공이 일시적으로 제한될 수 있습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제7조 책임의 제한</h2>
                <p>회사는 고의 또는 중대한 과실이 없는 한 이용자가 사이트에 입력한 부정확한 정보, 이용자의 귀책사유 또는 외부 서비스 장애로 발생한 손해에 대하여 책임을 지지 않습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>제8조 분쟁 해결</h2>
                <p>서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 원만한 해결을 위해 협의하며, 협의가 이루어지지 않을 경우 관계 법령과 관할 법원에 따릅니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>부칙</h2>
                <p>본 약관은 2026년 7월 19일부터 적용됩니다.</p>
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
