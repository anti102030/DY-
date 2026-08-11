"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SiteSettings = {
  company_name: string;
  phone: string;
  consult_hours: string;
  address: string;
  email: string;
  header_consult_title: string;
  header_consult_text: string;
  footer_text: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  company_name: "DY다이아부동산",
  phone: "010-8426-8616",
  consult_hours: "365일 24시간 상담가능!",
  address: "",
  email: "",
  header_consult_title: "고객상담전화",
  header_consult_text: "내집마련 맞춤컨설팅!",
  footer_text: "DY다이아부동산",
};

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let mounted = true;

    async function checkLogin() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const result = await response.json();

        if (!mounted) return;

        setLoggedIn(result.loggedIn === true);
      } catch (error) {
        console.error("로그인 상태 확인 오류:", error);

        if (!mounted) return;

        setLoggedIn(false);
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    }

    checkLogin();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSiteSettings() {
      try {
        const response = await fetch("/api/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("사이트 설정을 불러오지 못했습니다.");
        }

        const result = await response.json();

        if (!mounted) return;

        setSiteSettings({
          ...DEFAULT_SETTINGS,
          ...(result?.settings ?? {}),
        });
      } catch (error) {
        console.error("사이트 기본설정 불러오기 오류:", error);
      }
    }

    loadSiteSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const phoneHref = useMemo(() => {
    const digits = siteSettings.phone.replace(/\D/g, "");
    return digits ? `tel:${digits}` : "#";
  }, [siteSettings.phone]);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null);

        alert(
          result?.error ??
            "로그아웃에 실패했습니다.",
        );

        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 오류:", error);

      alert(
        "로그아웃 중 오류가 발생했습니다.",
      );
    }
  }

  return (
    <header>
      <div className="top-bar">
        <div className="top-inner">
          <div className="top-left">
            <Link href="/">Home</Link>
            <Link href="/">매물찾기</Link>
          </div>

          <div className="top-right">
            {authReady ? (
              loggedIn ? (
                <>
                  <Link href="/member/edit">
                    정보수정
                  </Link>

                  <button
                    type="button"
                    className="dy-header-logout"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    회원가입
                  </Link>

                  <Link href="/login">
                    로그인
                  </Link>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>

      <div className="main-header">
        <a
          href={phoneHref}
          className="header-contact"
        >
          <img
            src="/km-header-phone.png"
            alt=""
            className="header-contact-reference-icon"
          />

          <div>
            <p>
              {siteSettings.header_consult_title}

              <small>
                {siteSettings.consult_hours}
              </small>
            </p>

            <strong>
              {siteSettings.phone}
            </strong>
          </div>
        </a>

        <Link
          href="/"
          className="main-logo main-logo-vertical"
        >
          <img
            src="/dy-logo-transparent.png"
            alt={siteSettings.company_name}
            className="logo-image"
          />
        </Link>

        <div className="header-consult">
          <Link
            href="/inquiry/write"
            className="header-consult-text-link"
          >
            <strong>
              {siteSettings.header_consult_text}
            </strong>

            <p>
              1:1 상담문의 바로가기 Click
            </p>
          </Link>

          <img
            src="/km-header-house.png"
            alt=""
            className="header-consult-reference-icon"
          />
        </div>
      </div>

      <nav className="main-nav">
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

        <div className="dy-inquiry-menu">
          <Link
            href="/inquiry"
            className="dy-inquiry-main"
          >
            문의게시판
          </Link>

          <div className="dy-inquiry-submenu">
            <Link href="/inquiry">
              문의게시판
            </Link>

            <Link href="/villa-tour">
              빌라투어신청
            </Link>
          </div>
        </div>

        <Link href="/reviews">
          고객후기
        </Link>
      </nav>

      <style>{`
        .main-nav {
          position: relative;
          overflow: visible !important;
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 18px;

          border: 0 !important;
          border-left: 0 !important;
          border-right: 0 !important;
        }

        .top-right > a,
        .top-right > button {
          margin: 0 !important;

          padding-left: 0 !important;
          padding-right: 0 !important;

          border: 0 !important;
          border-left: 0 !important;
          border-right: 0 !important;

          background: transparent !important;

          box-shadow: none !important;
        }

        .top-right > a::before,
        .top-right > a::after,
        .top-right > button::before,
        .top-right > button::after {
          display: none !important;

          width: 0 !important;
          height: 0 !important;

          border: 0 !important;

          content: none !important;
        }

        .dy-header-logout {
          margin: 0 !important;

          padding: 0 !important;

          border: 0 !important;

          background: transparent !important;

          color: inherit;

          font: inherit;

          cursor: pointer;
        }

        .header-contact {
          display: flex;
          align-items: center;

          gap: 15px;

          color: inherit;

          text-decoration: none;

          cursor: pointer;
        }

        .header-contact:hover strong {
          color: #ffb51b;
        }

        .header-consult {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 15px;

          text-align: right;
        }

        .header-consult-text-link {
          display: block;

          color: inherit;

          text-decoration: none;
        }

        .header-consult-reference-icon,
        .header-contact-reference-icon {
          pointer-events: none;

          user-select: none;
        }

        .dy-inquiry-menu {
          position: relative;

          display: flex;
          align-items: stretch;
          justify-content: center;

          height: 100%;

          z-index: 9999;
        }

        .dy-inquiry-main {
          display: flex !important;

          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;

          padding: 0 28px;

          box-sizing: border-box;

          white-space: nowrap;
        }

        .dy-inquiry-submenu {
          position: absolute;

          top: 100%;
          left: 0;

          display: none;

          width: 100%;

          min-width: 150px;

          border: 1px solid #d8d8d8;

          background: #fff;

          box-shadow:
            0 5px 12px
            rgba(0, 0, 0, 0.16);

          z-index: 99999;
        }

        .dy-inquiry-submenu a {
          display: flex !important;

          align-items: center;
          justify-content: center;

          min-height: 46px;

          border-bottom:
            1px solid #e5e5e5;

          background: #fff;

          color: #222 !important;

          font-size: 14px;
          font-weight: 700;

          text-decoration: none;
        }

        .dy-inquiry-submenu a:last-child {
          border-bottom: 0;
        }

        .dy-inquiry-menu:hover
          .dy-inquiry-submenu,
        .dy-inquiry-menu:focus-within
          .dy-inquiry-submenu {
          display: block;
        }
      `}</style>
    </header>
  );
}
