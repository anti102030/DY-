"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function createCaptcha() {
  const chars = "23456789";

  return Array.from({ length: 5 }, () => {
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
}

const emailDomains = [
  "직접입력",
  "naver.com",
  "gmail.com",
  "daum.net",
  "hanmail.net",
  "nate.com",
];

export default function InquiryWriteForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isSecret, setIsSecret] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("직접입력");

  const [content, setContent] = useState("");
  const [inquiryType, setInquiryType] = useState<"신축분양" | "매매">(
    "신축분양",
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCaptchaCode(createCaptcha());
  }, []);

  const fullEmail = useMemo(() => {
    const id = emailId.trim();
    const domain = emailDomain.trim();

    if (!id || !domain) return "";

    return `${id}@${domain}`;
  }, [emailDomain, emailId]);

  function refreshCaptcha() {
    setCaptchaCode(createCaptcha());
    setCaptchaInput("");
  }

  function handleDomainChange(value: string) {
    setSelectedDomain(value);

    if (value === "직접입력") {
      setEmailDomain("");
      return;
    }

    setEmailDomain(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("휴대폰번호를 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (isSecret && !password.trim()) {
      alert("비밀글 확인용 비밀번호를 입력해주세요.");
      return;
    }

    if (
      emailId.trim() &&
      (!emailDomain.trim() || !fullEmail.includes("@"))
    ) {
      alert("이메일주소를 정확히 입력해주세요.");
      return;
    }

    if (
      captchaInput.trim().toUpperCase() !==
      captchaCode.toUpperCase()
    ) {
      alert("스팸방지코드가 일치하지 않습니다.");
      refreshCaptcha();
      return;
    }

    if (!privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setSubmitting(true);

    const { error: inquiryError } = await supabase
      .from("inquiries")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: fullEmail || null,
        title: title.trim(),
        content: content.trim(),
        is_secret: isSecret,
        status: inquiryType,
      });

    if (inquiryError) {
      setSubmitting(false);

      alert(
        `문의 등록에 실패했습니다.\n${inquiryError.message}`,
      );

      return;
    }

    const consultationMessage = [
      `[${inquiryType}] ${title.trim()}`,
      content.trim(),
      fullEmail ? `이메일: ${fullEmail}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error: consultationError } = await supabase
      .from("consultations")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        region: "문의게시판",
        message: consultationMessage,
        status: "신규",
        source: "내집마련 맞춤컨설팅 문의게시판",
      });

    setSubmitting(false);

    if (consultationError) {
      alert(
        `문의게시판에는 등록되었지만 관리자 문의 관리 등록에 실패했습니다.\n${consultationError.message}`,
      );

      return;
    }

    alert("문의가 정상적으로 등록되었습니다.");
    router.push("/inquiry");
    router.refresh();
  }

  return (
    <section className="dy-km-write-page">
      <h1 className="dy-km-write-title">쓰기</h1>

      <form className="dy-km-write-form" onSubmit={handleSubmit}>
        <div className="dy-km-write-row">
          <label htmlFor="inquiry-title">
            제목 <strong>*</strong>
          </label>

          <div className="dy-km-title-field">
            <input
              id="inquiry-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label className="dy-km-secret-check">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(event) => setIsSecret(event.target.checked)}
              />
              암호잠금
            </label>
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="inquiry-name">
            이름 <strong>*</strong>
          </label>

          <div className="dy-km-short-field">
            <input
              id="inquiry-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="inquiry-phone">
            휴대폰번호 <strong>*</strong>
          </label>

          <div className="dy-km-full-field">
            <input
              id="inquiry-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="회신 알림용으로만 사용됩니다."
            />
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="email-id">이메일</label>

          <div className="dy-km-email-field">
            <input
              id="email-id"
              value={emailId}
              onChange={(event) => setEmailId(event.target.value)}
            />

            <span>@</span>

            <input
              value={emailDomain}
              onChange={(event) => {
                setEmailDomain(event.target.value);
                setSelectedDomain("직접입력");
              }}
              disabled={selectedDomain !== "직접입력"}
            />

            <select
              value={selectedDomain}
              onChange={(event) =>
                handleDomainChange(event.target.value)
              }
            >
              {emailDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="inquiry-type">문의분류</label>

          <div className="dy-km-short-field">
            <select
              id="inquiry-type"
              value={inquiryType}
              onChange={(event) =>
                setInquiryType(
                  event.target.value as "신축분양" | "매매",
                )
              }
            >
              <option value="신축분양">신축분양</option>
              <option value="매매">매매</option>
            </select>
          </div>
        </div>

        <div className="dy-km-write-row dy-km-content-row">
          <label htmlFor="inquiry-content">
            내용 <strong>*</strong>
          </label>

          <div className="dy-km-editor">
            <div className="dy-km-editor-toolbar">
              <select aria-label="글꼴">
                <option>돋움</option>
                <option>굴림</option>
                <option>맑은 고딕</option>
              </select>

              <select aria-label="글자크기">
                <option>9pt</option>
                <option>10pt</option>
                <option>11pt</option>
                <option>12pt</option>
                <option>14pt</option>
              </select>

              <button type="button" aria-label="굵게">
                <b>가</b>
              </button>
              <button type="button" aria-label="기울임">
                <i>가</i>
              </button>
              <button type="button" aria-label="밑줄">
                <u>가</u>
              </button>
              <button type="button" aria-label="왼쪽 정렬">
                ≡
              </button>
              <button type="button" aria-label="가운데 정렬">
                ≣
              </button>
              <button type="button" aria-label="링크">
                URL
              </button>
              <button type="button" aria-label="표">
                ▦
              </button>
              <button type="button" aria-label="사진">
                사진
              </button>
            </div>

            <textarea
              id="inquiry-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            <div className="dy-km-editor-footer">
              <span>↕ 입력창 크기 조절</span>
              <span>Editor&nbsp;&nbsp;&nbsp; HTML&nbsp;&nbsp;&nbsp; TEXT</span>
            </div>
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="inquiry-file">파일첨부</label>

          <div className="dy-km-file-field">
            <input
              id="inquiry-file"
              className="dy-km-file-input"
              type="file"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />

            <label
              htmlFor="inquiry-file"
              className="dy-km-file-select-button"
            >
              파일 선택
            </label>

            <span className="dy-km-file-name">
              {selectedFile
                ? selectedFile.name
                : "선택된 파일 없음"}
            </span>
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="inquiry-password">비밀번호</label>

          <div className="dy-km-password-field">
            <input
              id="inquiry-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!isSecret}
            />

            <span>비밀번호는 답글 확인에 필요합니다.</span>
          </div>
        </div>

        <div className="dy-km-write-row">
          <label htmlFor="captcha-input">
            스팸방지코드 <strong>*</strong>
          </label>

          <div className="dy-km-captcha-field">
            <div
              className="dy-km-captcha-code"
              aria-label="스팸방지코드"
            >
              {captchaCode || "-----"}
            </div>

            <button
              type="button"
              className="dy-km-captcha-refresh"
              onClick={refreshCaptcha}
              title="스팸방지코드 새로고침"
              aria-label="스팸방지코드 새로고침"
            >
              ↻
            </button>

            <input
              id="captcha-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={captchaInput}
              onChange={(event) =>
                setCaptchaInput(
                  event.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 5),
                )
              }
              placeholder="좌측 스팸방지코드 입력"
            />
          </div>
        </div>

        <section className="dy-km-privacy-section">
          <h2>개인정보보호를 위한 이용자 동의사항</h2>

          <div className="dy-km-privacy-box">
            <h3>개인정보의 수집 및 이용목적</h3>

            <p>
              DY다이아부동산은 고객 상담, 문의 처리, 매물 안내 및
              상담 일정 조율을 위해 필요한 개인정보를 수집합니다.
            </p>

            <p>
              1. 수집항목: 이름, 휴대폰번호, 이메일, 문의내용
              <br />
              2. 이용목적: 상담 접수, 답변 안내, 맞춤 매물 추천
              <br />
              3. 보유기간: 상담 업무 종료 후 관계 법령에 따른 기간
              동안 보관
              <br />
              4. 이용자는 개인정보 수집에 동의하지 않을 수 있으나,
              동의하지 않을 경우 문의 등록이 제한될 수 있습니다.
            </p>
          </div>

          <div className="dy-km-privacy-choice">
            <label>
              <input
                type="radio"
                name="privacy"
                checked={!privacyAgreed}
                onChange={() => setPrivacyAgreed(false)}
              />
              동의 안 함
            </label>

            <label>
              <input
                type="radio"
                name="privacy"
                checked={privacyAgreed}
                onChange={() => setPrivacyAgreed(true)}
              />
              동의함
            </label>
          </div>
        </section>

        <div className="dy-km-write-actions">
          <button
            type="button"
            className="dy-km-list-button"
            onClick={() => router.push("/inquiry")}
          >
            목록
          </button>

          <button
            type="submit"
            className="dy-km-submit-button"
            disabled={submitting}
          >
            {submitting ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>

      <style>{`
        .dy-km-write-page {
          width: 100%;
          background: #fff;
        }

        .dy-km-write-title {
          margin: 0;
          padding: 0 0 18px;
          border-bottom: 2px solid #333;
          color: #111;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-km-write-form {
          width: 100%;
        }

        .dy-km-write-row {
          display: grid;
          grid-template-columns: 145px minmax(0, 1fr);
          min-height: 62px;
          border-bottom: 1px solid #e4e4e4;
        }

        .dy-km-write-row > label:first-child {
          display: flex;
          align-items: center;
          padding: 0 16px;
          background: #fafafa;
          color: #555;
          font-size: 13px;
          font-weight: 700;
        }

        .dy-km-write-row > label:first-child strong {
          margin-left: 6px;
          color: #f00;
        }

        .dy-km-title-field,
        .dy-km-short-field,
        .dy-km-full-field,
        .dy-km-email-field,
        .dy-km-file-field,
        .dy-km-password-field,
        .dy-km-captcha-field {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          box-sizing: border-box;
        }

        .dy-km-title-field > input {
          width: min(420px, 65%);
        }

        .dy-km-title-field input,
        .dy-km-short-field input,
        .dy-km-short-field select,
        .dy-km-full-field input,
        .dy-km-email-field input,
        .dy-km-email-field select,
        .dy-km-password-field input,
        .dy-km-captcha-field input {
          height: 34px;
          padding: 0 9px;
          border: 1px solid #d6d6d6;
          background: #fff;
          color: #555;
          font-size: 12px;
          box-sizing: border-box;
        }

        .dy-km-short-field input,
        .dy-km-short-field select {
          width: 180px;
        }

        .dy-km-full-field input {
          width: 100%;
        }

        .dy-km-secret-check {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #555;
          font-size: 12px;
          font-weight: 700;
        }

        .dy-km-secret-check input {
          width: 18px;
          height: 18px;
          accent-color: #1684f6;
        }

        .dy-km-email-field input {
          width: 120px;
        }

        .dy-km-email-field select {
          width: 94px;
        }

        .dy-km-email-field span {
          color: #555;
          font-size: 14px;
          font-weight: 700;
        }

        .dy-km-content-row {
          min-height: 380px;
        }

        .dy-km-content-row > label:first-child {
          align-items: flex-start;
          padding-top: 175px;
        }

        .dy-km-editor {
          margin: 12px 10px 16px;
          border: 1px solid #bdbdbd;
          background: #fff;
        }

        .dy-km-editor-toolbar {
          display: flex;
          align-items: center;
          gap: 3px;
          min-height: 31px;
          padding: 3px 6px;
          border-bottom: 1px solid #bdbdbd;
          background: linear-gradient(#f9f9f9, #e8e8e8);
        }

        .dy-km-editor-toolbar select,
        .dy-km-editor-toolbar button {
          height: 23px;
          border: 1px solid #c7c7c7;
          background: #fff;
          color: #333;
          font-size: 10px;
        }

        .dy-km-editor-toolbar select {
          min-width: 58px;
        }

        .dy-km-editor-toolbar button {
          min-width: 24px;
          padding: 0 5px;
          cursor: pointer;
        }

        .dy-km-editor textarea {
          display: block;
          width: 100%;
          min-height: 300px;
          padding: 12px;
          border: 0;
          outline: 0;
          resize: vertical;
          color: #444;
          font: inherit;
          font-size: 13px;
          line-height: 1.7;
          box-sizing: border-box;
        }

        .dy-km-editor-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-height: 20px;
          border-top: 1px solid #c7c7c7;
          color: #888;
          font-size: 9px;
        }

        .dy-km-editor-footer span:first-child {
          margin-right: auto;
          padding-left: 45%;
        }

        .dy-km-editor-footer span:last-child {
          padding: 0 9px;
        }

        .dy-km-file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .dy-km-file-select-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 64px;
          height: 26px;
          padding: 0 9px;
          border: 1px solid #aaa;
          border-radius: 1px;
          background: linear-gradient(#ffffff, #ededed);
          color: #222;
          font-size: 11px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
          box-sizing: border-box;
        }

        .dy-km-file-select-button:hover {
          border-color: #888;
          background: linear-gradient(#ffffff, #e5e5e5);
        }

        .dy-km-file-select-button:active {
          background: #e7e7e7;
        }

        .dy-km-file-name {
          max-width: calc(100% - 90px);
          overflow: hidden;
          color: #777;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dy-km-password-field span {
          color: #999;
          font-size: 11px;
        }

        .dy-km-password-field input {
          width: 200px;
        }

        .dy-km-captcha-code {
          width: 118px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d6d6d6;
          background: #fff;
          color: #222;
          font-family: Georgia, serif;
          font-size: 22px;
          font-style: italic;
          font-weight: 700;
          letter-spacing: 1px;
          text-decoration: line-through;
          user-select: none;
          box-sizing: border-box;
        }

        .dy-km-captcha-refresh {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 36px;
          padding: 0;
          border: 1px solid #d6d6d6;
          border-radius: 3px;
          background: #fff;
          color: #666;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }

        .dy-km-captcha-refresh:hover {
          border-color: #999;
          color: #222;
          background: #f7f7f7;
        }

        .dy-km-captcha-refresh:active {
          transform: rotate(25deg);
        }

        .dy-km-captcha-field input {
          width: 210px;
        }

        .dy-km-privacy-section {
          margin-top: 34px;
        }

        .dy-km-privacy-section h2 {
          margin: 0 0 12px;
          color: #333;
          font-size: 16px;
          font-weight: 800;
        }

        .dy-km-privacy-box {
          height: 205px;
          overflow-y: auto;
          padding: 18px 20px;
          border: 1px solid #ccc;
          color: #555;
          font-size: 12px;
          line-height: 1.8;
          box-sizing: border-box;
        }

        .dy-km-privacy-box h3 {
          margin: 0 0 10px;
          color: #333;
          font-size: 15px;
        }

        .dy-km-privacy-box p {
          margin: 0 0 12px;
        }

        .dy-km-privacy-choice {
          display: flex;
          justify-content: center;
          gap: 18px;
          padding: 20px 0 8px;
          color: #777;
          font-size: 13px;
        }

        .dy-km-privacy-choice label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .dy-km-privacy-choice input {
          width: 18px;
          height: 18px;
          accent-color: #1684f6;
        }

        .dy-km-write-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 18px 0 8px;
        }

        .dy-km-write-actions button {
          min-width: 90px;
          height: 38px;
          border: 1px solid #555;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .dy-km-list-button {
          background: #fff;
          color: #555;
        }

        .dy-km-submit-button {
          background: #4b4b4b;
          color: #fff;
        }

        .dy-km-submit-button:disabled {
          opacity: 0.6;
          cursor: default;
        }

        @media (max-width: 760px) {
          .dy-km-write-row {
            grid-template-columns: 100px minmax(0, 1fr);
          }

          .dy-km-title-field,
          .dy-km-email-field,
          .dy-km-file-field,
          .dy-km-password-field,
          .dy-km-captcha-field {
            flex-wrap: wrap;
          }

          .dy-km-title-field > input {
            width: 100%;
          }

          .dy-km-content-row > label:first-child {
            padding-top: 18px;
          }

          .dy-km-editor-footer span:first-child {
            padding-left: 8px;
          }
        }
      `}</style>
    </section>
  );
}
