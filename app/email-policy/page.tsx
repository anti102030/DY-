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
            <h1 className="dy-policy-title">이메일주소 무단수집 거부</h1>

            <div className="dy-policy-content">
              <section className="dy-policy-section">
                <h2>이메일주소 무단수집 거부 안내</h2>
                <p>본 웹사이트에 게시된 이메일주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>광고성 정보 전송</h2>
                <p>수신자의 명시적인 사전 동의 없이 영리 목적의 광고성 정보를 전송해서는 안 됩니다. 무단으로 수집된 이메일주소를 이용한 광고성 정보 전송으로 발생하는 책임은 발송자에게 있습니다.</p>
              </section>
              <section className="dy-policy-section">
                <h2>문의처</h2>
                <p>회사명: DY다이아부동산\n전화: 010-8426-8616\n주소: 서울특별시 강서구 등촌동 526-26 1층 다이아부동산</p>
              </section>
              <section className="dy-policy-section">
                <h2>시행일</h2>
                <p>본 안내는 2026년 7월 19일부터 적용됩니다.</p>
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
