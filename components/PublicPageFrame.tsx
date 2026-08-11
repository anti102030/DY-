import type { ReactNode } from "react";
import InnerPageTop from "@/components/InnerPageTop";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Footer from "@/components/Footer";

type PublicPageFrameProps = {
  children: ReactNode;
};

export default function PublicPageFrame({
  children,
}: PublicPageFrameProps) {
  return (
    <>
      <InnerPageTop bannerControls={false} />

      <main className="km-home-layout dy-public-page-frame">
        <aside className="km-home-left-column dy-public-left">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column km-detail-main dy-public-center">
          {children}
        </section>

        <aside className="km-home-right-column dy-public-right">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-public-page-frame {
          align-items: start;
        }

        .dy-public-left,
        .dy-public-center,
        .dy-public-right {
          min-width: 0;
        }

        @media screen and (max-width: 900px) {
          .dy-public-page-frame {
            width: calc(100% - 16px) !important;
            max-width: none !important;
            min-width: 0 !important;

            margin-left: auto !important;
            margin-right: auto !important;

            display: grid !important;
            grid-template-columns: minmax(0, 1fr) !important;

            gap: 0 !important;
          }

          .dy-public-left,
          .dy-public-right {
            display: none !important;
          }

          .dy-public-center {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;

            margin: 0 !important;
            padding: 0 !important;
          }

          .dy-public-center > * {
            max-width: 100% !important;
            min-width: 0 !important;
          }
        }

        @media screen and (max-width: 520px) {
          .dy-public-page-frame {
            width: calc(100% - 12px) !important;
          }
        }
      `}</style>
    </>
  );
}