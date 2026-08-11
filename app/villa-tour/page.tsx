import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import VillaTourForm from "@/components/VillaTourForm";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function VillaTourPage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-villa-tour-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-villa-tour-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <VillaTourForm />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-villa-tour-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-villa-tour-main {
          width: 100%;
          min-width: 0;
        }

        .dy-villa-tour-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        @media (max-width: 1150px) {
          .dy-villa-tour-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-villa-tour-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-villa-tour-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-villa-tour-shell .km-home-left-column,
          .dy-villa-tour-shell .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
