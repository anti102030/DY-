"use client";

export default function DySafeSaleSection() {
  return (
    <section className="dy-safe-sale">
      <div className="dy-safe-sale__image">
        <img
          src="/images/dy-safe-sale-base.png"
          alt="DY다이아부동산 안심분양 안내"
        />

        {/* 상단 국민주택 문구를 가리고 DY 문구 표시 */}
        <div className="dy-safe-sale__top-cover">
          <div className="dy-safe-sale__top-title">
            <span className="dy-safe-sale__top-logo">DY</span>
            <span>안심분양</span>
            <span>DY다이아부동산</span>
          </div>
        </div>

        {/* 가운데 국민주택 로고 및 문구를 가림 */}
        <div className="dy-safe-sale__center-cover">
          <div className="dy-safe-sale__brand">
            <div className="dy-safe-sale__brand-row">
              <span className="dy-safe-sale__dy-logo">DY</span>

              <div className="dy-safe-sale__brand-name-wrap">
                <strong className="dy-safe-sale__brand-name">
                  DY다이아부동산
                </strong>
                <span className="dy-safe-sale__brand-sub">
                  DY REAL ESTATE
                </span>
              </div>
            </div>

            <p className="dy-safe-sale__since">Since 2026,</p>

            <p className="dy-safe-sale__description">
              DY다이아부동산과 함께하세요!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dy-safe-sale {
          width: 100%;
          padding: 0;
        }

        .dy-safe-sale__image {
          position: relative;
          width: 100%;
          max-width: 703px;
          margin: 0 auto;
          overflow: hidden;
          background: #f7f7f7;
        }

        .dy-safe-sale__image > img {
          display: block;
          width: 100%;
          height: auto;
        }

        /* 국민주택 이미지의 상단 노란 배너 영역 */
        .dy-safe-sale__top-cover {
          position: absolute;
          top: 5.4%;
          left: 23%;
          width: 54%;
          height: 6.2%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffbd2e;
          border-radius: 999px;
        }

        /* 오른쪽 말풍선 꼬리 */
        .dy-safe-sale__top-cover::after {
          content: "";
          position: absolute;
          right: 8%;
          bottom: -28%;
          width: 0;
          height: 0;
          border-top: 15px solid #ffbd2e;
          border-left: 15px solid transparent;
        }

        .dy-safe-sale__top-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #ffffff;
          font-family:
            "Pretendard",
            "Noto Sans KR",
            Arial,
            sans-serif;
          font-size: clamp(12px, 2.25vw, 23px);
          font-weight: 900;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .dy-safe-sale__top-logo {
          font-size: 1.08em;
          font-style: italic;
          letter-spacing: -0.1em;
        }

        /* 중앙 국민주택 로고 영역을 덮는 원 */
        .dy-safe-sale__center-cover {
          position: absolute;
          top: 23.9%;
          left: 27.8%;
          width: 43.8%;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 48% 36%,
              #ffffff 0%,
              #ffffff 38%,
              #f5f5f5 70%,
              #e7e7e7 100%
            );
        }

        .dy-safe-sale__brand {
          width: 100%;
          padding-top: 2%;
          text-align: center;
          font-family:
            "Pretendard",
            "Noto Sans KR",
            Arial,
            sans-serif;
        }

        .dy-safe-sale__brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .dy-safe-sale__dy-logo {
          color: #ffb91f;
          font-size: clamp(32px, 7vw, 65px);
          font-weight: 1000;
          font-style: italic;
          line-height: 1;
          letter-spacing: -0.13em;
        }

        .dy-safe-sale__brand-name-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .dy-safe-sale__brand-name {
          color: #171717;
          font-size: clamp(15px, 3.1vw, 29px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.07em;
          white-space: nowrap;
        }

        .dy-safe-sale__brand-sub {
          margin-top: 3px;
          color: #a1a1a1;
          font-size: clamp(6px, 1.15vw, 11px);
          font-weight: 600;
          letter-spacing: 0.07em;
        }

        .dy-safe-sale__since {
          margin: 25px 0 0;
          color: #747474;
          font-size: clamp(15px, 2.7vw, 25px);
          font-weight: 400;
          line-height: 1.2;
        }

        .dy-safe-sale__description {
          margin: 10px 0 0;
          color: #777777;
          font-size: clamp(13px, 2.4vw, 22px);
          font-weight: 500;
          line-height: 1.3;
          letter-spacing: -0.04em;
        }

        @media (max-width: 520px) {
          .dy-safe-sale__top-title {
            gap: 5px;
            letter-spacing: 0;
          }

          .dy-safe-sale__brand-row {
            gap: 6px;
          }

          .dy-safe-sale__since {
            margin-top: 14px;
          }

          .dy-safe-sale__description {
            margin-top: 5px;
          }
        }
      `}</style>
    </section>
  );
}