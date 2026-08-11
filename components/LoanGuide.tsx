function LowestRateIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M20 84h82" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 82V58M46 82V66M64 82V54M82 82V68M100 82V50" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <path d="M21 35 43 55 60 42 79 63 100 47" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m96 44 6 2-1 7" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="82" cy="25" r="16" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <path d="M82 14v22M76 20c2-5 13-5 13 1 0 8-13 4-13 11 0 6 11 7 14 1" fill="none" stroke="#9f9f9f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ForeignLoanIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="37" cy="40" r="18" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <circle cx="81" cy="78" r="18" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <path d="M37 27v26M30 34c2-5 14-5 14 1 0 8-14 4-14 11 0 6 12 7 15 1" fill="none" stroke="#9f9f9f" strokeWidth="3" strokeLinecap="round" />
      <path d="M81 64v28M72 71h18M72 84h18M76 64l5 28 5-28" fill="none" stroke="#9f9f9f" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 25c20-3 32 5 38 19" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" />
      <path d="m92 37 4 10-10-1" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M61 94c-20 3-32-5-38-19" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" />
      <path d="m26 82-4-10 10 1" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="29" y="18" width="54" height="72" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <rect x="38" y="27" width="54" height="72" fill="none" stroke="#9f9f9f" strokeWidth="4" />
      <path d="M50 42h29M50 53h29M50 64h16" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" />
      <path d="m73 70 9 7-9 7-9-7z" fill="none" stroke="#9f9f9f" strokeWidth="4" strokeLinejoin="round" />
      <path d="M73 84v9" stroke="#9f9f9f" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function LoanNumber({ children }: { children: string }) {
  return (
    <div className="km-loan-number-wrap">
      <span className="km-loan-number-inner">{children}</span>
    </div>
  );
}

export default function LoanGuide() {
  return (
    <section className="km-loan-guide-exact">
      <h2>
        업계최대 <b>전국은행 담보대출</b> 통합서비스
      </h2>
      <p>단 0.1%라도 더 전국은행 최저금리 보장</p>

      <div className="km-loan-guide-list">
        <article>
          <LoanNumber>01</LoanNumber>
          <div className="km-loan-copy">
            <strong>최저금리 담보대출</strong>
            <p>최저 연 2.15% ~ 10년, 20년, 30년, 40년</p>
          </div>
          <div className="km-loan-icon">
            <LowestRateIcon />
          </div>
        </article>

        <article>
          <LoanNumber>02</LoanNumber>
          <div className="km-loan-copy">
            <strong>내국인 / 외국인 모두</strong>
            <p>전국 최대한도 담보 대출 가능</p>
          </div>
          <div className="km-loan-icon">
            <ForeignLoanIcon />
          </div>
        </article>

        <article>
          <LoanNumber>03</LoanNumber>
          <div className="km-loan-copy">
            <strong>계약금 안심보증서비스</strong>
            <p>계약부터 입주까지 문제 발생시 안심보증</p>
          </div>
          <div className="km-loan-icon">
            <ContractIcon />
          </div>
        </article>
      </div>

      <a className="km-loan-consult-button" href="tel:01084268616">
        상담신청하기
      </a>
    </section>
  );
}
