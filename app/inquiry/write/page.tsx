import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import InquiryWriteForm from "@/components/InquiryWriteForm";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function InquiryWritePage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-inquiry-write-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-inquiry-write-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <InquiryWriteForm />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-inquiry-write-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-inquiry-write-main {
          width: 100%;
          min-width: 0;
        }

        .dy-inquiry-write-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        @media (max-width: 1150px) {
          .dy-inquiry-write-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-inquiry-write-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-inquiry-write-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-inquiry-write-shell .km-home-left-column,
          .dy-inquiry-write-shell .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
