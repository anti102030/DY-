import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import SignupAgreement from "@/components/SignupAgreement";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-signup-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-signup-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <SignupAgreement />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-signup-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-signup-main {
          width: 100%;
          min-width: 0;
        }

        .dy-signup-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 28px !important;
        }

        @media (max-width: 1150px) {
          .dy-signup-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-signup-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-signup-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-signup-shell .km-home-left-column,
          .dy-signup-shell .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
