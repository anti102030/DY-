"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  {
    href: "/admin/properties",
    label: "매물 관리",
  },
  {
    href: "/admin/reviews",
    label: "고객후기 관리",
  },
  {
    href: "/admin/consultations",
    label: "문의 관리",
  },
  {
    href: "/admin/villa-tours",
    label: "빌라투어 신청 관리",
  },
  {
    href: "/admin/pages",
    label: "페이지 관리",
  },
  {
    href: "/admin/settings",
    label: "사이트 기본설정",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <aside
      style={{
        position: "sticky",
        top: 0,
        width: 240,
        minWidth: 240,
        height: "100vh",
        padding: "26px 16px",
        background: "#202020",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* 관리자 메인으로 이동 */}
      <Link
        href="/admin"
        style={{
          display: "block",
          padding: "2px 12px 24px",
          marginBottom: 16,
          borderBottom:
            "1px solid rgba(255,255,255,0.14)",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 19,
            fontWeight: 900,
            lineHeight: 1.4,
          }}
        >
          DY다이아부동산
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#bcbcbc",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          관리자 페이지
        </div>
      </Link>

      {/* 관리자 메뉴 */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
        }}
      >
        {MENU.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                width: "100%",
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                padding: "0 15px",
                borderRadius: 5,

                background: active
                  ? "#f4b420"
                  : "transparent",

                color: active
                  ? "#111111"
                  : "#ffffff",

                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 실제 홈페이지는 새 탭 */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop:
            "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
              "1px solid rgba(255,255,255,0.35)",
            borderRadius: 5,
            background: "transparent",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          홈페이지 보기
        </Link>
      </div>
    </aside>
  );
}