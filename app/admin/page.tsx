import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCount(table: string) {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    return null;
  }

  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [
    propertyCount,
    reviewCount,
    consultationCount,
    villaTourCount,
  ] = await Promise.all([
    getCount("properties"),
    getCount("reviews"),
    getCount("consultations"),
    getCount("villa_tours"),
  ]);

  return (
    <main className="admin-page dy-admin-dashboard">
      <div className="dy-dashboard-heading">
        <div>
          <h1>DY다이아부동산 관리자 페이지</h1>

          <p>
            매물, 고객후기, 문의, 빌라투어 신청과
            사이트 내용을 한곳에서 관리합니다.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          홈페이지 보기
        </Link>
      </div>

      <section className="dy-dashboard-stats">
        <Link
          href="/admin/properties"
          className="dy-stat-card"
        >
          <span>등록 매물</span>

          <strong>
            {propertyCount ?? "-"}
          </strong>

          <small>
            매물 관리 바로가기
          </small>
        </Link>

        <Link
          href="/admin/reviews"
          className="dy-stat-card"
        >
          <span>고객후기</span>

          <strong>
            {reviewCount ?? "-"}
          </strong>

          <small>
            후기 · 베스트 관리
          </small>
        </Link>

        <Link
          href="/admin/consultations"
          className="dy-stat-card"
        >
          <span>문의 접수</span>

          <strong>
            {consultationCount ?? "-"}
          </strong>

          <small>
            상담신청 상태 관리
          </small>
        </Link>

        <Link
          href="/admin/villa-tours"
          className="dy-stat-card"
        >
          <span>빌라투어 신청</span>

          <strong>
            {villaTourCount ?? "-"}
          </strong>

          <small>
            신청 내역 관리
          </small>
        </Link>
      </section>

      <section className="dy-dashboard-section">
        <h2>콘텐츠 관리</h2>

        <div className="dy-dashboard-menu-grid">
          <Link href="/admin/properties">
            <strong>매물 관리</strong>

            <span>
              등록 · 수정 · 삭제 · 공개상태 관리
            </span>
          </Link>

          <Link href="/admin/reviews">
            <strong>고객후기 관리</strong>

            <span>
              후기 등록 · 수정 · 삭제 · 베스트 지정
            </span>
          </Link>

          <Link href="/admin/consultations">
            <strong>문의 관리</strong>

            <span>
              신규 문의 확인 · 상태 변경 · 삭제
            </span>
          </Link>

          <Link href="/admin/villa-tours">
            <strong>빌라투어 신청 관리</strong>

            <span>
              신청 확인 · 일정 · 상태 · 관리자 메모
            </span>
          </Link>
        </div>
      </section>

      <section className="dy-dashboard-section">
        <h2>사이트 관리</h2>

        <div className="dy-dashboard-menu-grid">
          <Link href="/admin/pages">
            <strong>페이지 관리</strong>

            <span>
              페이지 제목 · 설명 · 노출 설정
            </span>
          </Link>

          <Link href="/admin/settings">
            <strong>사이트 기본설정</strong>

            <span>
              회사명 · 연락처 · 기본 문구 · 노출 설정
            </span>
          </Link>
        </div>
      </section>

      <style>{`
        .dy-admin-dashboard {
          width: 100%;
          color: #222;
        }

        .dy-dashboard-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dy-dashboard-heading h1 {
          margin: 0;
          color: #111;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-dashboard-heading p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
          line-height: 1.6;
        }

        .dy-dashboard-heading > a {
          min-width: 120px;
          height: 42px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #333;
          border-radius: 5px;

          background: #fff;
          color: #222;

          font-size: 13px;
          font-weight: 800;

          text-decoration: none;
        }

        .dy-dashboard-stats {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 16px;
        }

        .dy-stat-card {
          min-height: 150px;
          padding: 22px;

          border: 1px solid #e0e0e0;
          border-radius: 8px;

          background: #fff;

          color: inherit;
          text-decoration: none;

          box-sizing: border-box;

          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .dy-stat-card:hover {
          transform: translateY(-2px);

          border-color: #ccc;

          box-shadow:
            0 5px 18px
            rgba(0, 0, 0, 0.07);
        }

        .dy-stat-card span {
          display: block;

          color: #777;

          font-size: 13px;
          font-weight: 700;
        }

        .dy-stat-card strong {
          display: block;

          margin-top: 12px;

          color: #111;

          font-size: 34px;
          font-weight: 900;
        }

        .dy-stat-card small {
          display: block;

          margin-top: 12px;

          color: #999;

          font-size: 11px;
        }

        .dy-dashboard-section {
          margin-top: 30px;
        }

        .dy-dashboard-section h2 {
          margin: 0 0 14px;

          color: #222;

          font-size: 20px;
          font-weight: 900;
        }

        .dy-dashboard-menu-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 14px;
        }

        .dy-dashboard-menu-grid > a {
          min-height: 96px;

          padding: 20px;

          border: 1px solid #e0e0e0;
          border-radius: 8px;

          background: #fff;

          color: #222;

          text-decoration: none;

          box-sizing: border-box;

          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .dy-dashboard-menu-grid > a:hover {
          transform: translateY(-2px);

          border-color: #ccc;

          box-shadow:
            0 5px 18px
            rgba(0, 0, 0, 0.07);
        }

        .dy-dashboard-menu-grid strong {
          display: block;

          color: #111;

          font-size: 16px;
          font-weight: 900;
        }

        .dy-dashboard-menu-grid span {
          display: block;

          margin-top: 8px;

          color: #777;

          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 1050px) {
          .dy-dashboard-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .dy-dashboard-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dy-dashboard-stats,
          .dy-dashboard-menu-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}