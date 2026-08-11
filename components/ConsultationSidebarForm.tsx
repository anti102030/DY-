"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PrivacyChoice = "동의안함" | "동의함";

type FormState = {
  name: string;
  phone: string;
  message: string;
  verifyCode: string;
  privacyChoice: PrivacyChoice;
};

function createVerificationCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const initialForm: FormState = {
  name: "",
  phone: "",
  message: "",
  verifyCode: "",
  privacyChoice: "동의안함",
};

export default function ConsultationSidebarForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [verificationCode, setVerificationCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState("");

  /*
    랜덤 인증번호는 브라우저가 열린 뒤에만 생성합니다.
    서버와 브라우저가 서로 다른 번호를 만드는 hydration 오류를 방지합니다.
  */
  useEffect(() => {
    setVerificationCode(createVerificationCode());
  }, []);

  function refreshVerificationCode() {
    setVerificationCode(createVerificationCode());
    setForm((current) => ({
      ...current,
      verifyCode: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("");

    if (!verificationCode) {
      setResult("인증코드를 불러오는 중입니다.");
      return;
    }

    if (form.verifyCode.trim() !== verificationCode) {
      setResult("인증코드를 정확히 입력해 주세요.");
      refreshVerificationCode();
      return;
    }

    if (form.privacyChoice !== "동의함") {
      setResult("개인정보처리방침에 동의해 주세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("consultations").insert({
      name: form.name.trim() || null,
      phone: form.phone.trim(),
      message: form.message.trim(),
      status: "신규",
      source: "우측 무료상담신청",
    });

    setSaving(false);

    if (error) {
      setResult(`상담신청 실패: ${error.message}`);
      return;
    }

    setResult("상담신청이 접수되었습니다.");
    setForm(initialForm);
    setVerificationCode(createVerificationCode());
  }

  return (
    <section className="dy-free-consult">
      <h2>무료상담신청</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
          placeholder="상담내용을 적어주세요. 확인 후 빠른 답변 드리도록 하겠습니다."
          required
        />

        <input
          type="text"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder="이름"
        />

        <input
          type="tel"
          value={form.phone}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              phone: event.target.value,
            }))
          }
          placeholder="연락처"
          required
        />

        <div className="dy-verify-row">
          <button
            type="button"
            className="dy-verify-code"
            onClick={refreshVerificationCode}
            title="클릭하면 인증코드가 바뀝니다."
            disabled={!verificationCode}
          >
            {verificationCode || "----"}
          </button>

          <input
            type="text"
            value={form.verifyCode}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                verifyCode: event.target.value.replace(/\D/g, "").slice(0, 4),
              }))
            }
            placeholder="인증코드"
            inputMode="numeric"
            maxLength={4}
            required
          />
        </div>

        <a href="/privacy" className="dy-privacy-link">
          💡 개인정보처리방침
        </a>

        <div className="dy-privacy-radio-row">
          <label>
            <input
              type="radio"
              name="privacyChoice"
              value="동의안함"
              checked={form.privacyChoice === "동의안함"}
              onChange={() =>
                setForm((current) => ({
                  ...current,
                  privacyChoice: "동의안함",
                }))
              }
            />
            동의 안 함
          </label>

          <label>
            <input
              type="radio"
              name="privacyChoice"
              value="동의함"
              checked={form.privacyChoice === "동의함"}
              onChange={() =>
                setForm((current) => ({
                  ...current,
                  privacyChoice: "동의함",
                }))
              }
            />
            동의함
          </label>
        </div>

        {result && <p className="dy-consult-result">{result}</p>}

        <button type="submit" className="dy-consult-submit" disabled={saving}>
          {saving ? "접수 중..." : "신청하기"}
        </button>
      </form>
    </section>
  );
}
