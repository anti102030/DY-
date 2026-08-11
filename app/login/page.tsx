import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import LoginForm from "@/components/LoginForm";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-login-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-login-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <LoginForm />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-login-shell {
          align-items:start !important;
          margin-top:18px !important;
          margin-bottom:34px !important;
        }

        .dy-login-main {
          width:100%;
          min-width:0;
        }

        .dy-login-main .km-home-search-wrap {
          width:100%;
          margin-bottom:24px !important;
        }

        @media (max-width:1150px) {
          .dy-login-shell {
            grid-template-columns:210px minmax(0,1fr) !important;
          }

          .dy-login-shell .km-home-right-column {
            display:none !important;
          }
        }

        @media (max-width:820px) {
          .dy-login-shell {
            width:calc(100% - 16px) !important;
            grid-template-columns:1fr !important;
          }

          .dy-login-shell .km-home-left-column,
          .dy-login-shell .km-home-right-column {
            display:none !important;
          }
        }
      `}</style>
    </>
  );
}
