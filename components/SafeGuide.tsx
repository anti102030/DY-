function MoneyIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="43" y="28" width="34" height="54" rx="5" fill="#d7d7d7" />
      <rect x="48" y="34" width="24" height="42" rx="3" fill="#f1f1f1" />
      <circle cx="60" cy="55" r="7" fill="#f7bf22" />
      <path d="M26 72h31v17H26z" fill="#f2b11e" />
      <circle cx="34" cy="86" r="10" fill="#f6c84a" />
      <circle cx="48" cy="90" r="12" fill="#eab01f" />
      <path d="M51 43h18" stroke="#aaa" strokeWidth="3" />
      <path d="M51 67h18" stroke="#aaa" strokeWidth="3" />
    </svg>
  );
}

function HouseDocumentIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect
        x="33"
        y="18"
        width="42"
        height="58"
        rx="4"
        fill="#e9edf2"
        stroke="#9fa9b5"
        strokeWidth="3"
      />
      <rect x="41" y="29" width="26" height="4" fill="#c0c8d0" />
      <rect x="41" y="39" width="20" height="4" fill="#c0c8d0" />
      <path d="M58 72 80 55l24 18v28H58z" fill="#f2c84b" />
      <path
        d="M54 76 80 55l27 21"
        fill="none"
        stroke="#d5a51d"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="76" y="82" width="11" height="19" fill="#fff2b5" />
    </svg>
  );
}

function MapHouseIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path
        d="M64 15c0 14-16 28-16 28S32 29 32 15a16 16 0 1 1 32 0Z"
        fill="#6da6ff"
      />
      <circle cx="48" cy="15" r="6" fill="#fff" />
      <path d="M20 70 51 45l34 25v31H20z" fill="#f1cd57" />
      <path
        d="M16 74 51 45l37 29"
        fill="none"
        stroke="#d4aa24"
        strokeWidth="5"
      />
      <rect x="47" y="78" width="13" height="23" fill="#fff" />
      <rect x="68" y="75" width="15" height="13" fill="#bfe0ff" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="23" y="42" width="74" height="48" fill="#dce6ef" />
      <rect x="23" y="36" width="74" height="10" fill="#78a7d8" />
      <rect x="31" y="49" width="10" height="41" fill="#b5c8db" />
      <rect x="50" y="49" width="10" height="41" fill="#b5c8db" />
      <rect x="69" y="49" width="10" height="41" fill="#b5c8db" />
      <rect x="88" y="49" width="9" height="41" fill="#b5c8db" />
      <ellipse cx="40" cy="91" rx="22" ry="8" fill="#e9b326" />
      <ellipse cx="55" cy="84" rx="22" ry="8" fill="#f2c74e" />
      <ellipse cx="72" cy="94" rx="20" ry="7" fill="#dca70e" />
      <path
        d="M20 67c-9 7-11 17-5 27"
        fill="none"
        stroke="#22aab7"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="m10 69 10-4-2 11" fill="#22aab7" />
    </svg>
  );
}

function ShieldDocumentIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="33" y="22" width="44" height="60" rx="4" fill="#e7e8ea" />
      <path
        d="M43 39h23M43 49h23M43 59h18"
        stroke="#f2c427"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M72 61 95 72v16c0 12-9 21-23 27-14-6-23-15-23-27V72z"
        fill="#f3c72d"
        stroke="#d8aa1c"
        strokeWidth="3"
      />
      <path
        d="m64 88 6 6 12-15"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GuideLine() {
  return (
    <svg
      className="dy-safe-guide-line"
      viewBox="0 0 700 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M135 145 C155 255 210 330 350 355 C490 330 545 255 565 145"
        fill="none"
        stroke="#d6d6d6"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle cx="135" cy="145" r="10" fill="#fff" stroke="#d5d5d5" strokeWidth="2" />
      <circle cx="135" cy="145" r="5" fill="#ffbd1f" />

      <circle cx="225" cy="315" r="10" fill="#fff" stroke="#d5d5d5" strokeWidth="2" />
      <circle cx="225" cy="315" r="5" fill="#ff6a1e" />

      <circle cx="350" cy="355" r="10" fill="#fff" stroke="#d5d5d5" strokeWidth="2" />
      <circle cx="350" cy="355" r="5" fill="#ef1f24" />

      <circle cx="475" cy="315" r="10" fill="#fff" stroke="#d5d5d5" strokeWidth="2" />
      <circle cx="475" cy="315" r="5" fill="#cc3aa5" />

      <circle cx="565" cy="145" r="10" fill="#fff" stroke="#d5d5d5" strokeWidth="2" />
      <circle cx="565" cy="145" r="5" fill="#21aeea" />
    </svg>
  );
}

export default function SafeGuide() {
  return (
    <section className="dy-safe-guide">
      <div className="dy-safe-guide-label">DY 안심분양</div>

      <h2 className="dy-safe-guide-heading">
        평생살집, <b>안전한 내집마련</b>을 원하시나요?
      </h2>

      <div className="dy-safe-guide-orbit">
        <GuideLine />

        <div className="dy-safe-guide-center">
          <img src="/dy-logo-transparent.png" alt="DY다이아부동산" />
          <strong>DY다이아부동산</strong>
          <p>내 집 마련부터 입주까지 함께하세요.</p>
        </div>

        <div className="dy-safe-guide-node dy-safe-guide-node-one">
          <div className="dy-safe-guide-icon">
            <MoneyIcon />
          </div>
          <p>
            가용자금 확인
            <br />
            &amp; 상담진행
          </p>
        </div>

        <div className="dy-safe-guide-node dy-safe-guide-node-two">
          <div className="dy-safe-guide-icon">
            <HouseDocumentIcon />
          </div>
          <p>
            잔금·소유권이전등기
            <br />
            입주까지 책임진행
          </p>
        </div>

        <div className="dy-safe-guide-node dy-safe-guide-node-three">
          <div className="dy-safe-guide-icon">
            <MapHouseIcon />
          </div>
          <p>
            원하는 지역
            <br />
            &amp; 인근지역 투어
          </p>
        </div>

        <div className="dy-safe-guide-node dy-safe-guide-node-four">
          <div className="dy-safe-guide-icon">
            <BankIcon />
          </div>
          <p>
            전국은행 협약
            <br />
            최저금리·최대한도 대출진행
          </p>
        </div>

        <div className="dy-safe-guide-node dy-safe-guide-node-five">
          <div className="dy-safe-guide-icon">
            <ShieldDocumentIcon />
          </div>
          <p>
            계약진행
            <br />
            계약금 안심보증서비스
          </p>
        </div>
      </div>
    </section>
  );
}
