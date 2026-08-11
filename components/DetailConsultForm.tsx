"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function createCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

type DetailConsultFormProps = {
  propertyId: number;
  source: string;
  compact?: boolean;
};

export default function DetailConsultForm({
  propertyId,
  source,
  compact = false,
}: DetailConsultFormProps) {
  const router = useRouter();

  const defaultMessage = `${propertyId}번매물 상담신청드립니다.`;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    setVerificationCode(createCode());
  }, []);

  useEffect(() => {
    setMessage(defaultMessage);
  }, [propertyId]);

  function refreshCode() {
    setVerificationCode(createCode());
    setVerificationInput("");
    setResult("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setResult("");

    const normalizedPhone = phone.replace(/\s/g, "");

    if (!name.trim()) {
      setResult("이름을 입력해 주세요.");
      return;
    }

    if (!normalizedPhone) {
      setResult("연락처를 입력해 주세요.");
      return;
    }

    if (!message.trim()) {
      setResult("상담내용을 입력해 주세요.");
      return;
    }

    if (verificationInput !== verificationCode) {
      setResult("스팸방지코드를 정확히 입력해 주세요.");
      refreshCode();
      return;
    }

    if (!agreed) {
      setResult("개인정보처리방침에 동의해 주세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("consultations")
      .insert({
        name: name.trim(),
        phone: normalizedPhone,
        region: "",
        message: message.trim(),
        status: "신규",
        source,
      });

    setSaving(false);

    if (error) {
      setResult(`상담신청 실패: ${error.message}`);
      return;
    }

    setResult("상담신청이 접수되었습니다.");
    setName("");
    setPhone("");
    setMessage(defaultMessage);
    setVerificationInput("");
    setVerificationCode(createCode());
    setAgreed(false);

    router.refresh();
  }

  return (
    <section
      className={`km-kookmin-consult ${
        compact ? "is-compact" : ""
      }`}
    >
      <h2>매물상담신청</h2>

      <form onSubmit={handleSubmit}>
        <div className="km-kookmin-left">
          <label>
            <span>이&nbsp;&nbsp;&nbsp;름 :</span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="성함"
              autoComplete="name"
            />
          </label>

          <label>
            <span>연락처 :</span>

            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="회신 알림용으로만 사용됩니다."
              autoComplete="tel"
              required
            />
          </label>
        </div>

        <div className="km-kookmin-middle">
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            aria-label="상담내용"
          />

          <div className="km-kookmin-bottom-row">
            <button
              type="button"
              className="km-kookmin-code"
              onClick={refreshCode}
              title="클릭하면 코드가 바뀝니다."
              aria-label="스팸방지코드 새로고침"
            >
              {verificationCode || "----"}
            </button>

            <input
              type="text"
              value={verificationInput}
              onChange={(event) =>
                setVerificationInput(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4)
                )
              }
              inputMode="numeric"
              maxLength={4}
              placeholder="스팸방지코드 입력"
              aria-label="스팸방지코드 입력"
              required
            />

            <label className="km-kookmin-agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) =>
                  setAgreed(event.target.checked)
                }
              />

              <span>개인정보처리방침</span>

              <a href="/privacy">자세히보기</a>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="km-kookmin-submit"
          disabled={saving}
        >
          {saving ? "접수 중..." : "상담신청"}
        </button>

        {result && (
          <p className="km-kookmin-result">
            {result}
          </p>
        )}
      </form>

      <style jsx>{`
        .km-kookmin-consult {
          width: 100%;
          margin: 16px 0;
          border: 4px solid #eeeeee;
          background: #ffffff;
          box-sizing: border-box;
        }

        .km-kookmin-consult h2 {
          height: 49px;
          margin: 0;
          padding: 0 18px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #d8d8d8;
          color: #c98916;
          font-size: 16px;
          font-weight: 900;
          box-sizing: border-box;
        }

        .km-kookmin-consult form {
          position: relative;
          display: grid;
          grid-template-columns:
            minmax(250px, 0.9fr)
            minmax(360px, 1.45fr)
            94px;
          gap: 10px;
          align-items: stretch;
          padding: 10px 18px 12px;
          box-sizing: border-box;
        }

        .km-kookmin-left {
          display: grid;
          align-content: start;
          gap: 8px;
          min-width: 0;
        }

        .km-kookmin-left label {
          display: grid;
          grid-template-columns: 66px minmax(0, 1fr);
          align-items: center;
          min-width: 0;
        }

        .km-kookmin-left label > span {
          color: #333333;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .km-kookmin-left input {
          width: 100%;
          min-width: 0;
          height: 35px;
          padding: 0 10px;
          border: 1px solid #d7d7d7;
          background: #ffffff;
          color: #333333;
          font-size: 12px;
          box-sizing: border-box;
          outline: none;
        }

        .km-kookmin-left input::placeholder {
          color: #a0a0a0;
        }

        .km-kookmin-left input:focus,
        .km-kookmin-middle textarea:focus,
        .km-kookmin-bottom-row input:focus {
          border-color: #c89a38;
        }

        .km-kookmin-middle {
          display: grid;
          grid-template-rows: 35px 35px;
          gap: 8px;
          min-width: 0;
        }

        .km-kookmin-middle textarea {
          width: 100%;
          min-width: 0;
          height: 35px;
          padding: 8px 10px;
          border: 1px solid #d7d7d7;
          background: #ffffff;
          color: #222222;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.35;
          resize: none;
          box-sizing: border-box;
          outline: none;
        }

        .km-kookmin-bottom-row {
          display: grid;
          grid-template-columns: 96px minmax(118px, 1fr) auto;
          gap: 7px;
          align-items: center;
          min-width: 0;
        }

        .km-kookmin-code {
          position: relative;
          width: 96px;
          height: 35px;
          overflow: hidden;
          border: 1px solid #d7d7d7;
          background:
            repeating-linear-gradient(
              -12deg,
              #ffffff 0,
              #ffffff 7px,
              #ededed 8px,
              #ffffff 10px
            );
          color: #222222;
          font-family: Georgia, serif;
          font-size: 20px;
          font-style: italic;
          font-weight: 800;
          letter-spacing: 4px;
          text-decoration: line-through;
          cursor: pointer;
        }

        .km-kookmin-bottom-row > input {
          width: 100%;
          min-width: 0;
          height: 35px;
          padding: 0 9px;
          border: 1px solid #d7d7d7;
          background: #ffffff;
          color: #333333;
          font-size: 11px;
          box-sizing: border-box;
          outline: none;
        }

        .km-kookmin-agree {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 3px;
          min-width: max-content;
          color: #222222;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .km-kookmin-agree input {
          width: 17px;
          height: 17px;
          margin: 0 2px 0 0;
          accent-color: #1686ff;
        }

        .km-kookmin-agree a {
          color: #004ea2;
          font-size: 11px;
          font-weight: 900;
          text-decoration: underline;
        }

        .km-kookmin-submit {
          width: 94px;
          min-width: 94px;
          height: 78px;
          border: 1px solid #f0a600;
          border-radius: 5px;
          background: #ffb821;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-sizing: border-box;
        }

        .km-kookmin-submit:hover {
          background: #f3a800;
        }

        .km-kookmin-submit:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .km-kookmin-result {
          grid-column: 1 / -1;
          margin: 0;
          padding: 7px 10px;
          border: 1px solid #ead7a1;
          background: #fff9e9;
          color: #7b5612;
          font-size: 12px;
          font-weight: 700;
        }

        .km-kookmin-consult.is-compact form {
          grid-template-columns:
            minmax(230px, 0.9fr)
            minmax(330px, 1.4fr)
            94px;
        }

        @media (max-width: 980px) {
          .km-kookmin-consult form,
          .km-kookmin-consult.is-compact form {
            grid-template-columns: 1fr;
          }

          .km-kookmin-submit {
            width: 100%;
            min-width: 0;
            height: 46px;
          }

          .km-kookmin-middle {
            grid-template-rows: auto auto;
          }

          .km-kookmin-middle textarea {
            height: 72px;
          }
        }

        @media (max-width: 620px) {
          .km-kookmin-consult form {
            padding: 10px;
          }

          .km-kookmin-left label {
            grid-template-columns: 60px minmax(0, 1fr);
          }

          .km-kookmin-bottom-row {
            grid-template-columns: 92px minmax(0, 1fr);
          }

          .km-kookmin-agree {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
