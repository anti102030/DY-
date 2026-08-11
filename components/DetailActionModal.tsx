"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DetailActionModalProps = {
  mode: "alert" | "consult";
  trigger: "card" | "button";
  propertyId: number;
  propertyTitle: string;
  defaultRegion?: string;
};

function createCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function BellIcon() {
  return (
    <svg
      className="dy-bell-svg dy-detail-modal-trigger-bell"
      viewBox="0 0 120 120"
      aria-hidden="true"
      width="86"
      height="86"
    >
      <path
        className="dy-bell-body"
        d="M60 26c-17 0-29 13-29 31v19c0 7-3 13-9 18h76c-6-5-9-11-9-18V57c0-18-12-31-29-31Z"
      />

      <path
        className="dy-bell-clapper"
        d="M48 94c2 9 7 14 12 14s10-5 12-14"
      />

      <path
        className="dy-bell-wave dy-bell-wave-one"
        d="M86 26c8 7 12 15 13 25"
      />

      <path
        className="dy-bell-wave dy-bell-wave-two"
        d="M94 17c12 10 19 23 20 38"
      />
    </svg>
  );
}

export default function DetailActionModal({
  mode,
  trigger,
  propertyId,
  propertyTitle,
  defaultRegion = "",
}: DetailActionModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(defaultRegion);
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState("");

  const isAlert = mode === "alert";

  const labels = useMemo(
    () =>
      isAlert
        ? {
            bar: "알림신청하기",
            title: "급매물 알림 신청",
            description: "급매물이 나오면 알림 문자를 드립니다.",
            button: "알림신청",
          }
        : {
            bar: "급매물상담신청",
            title: "급매물 상담 신청",
            description: "확인하신 매물과 급매 조건을 빠르게 상담해드립니다.",
            button: "상담신청",
          },
    [isAlert],
  );

  useEffect(() => {
    if (!open) return;

    setVerificationCode(createCode());
    setVerificationInput("");
    setResult("");

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function refreshCode() {
    setVerificationCode(createCode());
    setVerificationInput("");
    setResult("");
  }

  function closeModal() {
    if (saving) return;
    setOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");

    const normalizedPhone = phone.replace(/\s/g, "");

    if (!region.trim()) {
      setResult("지역을 선택하거나 입력해 주세요.");
      return;
    }

    if (!normalizedPhone) {
      setResult("연락처를 입력해 주세요.");
      return;
    }

    if (verificationInput !== verificationCode) {
      setResult("인증코드를 정확히 입력해 주세요.");
      refreshCode();
      return;
    }

    if (!agreed) {
      setResult("개인정보처리방침에 동의해 주세요.");
      return;
    }

    setSaving(true);

    const message = isAlert
      ? `${propertyId}번 매물 기준 급매물 알림 신청입니다. (${propertyTitle})`
      : `${propertyId}번 매물 급매 상담 신청입니다. (${propertyTitle})`;

    const { error } = await supabase.from("consultations").insert({
      name: isAlert ? "급매알림신청" : "급매상담신청",
      phone: normalizedPhone,
      region: region.trim(),
      message,
      status: "신규",
      source: isAlert
        ? "상세페이지 급매물 알림신청"
        : "상세페이지 급매물 상담신청",
    });

    setSaving(false);

    if (error) {
      setResult(`신청 실패: ${error.message}`);
      return;
    }

    setResult(
      isAlert
        ? "급매물 알림 신청이 접수되었습니다."
        : "급매물 상담 신청이 접수되었습니다.",
    );
    setPhone("");
    setVerificationInput("");
    setVerificationCode(createCode());
    setAgreed(false);
    router.refresh();

    window.setTimeout(() => {
      setOpen(false);
      setResult("");
    }, 900);
  }

  return (
    <>
      {trigger === "card" ? (
        <button
          type="button"
          className="km-detail-alert-box km-detail-alert-standalone dy-detail-alert-trigger"
          onClick={() => setOpen(true)}
        >
          <strong>알림 신청</strong>
          <BellIcon />
          <p>
            확인하신 매물과 조건이 같은 매물이 나오면 문자로 안내드립니다.
          </p>
        </button>
      ) : (
        <button
          type="button"
          className="dy-detail-consult-trigger"
          onClick={() => setOpen(true)}
        >
          빠른상담신청
        </button>
      )}

      {open ? (
        <div
          className="dy-detail-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="dy-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`dy-detail-modal-title-${mode}`}
          >
            <header className="dy-detail-modal-bar">
              <strong>{labels.bar}</strong>
              <button
                type="button"
                aria-label="팝업 닫기"
                onClick={closeModal}
              >
                ×
              </button>
            </header>

            <div className="dy-detail-modal-inner">
              <h2 id={`dy-detail-modal-title-${mode}`}>
                {labels.title}
              </h2>

              <p className="dy-detail-modal-description">
                {labels.description}
              </p>

              <form onSubmit={handleSubmit}>
                <label className="dy-detail-modal-row">
                  <span>지역</span>
                  <input
                    type="text"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    placeholder="시·구·동을 입력해 주세요."
                  />
                </label>

                <label className="dy-detail-modal-row">
                  <span>연락처</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="고객님의 연락처는 회신용으로만 사용됩니다."
                    autoComplete="tel"
                  />
                </label>

                <div className="dy-detail-modal-code-row">
                  <button
                    type="button"
                    className="dy-detail-modal-code"
                    onClick={refreshCode}
                    title="클릭하면 인증코드가 바뀝니다."
                  >
                    {verificationCode || "----"}
                  </button>

                  <input
                    type="text"
                    value={verificationInput}
                    onChange={(event) =>
                      setVerificationInput(
                        event.target.value.replace(/\D/g, "").slice(0, 4),
                      )
                    }
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="좌측 인증코드"
                    aria-label="인증코드 입력"
                  />

                  <label className="dy-detail-modal-agree">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) =>
                        setAgreed(event.target.checked)
                      }
                    />
                    <span>개인정보처리방침</span>
                    <b>보기</b>
                  </label>
                </div>

                {result ? (
                  <p
                    className={`dy-detail-modal-result${
                      result.includes("접수") ? " is-success" : ""
                    }`}
                  >
                    {result}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="dy-detail-modal-submit"
                  disabled={saving}
                >
                  {saving ? "신청 중..." : labels.button}
                </button>
              </form>
            </div>
          </section>
        </div>
      ) : null}

      <style>{`
            .dy-detail-alert-trigger {
              width: 100%;
              border: 0;
              cursor: pointer;
              font: inherit;
              appearance: none;
              -webkit-appearance: none;
              transform: none !important;
              scale: 1 !important;
              transition: none !important;
            }

            .dy-detail-alert-trigger:hover,
            .dy-detail-alert-trigger:focus,
            .dy-detail-alert-trigger:active {
              transform: none !important;
              scale: 1 !important;
            }

            .dy-detail-alert-trigger .dy-detail-modal-trigger-bell {
              width: 86px !important;
              height: 86px !important;
              min-width: 86px !important;
              min-height: 86px !important;
              max-width: none !important;
              max-height: none !important;
              display: block;
              margin: 4px auto;
              flex: 0 0 86px;
              transform: none !important;
              transition: none !important;
            }

            .dy-detail-alert-trigger:active .dy-detail-modal-trigger-bell {
              width: 86px !important;
              height: 86px !important;
              transform: none !important;
            }

            .dy-detail-consult-trigger {
              width: 100%;
              height: 100%;
              border: 1px solid #222;
              border-radius: 2px;
              background: #222;
              color: #fff;
              font-size: 12px;
              font-weight: 800;
              cursor: pointer;
            }

            .dy-detail-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 99999;
              padding: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.55);
              box-sizing: border-box;
            }

            .dy-detail-modal {
              width: min(500px, 100%);
              max-height: calc(100vh - 40px);
              overflow-y: auto;
              border: 3px solid #d9d9d9;
              background: #fff;
              box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
            }

            .dy-detail-modal-bar {
              height: 40px;
              padding: 0 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #353a48;
              color: #fff;
              box-sizing: border-box;
            }

            .dy-detail-modal-bar strong {
              font-size: 14px;
              font-weight: 800;
            }

            .dy-detail-modal-bar button {
              width: 30px;
              height: 30px;
              border: 0;
              background: transparent;
              color: #fff;
              font-size: 28px;
              line-height: 1;
              cursor: pointer;
            }

            .dy-detail-modal-inner {
              margin: 12px;
              padding: 24px 24px 20px;
              border: 5px solid #f0f0f0;
              box-sizing: border-box;
            }

            .dy-detail-modal-inner h2 {
              margin: 0 0 18px;
              padding-bottom: 14px;
              border-bottom: 1px solid #ddd;
              color: #ae713c;
              font-size: 25px;
              font-weight: 500;
              text-align: center;
            }

            .dy-detail-modal-description {
              margin: 0 0 18px;
              color: #111;
              font-size: 17px;
              font-weight: 800;
              text-align: center;
            }

            .dy-detail-modal-row {
              margin-bottom: 10px;
              display: grid;
              grid-template-columns: 105px minmax(0, 1fr);
              align-items: center;
              gap: 8px;
            }

            .dy-detail-modal-row > span {
              color: #111;
              font-size: 14px;
              font-weight: 800;
              text-align: center;
            }

            .dy-detail-modal-row input {
              width: 100%;
              height: 38px;
              padding: 0 10px;
              border: 1px solid #d6d6d6;
              background: #fff;
              color: #555;
              font-size: 12px;
              box-sizing: border-box;
            }

            .dy-detail-modal-code-row {
              margin: 8px 0 14px;
              display: grid;
              grid-template-columns: 118px 100px minmax(0, 1fr);
              align-items: center;
              gap: 8px;
            }

            .dy-detail-modal-code {
              height: 34px;
              border: 0;
              background: transparent;
              color: #222;
              font-family: Georgia, serif;
              font-size: 22px;
              font-style: italic;
              text-decoration: line-through;
              cursor: pointer;
              transform: rotate(-4deg);
            }

            .dy-detail-modal-code-row > input {
              width: 100%;
              height: 34px;
              padding: 0 8px;
              border: 1px solid #d6d6d6;
              box-sizing: border-box;
              font-size: 12px;
            }

            .dy-detail-modal-agree {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #333;
              font-size: 12px;
              font-weight: 800;
              white-space: nowrap;
            }

            .dy-detail-modal-agree input {
              width: 18px;
              height: 18px;
              margin: 0;
            }

            .dy-detail-modal-agree b {
              color: #f2a000;
            }

            .dy-detail-modal-result {
              margin: 0 0 9px;
              color: #c62828;
              font-size: 12px;
              font-weight: 700;
              text-align: center;
            }

            .dy-detail-modal-result.is-success {
              color: #2e7d32;
            }

            .dy-detail-modal-submit {
              width: 100%;
              height: 42px;
              border: 1px solid #efa400;
              border-radius: 6px;
              background: #ffbd2e;
              color: #fff;
              font-size: 16px;
              font-weight: 800;
              cursor: pointer;
            }

            .dy-detail-modal-submit:disabled {
              cursor: default;
              opacity: 0.65;
            }

            @media (max-width: 560px) {
              .dy-detail-modal-overlay {
                padding: 10px;
              }

              .dy-detail-modal-inner {
                margin: 8px;
                padding: 18px 14px;
              }

              .dy-detail-modal-inner h2 {
                font-size: 21px;
              }

              .dy-detail-modal-description {
                font-size: 15px;
              }

              .dy-detail-modal-row {
                grid-template-columns: 70px minmax(0, 1fr);
              }

              .dy-detail-modal-code-row {
                grid-template-columns: 95px minmax(0, 1fr);
              }

              .dy-detail-modal-agree {
                grid-column: 1 / -1;
                justify-content: center;
              }
            }
          `}</style>
    </>
  );
}
