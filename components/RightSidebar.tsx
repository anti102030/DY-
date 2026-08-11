"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RecentViewedProperties from "@/components/RecentViewedProperties";

type GuideIcon =
  | "tour"
  | "price"
  | "check"
  | "contract"
  | "loan"
  | "deed"
  | "move";

const steps: Array<[GuideIcon, string]> = [
  ["tour", "DY다이아부동산 투어"],
  ["price", "각 지역의 분양매물 & 시세 확인"],
  ["check", "현장 준공여부 & 불법증축 확인"],
  ["contract", "계약진행 / 안심보증"],
  ["loan", "대출 진행 / 전국은행 통합조회"],
  ["deed", "소유권 이전등기 / 은행잔금"],
  ["move", "입주/선물 전달"],
];

function GuideIconImage({ type }: { type: GuideIcon }) {
  return (
    <img
      src={`/${type}.png`}
      alt=""
      aria-hidden="true"
      width={36}
      height={32}
    />
  );
}

const depositLinks = [
  {
    label: "무입주금",
    href: "/?deposit=0",
  },
  {
    label: "1000만원 미만",
    href: "/?deposit_max=1000",
  },
  {
    label: "3000만원 미만",
    href: "/?deposit_max=3000",
  },
  {
    label: "5000만원 미만",
    href: "/?deposit_max=5000",
  },
];

const typeLinks = [
  {
    label: "원 · 투룸",
    href: "/?rooms_group=1-2",
  },
  {
    label: "쓰리 · 포룸",
    href: "/?rooms_group=3-4",
  },
  {
    label: "테라스 · 복층",
    href: "/?feature=테라스복층",
  },
  {
    label: "타운하우스",
    href: "/?property_type=타운하우스",
  },
];

export default function RightSidebar() {
  const router = useRouter();

  function goToVillaTour() {
    router.push("/villa-tour");
  }

  return (
    <aside className="km-right-sidebar" id="top">
      <section className="km-safe-box">
        <div className="km-safe-head">
          <h2>안전한 내 집 구하기!</h2>

          <Link href="/villa-tour" className="km-tour-link">
            DY다이아부동산 투어
          </Link>
        </div>

        <div className="km-safe-steps">
          {steps.slice(1).map(([icon, text]) => (
            <div
              key={text}
              onClick={goToVillaTour}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  goToVillaTour();
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <span>
                <GuideIconImage type={icon} />
              </span>

              <strong>{text}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="km-free-consult">
        <h2>무료상담신청</h2>

        <form action="/consult-write" method="get">
          <textarea
            name="memo"
            placeholder="상담내용을 적어주세요 확인 후 빠른 답변 드리도록 하겠습니다"
          />

          <input name="phone" placeholder="연락처" />

          <div className="km-captcha-row">
            <span className="km-captcha-code">64067</span>
            <input name="captcha" placeholder="인증코드" />
          </div>

          <label className="km-privacy-row">
            <input
              type="radio"
              name="privacy"
              value="disagree"
              defaultChecked
            />
            동의 안 함

            <input
              type="radio"
              name="privacy"
              value="agree"
            />
            동의함
          </label>

          <button type="submit">신청하기</button>
        </form>
      </section>

      <RecentViewedProperties />

      <section className="km-side-menu-box">
        <h2>입주금별 정보</h2>

        <div>
          {depositLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="km-side-menu-box">
        <h2>매물종류</h2>

        <div>
          {typeLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <a className="km-top-link" href="#top">
        <span>▲</span>
        TOP
      </a>
    </aside>
  );
}
