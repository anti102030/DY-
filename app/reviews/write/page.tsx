import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import ReviewWriteForm from "@/components/ReviewWriteForm";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function ReviewWritePage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-reviews-shell">
        {/* 왼쪽 사이드바 */}
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        {/* 가운데 */}
        <section className="km-home-center-column dy-reviews-main">
          {/* 통합검색 */}
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          {/* 고객후기 글쓰기 */}
          <ReviewWriteForm />
        </section>

        {/* 오른쪽 사이드바 */}
        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        /*
          고객후기 목록 페이지와
          완전히 같은 바깥 레이아웃 사용
        */

        .dy-reviews-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-reviews-main {
          width: 100%;
          min-width: 0;
        }

        .dy-reviews-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        /*
          가운데에 들어가는 글쓰기 폼이
          레이아웃 밖으로 밀려나지 않도록
        */

        .dy-reviews-main
          .dy-review-write-page {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        .dy-reviews-main
          .dy-review-write-form {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }

        /*
          에디터가 가운데 영역보다
          넓어져서 사이트 전체를 밀어내는 것 방지
        */

        .dy-reviews-main
          .dy-review-editor {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }

        .dy-reviews-main
          .dy-review-editor-field {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        .dy-reviews-main
          .dy-review-write-field {
          min-width: 0 !important;
        }

        /*
          태블릿
        */

        @media (max-width: 1150px) {
          .dy-reviews-shell {
            grid-template-columns:
              210px minmax(0, 1fr) !important;
          }

          .dy-reviews-shell
            .km-home-right-column {
            display: none !important;
          }
        }

        /*
          모바일
        */

        @media (max-width: 820px) {
          .dy-reviews-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
          }

          .dy-reviews-shell
            .km-home-left-column,
          .dy-reviews-shell
            .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}