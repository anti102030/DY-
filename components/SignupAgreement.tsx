"use client";

import { useState } from "react";
import SignupForm from "@/components/SignupForm";
import SignupBreadcrumb from "@/components/SignupBreadcrumb";

const TERMS_TEXT = `제1조 목적

본 약관은 DY다이아부동산이 운영하는 웹사이트에서 제공하는 부동산 정보, 상담 신청, 문의게시판, 빌라투어 신청 및 회원 서비스를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.

제2조 서비스의 내용

회사는 부동산 매물 정보 제공, 맞춤 상담 접수, 현장 방문 일정 조율, 문의게시판 운영 및 회원 관련 서비스를 제공합니다.

제3조 회원의 의무

회원은 회원가입 및 서비스 이용 과정에서 사실에 맞는 정보를 입력해야 하며, 타인의 개인정보를 무단으로 사용하거나 사이트 운영을 방해해서는 안 됩니다.

제4조 게시물의 관리

회사는 관계 법령을 위반하거나 타인의 권리를 침해하는 내용, 허위·광고성 게시물 및 서비스 운영을 방해하는 게시물을 제한하거나 삭제할 수 있습니다.

제5조 부동산 정보와 거래

사이트의 매물 정보는 상담 및 안내를 위한 자료이며, 실제 거래 조건은 현장 확인과 계약 과정에서 달라질 수 있습니다. 거래는 부동산을 통해 안전하게 진행됩니다.

제6조 서비스 이용 제한

시스템 점검, 통신 장애, 천재지변 또는 기타 불가피한 사유가 있는 경우 서비스 제공이 일시적으로 제한될 수 있습니다.

제7조 책임의 제한

회사는 고의 또는 중대한 과실이 없는 한 이용자가 입력한 부정확한 정보, 이용자의 귀책사유 또는 외부 서비스 장애로 발생한 손해에 대하여 책임을 지지 않습니다.

제8조 분쟁 해결

서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 원만한 해결을 위해 협의하며, 협의가 이루어지지 않을 경우 관계 법령과 관할 법원에 따릅니다.`;

const PRIVACY_TEXT = `수집하는 개인정보 항목

DY다이아부동산은 회원가입과 서비스 제공을 위해 다음 개인정보를 수집합니다.

1. 필수항목: 이름, 휴대폰번호, 아이디, 비밀번호
2. 선택항목: 관심지역 및 이용자가 자발적으로 입력한 정보
3. 자동수집항목: 서비스 이용기록, 접속기록, 쿠키, 방문정보

개인정보의 수집 및 이용목적

1. 회원가입 및 본인 확인
2. 회원 서비스 제공 및 관리
3. 상담 접수와 답변 안내
4. 맞춤 매물 추천 및 서비스 개선
5. 부정 이용 방지와 사이트 보안

개인정보의 보유 및 이용기간

개인정보는 회원 탈퇴 또는 처리 목적 달성 시까지 보유하며, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.

개인정보의 제3자 제공

회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나 이용자가 요청한 업무 수행에 필요한 경우 필요한 범위에서 제공할 수 있습니다.

개인정보의 파기

보유 목적이 달성된 개인정보는 복구 또는 재생되지 않도록 안전한 방법으로 파기합니다.

정보주체의 권리

회원은 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 및 동의 철회를 요청할 수 있습니다.`;

export default function SignupAgreement() {
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <SignupForm
        onBack={() => setShowForm(false)}
      />
    );
  }

  const canContinue = termsAgreed && privacyAgreed;

  return (
    <section className="dy-signup-agreement">
      <div className="dy-signup-heading">
        <h1>회원가입동의</h1>

        <SignupBreadcrumb
          current="회원가입"
          detail="회원가입동의"
        />
      </div>

      <section className="dy-agreement-section">
        <h2>이용약관 (필수)</h2>

        <div className="dy-agreement-box">
          <pre>{TERMS_TEXT}</pre>
        </div>

        <label className="dy-agreement-check">
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(event) =>
              setTermsAgreed(event.target.checked)
            }
          />

          <span className="dy-check-circle">✓</span>
          동의합니다.
        </label>
      </section>

      <section className="dy-agreement-section">
        <h2>개인정보 처리방침 (필수)</h2>

        <div className="dy-agreement-box">
          <pre>{PRIVACY_TEXT}</pre>
        </div>

        <label className="dy-agreement-check">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(event) =>
              setPrivacyAgreed(event.target.checked)
            }
          />

          <span className="dy-check-circle">✓</span>
          동의합니다.
        </label>
      </section>

      <div className="dy-agreement-actions">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setShowForm(true)}
        >
          다음단계
        </button>
      </div>

      <style>{`
        .dy-signup-agreement {
          width: 100%;
          background: #fff;
        }

        .dy-signup-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 15px;
        }

        .dy-signup-heading h1 {
          margin: 0;
          color: #111;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-agreement-section {
          margin-top: 36px;
        }

        .dy-agreement-section h2 {
          margin: 0 0 12px;
          color: #333;
          font-size: 16px;
          font-weight: 800;
        }

        .dy-agreement-box {
          height: 205px;
          overflow-y: auto;
          padding: 20px 22px;
          border: 1px solid #d3d3d3;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-agreement-box pre {
          margin: 0;
          color: #444;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .dy-agreement-check {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: fit-content;
          margin: 17px auto 0;
          color: #777;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-agreement-check input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .dy-check-circle {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #cccccc;
          border-radius: 50%;
          background: #fff;
          color: #ccc;
          font-size: 15px;
          box-sizing: border-box;
        }

        .dy-agreement-check input:checked + .dy-check-circle {
          border-color: #285889;
          background: #285889;
          color: #fff;
        }

        .dy-agreement-actions {
          display: flex;
          justify-content: center;
          padding: 42px 0 10px;
        }

        .dy-agreement-actions button {
          width: 168px;
          height: 50px;
          border: 0;
          background: #285889;
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-agreement-actions button:disabled {
          background: #b7b7b7;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .dy-signup-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dy-agreement-box {
            height: 240px;
          }
        }
      `}</style>
    </section>
  );
}