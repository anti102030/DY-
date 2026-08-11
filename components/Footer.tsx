import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("setting_key, setting_value");

  if (error) {
    console.error("Footer 사이트 설정 불러오기 오류:", error);
    return DEFAULT_SETTINGS;
  }

  const values = Object.fromEntries(
    (data ?? []).map((item) => [
      item.setting_key,
      item.setting_value ?? "",
    ]),
  );

  return {
    ...DEFAULT_SETTINGS,
    ...values,
  };
}

export default async function Footer() {
  const settings = await getSiteSettings();
  const phoneHref = `tel:${settings.phone.replace(/\D/g, "")}`;

  return (
    <footer className="km-footer" id="footer">
      <section className="dy-footer-top">
        <div className="dy-footer-inner dy-footer-top-inner">
          <Link href="/inquiry" className="dy-footer-guide">
            <img
              src="/footer-call-icon.png"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>1:1 빠른고객문의</strong>
              <p>시간 : {settings.consult_hours}</p>
              <p>전화 : {settings.phone}</p>
            </div>
          </Link>

          <Link href="/inquiry" className="dy-footer-guide">
            <img
              src="/footer-board-icon.png"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>문의게시판</strong>
              <p>간편한문의로 쉽고 빠르게</p>
              <p>문의 내용을 남겨주세요.</p>
            </div>
          </Link>

          <Link href="/consult-write" className="dy-footer-guide">
            <img
              src="/footer-map-icon.png"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>오시는길</strong>
              <p>{settings.company_name} 위치 안내</p>
              <p>
                {settings.address
                  ? settings.address
                  : "내집마련의 꿈을 이루어 드립니다."}
              </p>
            </div>
          </Link>

          <a
            href={phoneHref}
            className="dy-footer-phone"
          >
            <span>고객상담센터</span>
            <strong>{settings.phone}</strong>
          </a>
        </div>
      </section>

      <section className="dy-footer-menu-bar">
        <div className="dy-footer-inner dy-footer-menu-inner">
          <nav>
            <Link href="/terms">이용약관</Link>

            <Link
              href="/privacy"
              className="is-active"
            >
              개인정보처리방침
            </Link>

            <Link href="/email-policy">
              이메일수집거부
            </Link>

            <Link href="/consult-write">
              오시는길
            </Link>

            <Link href="/inquiry">
              문의게시판
            </Link>
          </nav>

          <a
            href="#top"
            className="dy-footer-top-link"
          >
            <span>▲</span>
            TOP
          </a>
        </div>
      </section>

      <section className="dy-footer-company">
        <div className="dy-footer-inner dy-footer-company-inner">
          <div className="dy-footer-company-text">
            <p>
              <strong>
                회사명 : {settings.company_name}
              </strong>

              <span>
                대표전화 : {settings.phone}
              </span>
            </p>

            <p>
              {settings.footer_text || "수도권 신축분양 · 매매 전문"}

              <span>
                {settings.consult_hours}
              </span>
            </p>

            {settings.address && (
              <p>
                주소 : {settings.address}
              </p>
            )}

            {settings.email && (
              <p>
                이메일 : {settings.email}
              </p>
            )}

            <small className="dy-footer-copyright">
              <span>
                Copyright © 2026 {settings.company_name}. All rights reserved.
              </span>

              <Link
                href="/admin"
                className="dy-footer-admin-link"
                aria-label="관리자 로그인"
                title="관리자"
              >
                ⚙
              </Link>
            </small>
          </div>

          <Link
            href="/"
            className="dy-footer-logo"
          >
            <img
              src="/dy-logo-transparent.png"
              alt={settings.company_name}
            />
          </Link>
        </div>
      </section>

      <style>{`
        .km-footer {
          width: 100%;
          margin-top: 42px;
        }

        .dy-footer-inner {
          width: 1210px;
          max-width: calc(100% - 32px);
          margin: 0 auto;
          box-sizing: border-box;
        }

        .dy-footer-top {
          width: 100%;
          border-top: 1px solid #d6d6d6;
          background: #f7f7f7;
        }

        .dy-footer-top-inner {
          min-height: 124px;
          display: grid;
          grid-template-columns:
            1fr 1fr 1fr 270px;
          align-items: center;
          column-gap: 34px;
        }

        .dy-footer-guide {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          color: #111;
          text-decoration: none;
          cursor: pointer;
        }

        .dy-footer-guide img {
          width: 66px;
          height: 66px;
          flex: 0 0 66px;
          display: block;
          object-fit: contain;
        }

        .dy-footer-guide strong {
          display: block;
          margin-bottom: 6px;
          color: #111;
          font-size: 15px;
          font-weight: 900;
        }

        .dy-footer-guide p {
          margin: 2px 0;
          color: #222;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.35;
          white-space: nowrap;
        }

        .dy-footer-phone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #111;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
        }

        .dy-footer-phone span {
          margin-bottom: 2px;
          color: #111;
          font-size: 23px;
          font-weight: 900;
          white-space: nowrap;
        }

        .dy-footer-phone strong {
          color: #ffb51b;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -1px;
          white-space: nowrap;
        }

        .dy-footer-menu-bar {
          width: 100%;
          border-bottom: 1px solid #4a4a4a;
          background: #343434;
        }

        .dy-footer-menu-inner {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dy-footer-menu-inner nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .dy-footer-menu-inner nav a {
          color: #bdbdbd;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .dy-footer-menu-inner nav a.is-active {
          color: #fff;
          text-decoration: underline;
        }

        .dy-footer-top-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.15;
          text-decoration: none;
        }

        .dy-footer-company {
          width: 100%;
          background: #242424;
        }

        .dy-footer-company-inner {
          min-height: 124px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .dy-footer-company-text {
          color: #d8d8d8;
        }

        .dy-footer-company-text p {
          margin: 4px 0;
          color: #d8d8d8;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.5;
        }

        .dy-footer-company-text p span {
          margin-left: 18px;
        }

        .dy-footer-company-text strong {
          color: #fff;
        }

        .dy-footer-company-text small {
          display: block;
          margin-top: 12px;
          color: #8d8d8d;
          font-size: 11px;
        }

        .dy-footer-copyright {
          display: flex !important;
          align-items: center;
          gap: 5px;
        }

        .dy-footer-admin-link {
          width: 17px;
          height: 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          color: #777;
          font-size: 13px;
          line-height: 1;

          text-decoration: none;

          opacity: 0.6;

          transition:
            color 0.15s ease,
            opacity 0.15s ease,
            transform 0.15s ease;
        }

        .dy-footer-admin-link:hover {
          color: #ffffff;
          opacity: 1;
          transform: rotate(20deg);
        }

        .dy-footer-logo {
          width: 230px;
          flex: 0 0 230px;
        }

        .dy-footer-logo img {
          width: 100%;
          max-height: 76px;
          display: block;
          object-fit: contain;
        }

        @media (max-width: 1100px) {
          .dy-footer-top-inner {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 22px;
            padding: 20px 0;
          }
        }

        @media (max-width: 760px) {
          .dy-footer-inner {
            max-width: calc(100% - 24px);
          }

          .dy-footer-top-inner {
            grid-template-columns: 1fr;
          }

          .dy-footer-menu-inner {
            padding: 14px 0;
            gap: 16px;
          }

          .dy-footer-menu-inner nav {
            flex-wrap: wrap;
            gap: 12px 18px;
          }

          .dy-footer-company-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 0;
          }

          .dy-footer-company-text p span {
            display: block;
            margin-left: 0;
          }

          .dy-footer-copyright {
            flex-wrap: wrap;
          }

          .dy-footer-logo {
            width: 190px;
            flex-basis: auto;
          }
        }
      `}</style>
    </footer>
  );
}
