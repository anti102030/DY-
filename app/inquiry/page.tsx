import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import InquiryBoardClient from "@/components/InquiryBoardClient";
import { supabase } from "@/lib/supabase";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

export type InquiryRow = {
  id: number;
  name: string;
  title: string;
  content: string;
  status: string;
  is_secret: boolean;
  created_at: string;
};

export type ConsultationNotice = {
  id: number;
  created_at: string;
};

export default async function InquiryPage() {
  const [
    { data: inquiryData, error: inquiryError },
    { data: consultationData, error: consultationError },
  ] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, name, title, content, status, is_secret, created_at")
      .order("id", { ascending: false })
      .limit(30),

    supabase
      .from("consultations")
      .select("id, created_at")
      .order("id", { ascending: false })
      .limit(30),
  ]);

  const inquiries = (inquiryData ?? []) as InquiryRow[];
  const recentConsultations =
    (consultationData ?? []) as ConsultationNotice[];

  const loadError = [inquiryError?.message, consultationError?.message]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-inquiry-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-inquiry-main-content">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <InquiryBoardClient
            initialInquiries={inquiries}
            recentConsultations={recentConsultations}
            loadError={loadError}
          />
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-inquiry-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-inquiry-main-content {
          min-width: 0;
          width: 100%;
        }

        .dy-inquiry-main-content .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        .dy-inquiry-main-content .kn-inquiry-page {
          width: 100% !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff;
        }

        .dy-inquiry-main-content .kn-inquiry-title {
          margin-top: 0 !important;
        }

        .dy-inquiry-main-content .kn-inquiry-top-box,
        .dy-inquiry-main-content .kn-board-wrap,
        .dy-inquiry-main-content .kn-board-table {
          width: 100% !important;
          max-width: none !important;
        }

        .dy-inquiry-main-content .kn-board-wrap {
          margin-bottom: 0 !important;
        }

        @media (max-width: 1150px) {
          .dy-inquiry-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-inquiry-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-inquiry-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-inquiry-shell .km-home-left-column,
          .dy-inquiry-shell .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
