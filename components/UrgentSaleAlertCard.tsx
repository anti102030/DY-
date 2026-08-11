"use client";

import { FormEvent, useEffect, useState } from "react";

function makeCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function UrgentSaleAlertCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("급매물 상담신청드립니다.");
  const [privacy, setPrivacy] = useState(false);
  const [code, setCode] = useState("0000");
  const [codeInput, setCodeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function refreshCode() {
    setCode(makeCode());
    setCodeInput("");
  }

  function openModal() {
    refreshCode();
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (codeInput !== code) {
      alert("인증코드가 일치하지 않습니다.");
      refreshCode();
      return;
    }

    if (!privacy) {
      alert("개인정보 처리방침에 동의해주세요.");
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      alert("급매물 상담 신청이 접수되었습니다.");
      setName("");
      setPhone("");
      setMessage("급매물 상담신청드립니다.");
      setPrivacy(false);
      setCodeInput("");
      setSubmitting(false);
      setOpen(false);
    }, 300);
  }

  return (
    <>
      <button
        type="button"
        className="dy-urgent-review-card"
        onClick={openModal}
      >
        <strong>급매물상담신청</strong>

        <span className="dy-urgent-bell" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <path d="M60 25c-17 0-29 13-29 31v20c0 7-3 13-9 18h76c-6-5-9-11-9-18V56c0-18-12-31-29-31Z" />
            <path d="M48 94c2 9 7 14 12 14s10-5 12-14" />
            <path className="orange" d="M88 27c8 7 12 15 13 25" />
            <path className="orange" d="M96 17c12 10 19 23 20 38" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="dy-urgent-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="dy-urgent-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dy-urgent-modal-title"
          >
            <div className="dy-urgent-modal-header">
              <strong>급매물상담신청</strong>
              <button type="button" onClick={closeModal} aria-label="닫기">
                ×
              </button>
            </div>

            <div className="dy-urgent-modal-body">
              <h2 id="dy-urgent-modal-title">급매물상담신청</h2>
              <p>원하시는 조건의 급매물을 빠르게 안내해드리겠습니다.</p>

              <form onSubmit={submit}>
                <label>
                  <span>이름</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="이름을 입력해주세요"
                  />
                </label>

                <label>
                  <span>연락처</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="010-0000-0000"
                  />
                </label>

                <label className="message">
                  <span>상담내용</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={3}
                  />
                </label>

                <div className="dy-urgent-code-row">
                  <div className="dy-urgent-code">{code}</div>

                  <input
                    value={codeInput}
                    onChange={(event) =>
                      setCodeInput(
                        event.target.value.replace(/\\D/g, "").slice(0, 4)
                      )
                    }
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="4자리 입력"
                  />

                  <button type="button" onClick={refreshCode}>
                    새로고침
                  </button>
                </div>

                <div className="dy-urgent-privacy">
                  <label>
                    <input
                      type="checkbox"
                      checked={privacy}
                      onChange={(event) => setPrivacy(event.target.checked)}
                    />
                    <span>개인정보 처리방침에 동의합니다.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="dy-urgent-submit"
                  disabled={submitting}
                >
                  {submitting ? "신청 중..." : "상담신청"}
                </button>
              </form>
            </div>
          </section>
        </div>
      )}

      <style jsx global>{`
        .dy-urgent-review-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 180px;
          min-height: 198px;
          margin: 0;
          padding: 16px 12px;
          border: 1px solid #d8d8d8;
          background: #ffffff;
          box-sizing: border-box;
          cursor: pointer;
        }

        .dy-urgent-review-card > strong {
          color: #111111;
          font-size: 18px;
          font-weight: 900;
        }

        .dy-urgent-bell {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 86px;
          height: 100px;
          margin-top: 24px;
        }

        .dy-urgent-bell svg {
          width: 74px;
          height: 74px;
          fill: none;
          stroke: #494949;
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dy-urgent-bell .orange {
          stroke: #f2a03b;
          stroke-width: 5;
        }

        .dy-urgent-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: rgba(0, 0, 0, 0.52);
          box-sizing: border-box;
        }

        .dy-urgent-modal {
          width: 100%;
          max-width: 490px;
          overflow: hidden;
          border: 1px solid #929292;
          background: #ffffff;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
        }

        .dy-urgent-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 42px;
          padding: 0 14px;
          background: #404553;
          color: #ffffff;
          box-sizing: border-box;
        }

        .dy-urgent-modal-header button {
          border: 0;
          background: transparent;
          color: #ffffff;
          font-size: 29px;
          cursor: pointer;
        }

        .dy-urgent-modal-body {
          margin: 10px;
          padding: 24px 20px 20px;
          border: 4px solid #eeeeee;
          background: #ffffff;
          box-sizing: border-box;
        }

        .dy-urgent-modal-body h2 {
          margin: 0;
          padding-bottom: 14px;
          border-bottom: 1px solid #dddddd;
          color: #b2763e;
          font-size: 27px;
          font-weight: 500;
          text-align: center;
        }

        .dy-urgent-modal-body > p {
          margin: 16px 0 20px;
          color: #111111;
          font-size: 16px;
          font-weight: 800;
          text-align: center;
        }

        .dy-urgent-modal-body form > label {
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          align-items: center;
          margin-bottom: 12px;
        }

        .dy-urgent-modal-body form > label > span {
          padding-left: 22px;
          font-size: 14px;
          font-weight: 800;
        }

        .dy-urgent-modal-body input,
        .dy-urgent-modal-body textarea {
          width: 100%;
          border: 1px solid #d4d4d4;
          box-sizing: border-box;
        }

        .dy-urgent-modal-body form > label input {
          height: 38px;
          padding: 0 10px;
        }

        .dy-urgent-modal-body form > label textarea {
          min-height: 90px;
          padding: 10px;
          resize: vertical;
        }

        .dy-urgent-modal-body form > label.message {
          align-items: start;
        }

        .dy-urgent-modal-body form > label.message > span {
          padding-top: 10px;
        }

        .dy-urgent-code-row {
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr) 78px;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
        }

        .dy-urgent-code {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          border: 1px solid #d4d4d4;
          background: #faf6eb;
          font-family: Georgia, serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .dy-urgent-code-row input,
        .dy-urgent-code-row button {
          height: 38px;
          border: 1px solid #d4d4d4;
          box-sizing: border-box;
        }

        .dy-urgent-code-row input {
          min-width: 0;
          padding: 0 10px;
        }

        .dy-urgent-code-row button {
          background: #ffffff;
          color: #555555;
          font-size: 11px;
          cursor: pointer;
        }

        .dy-urgent-privacy {
          display: flex;
          justify-content: flex-end;
          margin: 14px 0 16px;
          font-size: 12px;
        }

        .dy-urgent-privacy label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .dy-urgent-privacy input {
          width: auto;
        }

        .dy-urgent-submit {
          width: 100%;
          height: 43px;
          border: 1px solid #f2a500;
          border-radius: 5px;
          background: #ffbc28;
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 1000px) {
          .dy-urgent-review-card {
            width: 100%;
            min-height: 150px;
          }
        }

        @media (max-width: 560px) {
          .dy-urgent-modal-body {
            padding: 22px 13px 17px;
          }

          .dy-urgent-modal-body form > label {
            grid-template-columns: 80px minmax(0, 1fr);
          }

          .dy-urgent-modal-body form > label > span {
            padding-left: 5px;
          }

          .dy-urgent-code-row {
            grid-template-columns: 80px minmax(0, 1fr);
          }

          .dy-urgent-code-row button {
            grid-column: 2;
          }
        }
      `}</style>
    </>
  );
}
