"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type QuickConsultCardProps = {
  propertyId?: number | string;
};

function createCaptcha() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function BellIcon() {
  return (
    <svg
      className="dy-bell-svg"
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

export default function QuickConsultCard({
  propertyId,
}: QuickConsultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("0000");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function refreshCaptcha() {
    setCaptchaCode(createCaptcha());
    setCaptchaInput("");
    setError("");
  }

  function openModal() {
    refreshCaptcha();
    setIsOpen(true);
  }

  function closeModal() {
    if (submitting) return;

    setIsOpen(false);
    setError("");
  }

  function resetForm() {
    setRegion("");
    setPhone("");
    setPrivacyAgreed(false);
    setCaptchaInput("");
    setError("");
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedPhone = phone.replace(/\s/g, "");

    if (!region.trim()) {
      setError("지역을 입력해주세요.");
      return;
    }

    if (!normalizedPhone) {
      setError("연락처를 입력해주세요.");
      return;
    }

    if (captchaInput !== captchaCode) {
      setError("인증코드가 일치하지 않습니다.");
      setCaptchaCode(createCaptcha());
      setCaptchaInput("");
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보처리방침에 동의해주세요.");
      return;
    }

    setSubmitting(true);

    const message = propertyId
      ? `${propertyId}번 매물 기준 급매물 알림 신청입니다.`
      : "급매물 알림 신청입니다.";

    const { error: insertError } = await supabase
      .from("consultations")
      .insert({
        name: "급매알림신청",
        phone: normalizedPhone,
        region: region.trim(),
        message,
        status: "신규",
        source: propertyId
          ? "상세페이지 급매물 알림신청"
          : "메인 급매물 알림신청",
      });

    setSubmitting(false);

    if (insertError) {
      setError(`알림신청 실패: ${insertError.message}`);
      return;
    }

    window.alert(
      "급매물 알림 신청이 접수되었습니다.\n조건에 맞는 매물이 나오면 연락드리겠습니다."
    );

    resetForm();
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="dy-review-quick-consult"
        onClick={openModal}
        aria-label="급매물 알림 신청 열기"
      >
        <strong>급매물상담신청</strong>

        <div className="dy-review-quick-bell">
          <BellIcon />
        </div>
      </button>

      {isOpen && (
        <div
          className="dy-alert-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="dy-alert-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dy-alert-title"
          >
            <div className="dy-alert-modal-header">
              <strong>알림신청하기</strong>

              <button type="button" onClick={closeModal} aria-label="닫기">
                ×
              </button>
            </div>

            <div className="dy-alert-modal-body">
              <div className="dy-alert-modal-inner">
                <h2 id="dy-alert-title">급매물 알림 신청</h2>

                <p className="dy-alert-modal-description">
                  급매물이 나오면 알림 문자를 드립니다.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="dy-alert-field-row">
                    <label htmlFor="dy-alert-region">지역</label>

                    <input
                      id="dy-alert-region"
                      type="text"
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                      placeholder="시·구·동을 입력해주세요"
                    />
                  </div>

                  <div className="dy-alert-field-row">
                    <label htmlFor="dy-alert-phone">연락처</label>

                    <input
                      id="dy-alert-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="고객님의 연락처는 회신 알림용으로만 사용됩니다."
                      autoComplete="tel"
                    />
                  </div>

                  <div className="dy-captcha-row">
                    <button
                      className="dy-captcha-code"
                      type="button"
                      onClick={refreshCaptcha}
                      title="인증코드 새로고침"
                    >
                      {captchaCode}
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={captchaInput}
                      onChange={(event) =>
                        setCaptchaInput(
                          event.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="좌측 인증코드"
                    />

                    <label className="dy-review-alert-agree">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(event) =>
                          setPrivacyAgreed(event.target.checked)
                        }
                      />

                      <span>개인정보처리방침</span>
                      <b>보기</b>
                    </label>
                  </div>

                  {error && <p className="dy-captcha-error">{error}</p>}

                  <button
                    type="submit"
                    className="dy-alert-submit-button"
                    disabled={submitting}
                  >
                    {submitting ? "신청 중..." : "알림신청"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .dy-review-quick-consult .dy-review-quick-bell .dy-bell-svg {
          width: 86px !important;
          height: 86px !important;
          max-width: none !important;
          max-height: none !important;
        }

        .dy-alert-modal-backdrop {
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

        .dy-alert-modal {
          width: min(500px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          border: 3px solid #d9d9d9;
          background: #fff;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        }

        .dy-alert-modal-header {
          height: 40px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #353a48;
          color: #fff;
          box-sizing: border-box;
        }

        .dy-alert-modal-header strong {
          font-size: 14px;
          font-weight: 800;
        }

        .dy-alert-modal-header button {
          width: 30px;
          height: 30px;
          border: 0;
          background: transparent;
          color: #fff;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .dy-alert-modal-body {
          padding: 12px;
        }

        .dy-alert-modal-inner {
          padding: 24px 24px 20px;
          border: 5px solid #f0f0f0;
          box-sizing: border-box;
        }

        .dy-alert-modal-inner h2 {
          margin: 0 0 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ddd;
          color: #ae713c;
          font-size: 25px;
          font-weight: 500;
          text-align: center;
        }

        .dy-alert-modal-description {
          margin: 0 0 18px;
          color: #111;
          font-size: 17px;
          font-weight: 800;
          text-align: center;
        }

        .dy-alert-field-row {
          margin-bottom: 10px;
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          align-items: center;
          gap: 8px;
        }

        .dy-alert-field-row label {
          color: #111;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
        }

        .dy-alert-field-row input {
          width: 100%;
          height: 38px;
          padding: 0 10px;
          border: 1px solid #d6d6d6;
          background: #fff;
          color: #555;
          font-size: 12px;
          box-sizing: border-box;
        }

        .dy-captcha-row {
          margin: 8px 0 14px;
          display: grid;
          grid-template-columns: 118px 100px minmax(0, 1fr);
          align-items: center;
          gap: 8px;
        }

        .dy-captcha-code {
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

        .dy-captcha-row > input {
          width: 100%;
          height: 34px;
          padding: 0 8px;
          border: 1px solid #d6d6d6;
          box-sizing: border-box;
          font-size: 12px;
        }

        .dy-review-alert-agree {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #333;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .dy-review-alert-agree input {
          width: 18px;
          height: 18px;
          margin: 0;
        }

        .dy-review-alert-agree b {
          color: #f2a000;
        }

        .dy-captcha-error {
          margin: 0 0 9px;
          color: #c62828;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .dy-alert-submit-button {
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

        .dy-alert-submit-button:disabled {
          cursor: default;
          opacity: 0.65;
        }

        @media (max-width: 560px) {
          .dy-alert-modal-backdrop {
            padding: 10px;
          }

          .dy-alert-modal-inner {
            padding: 18px 14px;
          }

          .dy-alert-field-row {
            grid-template-columns: 70px minmax(0, 1fr);
          }

          .dy-captcha-row {
            grid-template-columns: 95px minmax(0, 1fr);
          }

          .dy-review-alert-agree {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
