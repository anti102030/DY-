"use client";

import {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

const propertyTypes = [
  "원·투룸",
  "쓰리·포룸",
  "테라스·복층",
  "타운하우스",
];

function createCaptcha() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function VillaTourForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [captchaCode, setCaptchaCode] = useState("0000");
  const [captchaInput, setCaptchaInput] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [privacyAgreement, setPrivacyAgreement] = useState("disagree");
  const [selectedFileName, setSelectedFileName] = useState("선택된 파일 없음");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCaptchaCode(createCaptcha());
  }, []);

  function refreshCaptcha() {
    setCaptchaCode(createCaptcha());
    setCaptchaInput("");
  }

  function handleTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;

    setSelectedTypes((current) =>
      checked
        ? [...current, value]
        : current.filter((item) => item !== value)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedTypes.length === 0) {
      window.alert("종류를 하나 이상 선택해주세요.");
      return;
    }

    if (captchaInput !== captchaCode) {
      window.alert("스팸방지코드가 일치하지 않습니다.");
      refreshCaptcha();
      return;
    }

    if (privacyAgreement !== "agree") {
      window.alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);

    const region = String(formData.get("region") ?? "").trim();
    const priceRange = String(formData.get("priceRange") ?? "").trim();
    const moveDate = String(formData.get("moveDate") ?? "").trim();
    const tourDate = String(formData.get("tourDate") ?? "").trim();
    const tourTime = String(formData.get("tourTime") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (
      !region ||
      !priceRange ||
      !moveDate ||
      !tourDate ||
      !tourTime ||
      !name ||
      !phone
    ) {
      window.alert("필수항목을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("villa_tours")
        .insert({
          region,
          price_range: priceRange,
          property_types: selectedTypes,
          move_date: moveDate,
          tour_date: tourDate,
          tour_time: tourTime,
          name,
          phone,
          message: message || null,
          attachment_url: null,
          status: "신청접수",
        });

      if (error) {
        console.error("빌라투어 신청 저장 실패:", error);
        window.alert(
          "빌라투어 신청 저장 중 오류가 발생했습니다.\n" +
            error.message,
        );
        return;
      }

      window.alert(
        "빌라투어 신청이 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다.",
      );

      formRef.current?.reset();
      setSelectedTypes([]);
      setPrivacyAgreement("disagree");
      setSelectedFileName("선택된 파일 없음");
      refreshCaptcha();
    } catch (error) {
      console.error("빌라투어 신청 오류:", error);
      window.alert("빌라투어 신청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={containerStyle}>
      <h1 style={headingStyle}>빌라투어신청</h1>

      <div style={dividerStyle} />

      <div style={introStyle}>
        <div>
          DY다이아부동산은{" "}
          <strong>신축분양 · 매매전문 무사고인증</strong> 회사입니다.
        </div>
        <p>희망 조건과 방문 일정을 남겨주시면 빠르게 안내해드립니다.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div style={tableStyle}>
          <FormRow label="지역" required>
            <select name="region" defaultValue="" required style={selectStyle}>
              <option value="" disabled>
                지역을 선택해주세요
              </option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
            </select>
          </FormRow>

          <FormRow label="가격범위" required>
            <input
              type="text"
              name="priceRange"
              placeholder="금액 범위를 입력해주세요"
              required
              style={wideInputStyle}
            />
          </FormRow>

          <FormRow label="종류" required>
            <div style={checkboxGroupStyle}>
              {propertyTypes.map((item) => (
                <label key={item} style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="propertyType"
                    value={item}
                    checked={selectedTypes.includes(item)}
                    onChange={handleTypeChange}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </FormRow>

          <FormRow label="이사예정시기" required>
            <input
              type="date"
              name="moveDate"
              required
              style={dateInputStyle}
            />
          </FormRow>

          <FormRow label="투어날짜/시간" required>
            <div style={dateTimeGroupStyle}>
              <input
                type="date"
                name="tourDate"
                required
                style={dateInputStyle}
              />

              <select
                name="tourTime"
                defaultValue=""
                required
                style={timeSelectStyle}
              >
                <option value="" disabled>
                  시간 선택
                </option>
                <option value="오전 10시">오전 10시</option>
                <option value="오전 11시">오전 11시</option>
                <option value="오후 1시">오후 1시</option>
                <option value="오후 2시">오후 2시</option>
                <option value="오후 3시">오후 3시</option>
                <option value="오후 4시">오후 4시</option>
                <option value="오후 5시">오후 5시</option>
                <option value="시간 협의">시간 협의</option>
              </select>
            </div>
          </FormRow>

          <FormRow label="이름" required>
            <input
              type="text"
              name="name"
              required
              style={shortInputStyle}
            />
          </FormRow>

          <FormRow label="휴대폰" required>
            <input
              type="tel"
              name="phone"
              placeholder="확인 알림용으로만 사용됩니다."
              required
              style={wideInputStyle}
            />
          </FormRow>

          <FormRow label="투어시 원하시는 내용" large>
            <textarea
              name="message"
              placeholder="원하시는 지역, 방 개수, 주차, 엘리베이터 등 필요한 조건을 적어주세요."
              style={textareaStyle}
            />
          </FormRow>

          <FormRow label="파일첨부">
            <div style={fileUploadWrapStyle}>
              <input
                ref={fileInputRef}
                type="file"
                name="attachment"
                accept=".jpg,.jpeg,.png,.pdf"
                style={hiddenFileInputStyle}
                onChange={(event) =>
                  setSelectedFileName(
                    event.target.files?.[0]?.name || "선택된 파일 없음"
                  )
                }
              />

              <button
                type="button"
                style={fileSelectButtonStyle}
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </button>

              <span style={fileNameStyle}>{selectedFileName}</span>
            </div>
          </FormRow>

          <FormRow label="스팸방지코드" required>
            <div style={captchaWrapStyle}>
              <button
                type="button"
                onClick={refreshCaptcha}
                style={captchaCodeStyle}
                aria-label="스팸방지코드 새로고침"
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
                placeholder="코드를 입력해주세요"
                required
                style={captchaInputStyle}
              />
            </div>
          </FormRow>

        </div>

        <section style={privacySectionStyle}>
          <h2 style={privacyHeadingStyle}>
            개인정보보호를 위한 이용자 동의사항
          </h2>

          <div style={privacyTextStyle}>
            <strong>1. 수집하는 개인정보 항목</strong>
            <p>
              회사는 빌라투어 신청 및 상담 진행을 위해 이름, 휴대폰 번호,
              희망지역, 가격범위, 주택종류, 이사예정시기, 투어 희망일정,
              신청내용 및 이용자가 직접 첨부한 파일을 수집할 수 있습니다.
            </p>

            <strong>2. 개인정보의 수집 및 이용 목적</strong>
            <p>
              수집된 정보는 빌라투어 신청 확인, 상담 일정 조율, 신청 조건에
              맞는 매물 안내, 현장 방문 안내, 문의사항 처리 및 상담 서비스
              제공을 위해 이용됩니다.
            </p>

            <strong>3. 개인정보의 보유 및 이용 기간</strong>
            <p>
              개인정보는 상담 및 관련 업무가 종료될 때까지 보유·이용하며,
              이용 목적이 달성된 후에는 지체 없이 파기합니다. 다만 관계
              법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안
              안전하게 보관합니다.
            </p>

            <strong>4. 개인정보의 제3자 제공</strong>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지
              않습니다. 다만 법령에 특별한 규정이 있거나 이용자가 요청한
              업무 처리를 위해 필요한 경우에는 사전 동의를 받은 범위
              내에서 제공할 수 있습니다.
            </p>

            <strong>5. 개인정보 처리업무의 위탁</strong>
            <p>
              원활한 상담과 일정 관리를 위해 시스템 운영, 문자 또는 전화
              상담 등 일부 업무를 외부 전문업체에 위탁할 수 있으며, 이
              경우 관련 법령에 따라 개인정보가 안전하게 관리되도록 필요한
              조치를 시행합니다.
            </p>

            <strong>6. 동의를 거부할 권리</strong>
            <p>
              이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가
              있습니다. 다만 필수항목 수집에 동의하지 않을 경우 빌라투어
              신청 접수 및 상담 서비스 이용이 제한될 수 있습니다.
            </p>

            <strong>7. 개인정보 보호 관련 문의</strong>
            <p>
              개인정보 처리와 관련한 문의는 DY다이아부동산 고객상담전화
              010-8426-8616로 연락하실 수 있습니다.
            </p>
          </div>

          <div style={agreementStyle}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="privacyAgreement"
                value="disagree"
                checked={privacyAgreement === "disagree"}
                onChange={(event) =>
                  setPrivacyAgreement(event.target.value)
                }
              />
              동의 안 함
            </label>

            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="privacyAgreement"
                value="agree"
                checked={privacyAgreement === "agree"}
                onChange={(event) =>
                  setPrivacyAgreement(event.target.value)
                }
              />
              동의함
            </label>
          </div>
        </section>

        <div style={buttonAreaStyle}>
          <button type="submit" style={submitButtonStyle} disabled={submitting}>
            {submitting ? "접수 중..." : "신청하기"}
          </button>

          <button
            type="button"
            style={cancelButtonStyle}
            onClick={() => {
              formRef.current?.reset();
              setSelectedTypes([]);
              setPrivacyAgreement("disagree");
              setSelectedFileName("선택된 파일 없음");
              refreshCaptcha();
            }}
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}

type FormRowProps = {
  label: string;
  required?: boolean;
  large?: boolean;
  children: React.ReactNode;
};

function FormRow({ label, required, large, children }: FormRowProps) {
  return (
    <div style={rowStyle}>
      <label style={large ? largeLabelStyle : labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>

      <div style={fieldStyle}>{children}</div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  width: "100%",
  margin: 0,
  padding: 0,
  background: "#ffffff",
  boxSizing: "border-box",
};

const headingStyle: CSSProperties = {
  margin: 0,
  padding: "4px 0 10px",
  color: "#222222",
  fontSize: "24px",
  fontWeight: 900,
  letterSpacing: "-1px",
};

const dividerStyle: CSSProperties = {
  width: "100%",
  height: "2px",
  marginBottom: "14px",
  background: "#333333",
};

const introStyle: CSSProperties = {
  marginBottom: "16px",
  padding: "14px 18px",
  border: "1px solid #dedede",
  background: "#fafafa",
  color: "#444444",
  fontSize: "13px",
  lineHeight: 1.6,
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderTop: "1px solid #777777",
  borderLeft: "1px solid #dddddd",
  borderRight: "1px solid #dddddd",
  background: "#ffffff",
};

const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "132px minmax(0, 1fr)",
  borderBottom: "1px solid #dddddd",
};

const labelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  minHeight: "52px",
  padding: "10px 14px",
  borderRight: "1px solid #dddddd",
  background: "#f7f7f7",
  color: "#333333",
  fontSize: "13px",
  fontWeight: 700,
  boxSizing: "border-box",
};

const largeLabelStyle: CSSProperties = {
  ...labelStyle,
  alignItems: "flex-start",
  paddingTop: "16px",
};

const requiredStyle: CSSProperties = {
  marginLeft: "4px",
  color: "#e53935",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  minHeight: "52px",
  padding: "8px 10px",
  boxSizing: "border-box",
};

const baseInputStyle: CSSProperties = {
  height: "35px",
  padding: "0 10px",
  border: "1px solid #d5d5d5",
  borderRadius: 0,
  background: "#ffffff",
  color: "#555555",
  fontSize: "12px",
  boxSizing: "border-box",
};

const shortInputStyle: CSSProperties = {
  ...baseInputStyle,
  width: "170px",
  maxWidth: "100%",
};

const wideInputStyle: CSSProperties = {
  ...baseInputStyle,
  width: "100%",
};

const dateInputStyle: CSSProperties = {
  ...baseInputStyle,
  width: "180px",
  maxWidth: "100%",
};

const selectStyle: CSSProperties = {
  ...baseInputStyle,
  width: "190px",
  maxWidth: "100%",
};

const timeSelectStyle: CSSProperties = {
  ...selectStyle,
  width: "160px",
};

const dateTimeGroupStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const checkboxGroupStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px 15px",
};

const checkboxLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: "#333333",
  fontSize: "12px",
  cursor: "pointer",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "150px",
  padding: "12px",
  border: "1px solid #cccccc",
  borderRadius: 0,
  background: "#ffffff",
  color: "#444444",
  fontSize: "12px",
  lineHeight: 1.65,
  resize: "vertical",
  boxSizing: "border-box",
};

const fileUploadWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
};

const hiddenFileInputStyle: CSSProperties = {
  display: "none",
};

const fileSelectButtonStyle: CSSProperties = {
  height: "34px",
  padding: "0 14px",
  border: "1px solid #bdbdbd",
  background: "#ffffff",
  color: "#333333",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

const fileNameStyle: CSSProperties = {
  color: "#666666",
  fontSize: "12px",
};

const captchaWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
};

const captchaCodeStyle: CSSProperties = {
  position: "relative",
  width: "105px",
  height: "36px",
  overflow: "hidden",
  border: "1px solid #cfcfcf",
  background:
    "repeating-linear-gradient(-12deg, #ffffff 0, #ffffff 8px, #eeeeee 9px, #eeeeee 10px)",
  color: "#111111",
  fontFamily: "Georgia, serif",
  fontSize: "22px",
  fontStyle: "italic",
  fontWeight: 700,
  letterSpacing: "3px",
  textDecoration: "line-through",
  cursor: "pointer",
};

const captchaInputStyle: CSSProperties = {
  ...baseInputStyle,
  width: "180px",
};

const privacySectionStyle: CSSProperties = {
  marginTop: "22px",
};

const privacyHeadingStyle: CSSProperties = {
  margin: "0 0 9px",
  color: "#222222",
  fontSize: "16px",
  fontWeight: 800,
};

const privacyTextStyle: CSSProperties = {
  height: "185px",
  padding: "16px 20px",
  overflowY: "auto",
  border: "1px solid #cccccc",
  background: "#ffffff",
  color: "#444444",
  fontSize: "12px",
  lineHeight: 1.75,
  boxSizing: "border-box",
};

const agreementStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "18px",
  marginTop: "10px",
};

const radioLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  color: "#333333",
  fontSize: "12px",
  cursor: "pointer",
};

const buttonAreaStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "7px",
  padding: "22px 0 4px",
};

const submitButtonStyle: CSSProperties = {
  minWidth: "92px",
  height: "36px",
  padding: "0 20px",
  border: "1px solid #444444",
  background: "#555555",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 800,
  cursor: "pointer",
};

const cancelButtonStyle: CSSProperties = {
  minWidth: "72px",
  height: "36px",
  padding: "0 16px",
  border: "1px solid #cccccc",
  background: "#ffffff",
  color: "#555555",
  fontSize: "12px",
  cursor: "pointer",
};
