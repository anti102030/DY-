"use client";

import Link from "next/link";

export default function SignupBreadcrumb({
  current = "회원가입",
  detail,
}: {
  current?: string;
  detail?: string;
}) {
  return (
    <div className="dy-signup-breadcrumb">
      {/* 홈 아이콘 + 첫번째 > */}
      <div className="dy-breadcrumb-home-group">
        <Link
          href="/"
          className="dy-breadcrumb-home"
          aria-label="홈"
        >
          🏠
        </Link>

        <span className="dy-breadcrumb-first-arrow">
          &gt;
        </span>
      </div>

      {/* 고객센터 + 드롭다운 */}
      <div className="dy-breadcrumb-menu">
        <button
          type="button"
          className="dy-breadcrumb-menu-button"
        >
          <span className="dy-breadcrumb-menu-title">
            고객센터
          </span>

          <span className="dy-breadcrumb-menu-arrow">
            ▼
          </span>
        </button>

        <div className="dy-breadcrumb-dropdown">
          <Link href="/?city=서울">
            서울분양정보
          </Link>

          <Link href="/?city=경기">
            경기분양정보
          </Link>

          <Link href="/?city=인천">
            인천분양정보
          </Link>

          <Link href="/?feature=급매물">
            급매물분양
          </Link>

          <Link href="/?deposit_max=5000">
            낮은실입주금
          </Link>

          <Link href="/inquiry">
            문의게시판
          </Link>

          <Link href="/reviews">
            고객후기
          </Link>
        </div>
      </div>

      <span className="dy-breadcrumb-arrow">
        &gt;
      </span>

      <span className="dy-breadcrumb-current">
        {current}
      </span>

      {detail ? (
        <>
          <span className="dy-breadcrumb-arrow">
            &gt;
          </span>

          <strong className="dy-breadcrumb-detail">
            {detail}
          </strong>
        </>
      ) : null}

      <style jsx>{`
        .dy-signup-breadcrumb {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          color: #555;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          z-index: 1000;
        }

        .dy-breadcrumb-home-group {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .dy-breadcrumb-home {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #65b8e8;
          font-size: 15px;
          line-height: 1;
          text-decoration: none;
        }

        .dy-breadcrumb-first-arrow {
          color: #c9c9c9;
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
        }

        .dy-breadcrumb-menu {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 7px 0;
        }

        .dy-breadcrumb-menu-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #555;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-breadcrumb-menu-title {
          line-height: 1;
        }

        .dy-breadcrumb-menu-arrow {
          width: 13px;
          height: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8d8d8;
          background: #fff;
          color: #aaa;
          font-size: 6px;
          font-weight: 400;
          line-height: 1;
          box-sizing: border-box;
        }

        .dy-breadcrumb-arrow {
          color: #c9c9c9;
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
        }

        .dy-breadcrumb-current {
          color: #555;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }

        .dy-breadcrumb-detail {
          color: #555;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
        }

        .dy-breadcrumb-dropdown {
          position: absolute;
          top: calc(100% - 1px);
          left: -10px;
          display: none;
          width: 155px;
          border: 1px solid #d6d6d6;
          background: #fff;
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.14);
          z-index: 99999;
        }

        .dy-breadcrumb-menu:hover
          .dy-breadcrumb-dropdown,
        .dy-breadcrumb-menu:focus-within
          .dy-breadcrumb-dropdown {
          display: block;
        }

        .dy-breadcrumb-dropdown :global(a) {
          min-height: 39px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          border-bottom: 1px solid #eee;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy-breadcrumb-dropdown
          :global(a:last-child) {
          border-bottom: 0;
        }

        .dy-breadcrumb-dropdown
          :global(a:hover) {
          background: #f7f7f7;
          color: #f2a900;
        }

        @media (max-width: 760px) {
          .dy-signup-breadcrumb {
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 7px;
            font-size: 11px;
          }

          .dy-breadcrumb-home {
            font-size: 14px;
          }

          .dy-breadcrumb-menu-button,
          .dy-breadcrumb-current,
          .dy-breadcrumb-detail {
            font-size: 11px;
          }

          .dy-breadcrumb-dropdown {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}