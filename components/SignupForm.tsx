"use client";

import { FormEvent, useState } from "react";
import SignupBreadcrumb from "@/components/SignupBreadcrumb";

function makeCaptchaCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export default function SignupForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingAgree, setMarketingAgree] =
    useState<"yes" | "no">("yes");
  const [interestRegion, setInterestRegion] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState(makeCaptchaCode);
  const [saving, setSaving] = useState(false);

  function refreshCaptcha() {
    setCaptchaCode(makeCaptchaCode());
    setCaptchaInput("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanId = userId.trim();

    if (!/^[a-zA-Z0-9]{6,12}$/.test(cleanId)) {
      alert("아이디는 영문/숫자 6~12자리로 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      alert("휴대전화 번호를 정확히 입력해주세요.");
      return;
    }

    if (captchaInput.trim() !== captchaCode) {
      alert("스팸방지코드가 일치하지 않습니다.");
      refreshCaptcha();
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: cleanId,
          password,
          name: name.trim(),
          phone: cleanPhone,
          marketing_agree: marketingAgree === "yes",
          interest_region: interestRegion.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "회원가입에 실패했습니다.",
        );
        return;
      }

      alert("회원가입이 완료되었습니다.");

      window.location.href = "/";
    } catch (error) {
      console.error("회원가입 오류:", error);

      alert(
        "회원가입 중 오류가 발생했습니다.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="dy-signup-member-page">
      <div className="dy-member-heading">
        <div>
          <h1>회원가입</h1>

          <p>
            회원정보입력
            <span>
              {" "}
              ( <strong>*</strong> 표시는 필수입력항목입니다.)
            </span>
          </p>
        </div>

        <SignupBreadcrumb current="회원가입" />
      </div>

      <form
        className="dy-member-form"
        onSubmit={handleSubmit}
      >
        <div className="dy-member-row">
          <label htmlFor="signup-id">
            아이디 <strong>*</strong>
          </label>

          <div className="dy-member-field">
            <input
              id="signup-id"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              maxLength={12}
            />

            <span>
              6~12 이내의 영문/숫자 사용가능, 여백은
              사용불가
            </span>
          </div>
        </div>

        <div className="dy-member-row">
          <label htmlFor="signup-password">
            비밀번호 <strong>*</strong>
          </label>

          <div className="dy-member-field">
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>
        </div>

        <div className="dy-member-row">
          <label htmlFor="signup-password-confirm">
            비밀번호확인
          </label>

          <div className="dy-member-field">
            <input
              id="signup-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) =>
                setPasswordConfirm(event.target.value)
              }
            />

            <span>
              위에 입력한 비밀번호를 다시 입력
            </span>
          </div>
        </div>

        <div className="dy-member-row">
          <label htmlFor="signup-name">
            이름 <strong>*</strong>
          </label>

          <div className="dy-member-field">
            <input
              id="signup-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <span>
              반드시 실명으로 입력해주세요.
            </span>
          </div>
        </div>

        <div className="dy-member-row dy-phone-row">
          <label htmlFor="signup-phone">
            휴대전화 <strong>*</strong>
          </label>

          <div className="dy-member-field dy-phone-field">
            <input
              id="signup-phone"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value.replace(
                    /[^\d]/g,
                    "",
                  ),
                )
              }
              placeholder="- 없이 숫자만 입력해주세요"
              inputMode="numeric"
            />

            <div className="dy-marketing-choice">
              <strong>
                마케팅 문자 수신동의:
              </strong>

              <label>
                <input
                  type="radio"
                  name="marketing"
                  checked={
                    marketingAgree === "yes"
                  }
                  onChange={() =>
                    setMarketingAgree("yes")
                  }
                />
                예
              </label>

              <label>
                <input
                  type="radio"
                  name="marketing"
                  checked={
                    marketingAgree === "no"
                  }
                  onChange={() =>
                    setMarketingAgree("no")
                  }
                />
                아니오
              </label>
            </div>
          </div>
        </div>

        <div className="dy-member-row">
          <label htmlFor="signup-region">
            관심지역
          </label>

          <div className="dy-member-field">
            <input
              id="signup-region"
              value={interestRegion}
              onChange={(event) =>
                setInterestRegion(
                  event.target.value,
                )
              }
              placeholder="예: 서울 강서구"
            />
          </div>
        </div>

        <div className="dy-member-row">
          <label htmlFor="signup-captcha">
            스팸방지코드 <strong>*</strong>
          </label>

          <div className="dy-member-field dy-captcha-field">
            <button
              type="button"
              className="dy-captcha-code"
              onClick={refreshCaptcha}
              aria-label="스팸방지코드 새로고침"
            >
              {captchaCode}
            </button>

            <input
              id="signup-captcha"
              value={captchaInput}
              onChange={(event) =>
                setCaptchaInput(
                  event.target.value.replace(
                    /\D/g,
                    "",
                  ),
                )
              }
              placeholder="좌측 스팸방지코드 입력"
              inputMode="numeric"
            />

            <button
              type="button"
              className="dy-captcha-refresh"
              onClick={refreshCaptcha}
            >
              새로고침
            </button>
          </div>
        </div>

        <div className="dy-member-actions">
          <button
            type="button"
            className="dy-member-back"
            onClick={onBack}
          >
            이전단계
          </button>

          <button
            type="submit"
            className="dy-member-submit"
            disabled={saving}
          >
            {saving
              ? "가입 중..."
              : "회원가입"}
          </button>
        </div>
      </form>

      <style>{`
        .dy-signup-member-page {
          width: 100%;
          background: #fff;
        }

        .dy-member-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 12px;
        }

        .dy-member-heading h1 {
          margin: 0 0 26px;
          color: #111;
          font-size: 27px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-member-heading p {
          margin: 0;
          color: #555;
          font-size: 14px;
          font-weight: 800;
        }

        .dy-member-heading p span {
          color: #999;
          font-size: 11px;
          font-weight: 600;
        }

        .dy-member-heading p strong {
          color: #f00;
        }

        .dy-member-form {
          border-top: 2px solid #333;
        }

        .dy-member-row {
          display: grid;
          grid-template-columns:
            145px minmax(0, 1fr);
          min-height: 63px;
          border-bottom: 1px solid #e1e1e1;
        }

        .dy-member-row > label {
          display: flex;
          align-items: center;
          padding: 0 14px;
          background: #f7f7f7;
          color: #444;
          font-size: 13px;
          font-weight: 800;
          box-sizing: border-box;
        }

        .dy-member-row > label strong {
          margin-left: 5px;
          color: #f00;
        }

        .dy-member-field {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          padding: 10px;
          box-sizing: border-box;
        }

        .dy-member-field > input {
          width: 300px;
          max-width: 100%;
          height: 34px;
          padding: 0 10px;
          border: 1px solid #cfcfcf;
          background: #fff;
          color: #333;
          font-size: 13px;
          box-sizing: border-box;
        }

        .dy-member-field > span {
          color: #aaa;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.5;
        }

        .dy-phone-field {
          align-items: flex-start;
          flex-direction: column;
          gap: 7px;
        }

        .dy-marketing-choice {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #444;
          font-size: 12px;
        }

        .dy-marketing-choice > strong {
          font-weight: 800;
        }

        .dy-marketing-choice label {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;
        }

        .dy-marketing-choice input {
          width: 17px;
          height: 17px;
          margin: 0;
          accent-color: #2683ff;
        }

        .dy-captcha-field {
          flex-wrap: wrap;
        }

        .dy-captcha-code {
          min-width: 102px;
          height: 34px;
          padding: 0 12px;
          border: 0;
          background: #fff;
          color: #222;
          font-family: "Times New Roman", serif;
          font-size: 22px;
          font-style: italic;
          text-decoration: line-through;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .dy-captcha-field > input {
          width: 225px;
        }

        .dy-captcha-refresh {
          height: 34px;
          padding: 0 12px;
          border: 1px solid #ccc;
          background: #f7f7f7;
          color: #555;
          font-size: 11px;
          cursor: pointer;
        }

        .dy-member-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 30px 0 8px;
        }

        .dy-member-actions button {
          min-width: 142px;
          height: 50px;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-member-back {
          border: 1px solid #285889;
          background: #fff;
          color: #285889;
        }

        .dy-member-submit {
          border: 1px solid #285889;
          background: #285889;
          color: #fff;
        }

        .dy-member-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .dy-member-heading {
            flex-direction: column;
          }

          .dy-member-heading h1 {
            margin-bottom: 10px;
          }

          .dy-member-row {
            grid-template-columns:
              110px minmax(0, 1fr);
          }

          .dy-member-field {
            align-items: stretch;
            flex-direction: column;
          }

          .dy-member-field > input {
            width: 100%;
          }

          .dy-marketing-choice {
            flex-wrap: wrap;
          }

          .dy-captcha-field {
            flex-direction: row;
            align-items: center;
          }

          .dy-captcha-field > input {
            width: min(220px, 100%);
          }
        }
      `}</style>
    </section>
  );
}