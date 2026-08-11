import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import MemberEditForm from "@/components/MemberEditForm";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function MemberEditPage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-member-edit-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <MemberEditForm />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-member-edit-shell {
          align-items:start !important;
          margin-top:18px !important;
          margin-bottom:34px !important;
        }

        @media (max-width:1150px) {
          .dy-member-edit-shell {
            grid-template-columns:210px minmax(0,1fr) !important;
          }

          .dy-member-edit-shell .km-home-right-column {
            display:none !important;
          }
        }

        @media (max-width:820px) {
          .dy-member-edit-shell {
            width:calc(100% - 16px) !important;
            grid-template-columns:1fr !important;
          }

          .dy-member-edit-shell .km-home-left-column,
          .dy-member-edit-shell .km-home-right-column {
            display:none !important;
          }
        }
      `}</style>
    </>
  );
}
