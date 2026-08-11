"use client";

import OfficeKakaoMap from "@/components/OfficeKakaoMap";

const ADDRESS =
  "서울특별시 강서구 등촌동 526-26 1층 DY다이아부동산";

export default function ConsultWriteForm() {
  return (
    <section className="dy-location-page">
      <div className="dy-location-heading">
        <h1>오시는길</h1>
        <span>HOME &gt; 오시는길</span>
      </div>

      {/* 지도 */}
      <div className="dy-location-map-wrap">
        <OfficeKakaoMap />
      </div>

      <section className="dy-location-info">
        <h2>DY다이아부동산 오시는길</h2>

        <div className="dy-location-info-table">
          <div className="dy-location-info-row">
            <strong>주소</strong>
            <p>{ADDRESS}</p>
          </div>

          <div className="dy-location-info-row">
            <strong>대표번호</strong>
            <p>
              <a href="tel:01084268616">
                010-8426-8616
              </a>
            </p>
          </div>

          <div className="dy-location-info-row">
            <strong>팩스번호</strong>
            <p>추후 기재 예정</p>
          </div>

          <div className="dy-location-info-row">
            <strong>이메일</strong>
            <p>
              <a href="mailto:tjwodnr94@naver.com">
                tjwodnr94@naver.com
              </a>
            </p>
          </div>

          <div className="dy-location-info-row">
            <strong>상담시간</strong>
            <p>
              연중무휴 365일 24시간 상담 가능
            </p>
          </div>

          <div className="dy-location-info-row">
            <strong>주차안내</strong>
            <p>
              방문 전 연락 주시면 친절하게
              안내해드립니다.
            </p>
          </div>
        </div>
      </section>

      <section className="dy-location-guide">
        <div className="dy-location-guide-card">
          <span className="dy-location-guide-icon">
            🚇
          </span>

          <div>
            <h3>지하철 이용 시</h3>
            <p>
              등촌역에서 하차 후 도보로 이동해
              주세요. 정확한 출구와 이동경로는
              방문 전 전화 주시면 안내해드립니다.
            </p>
          </div>
        </div>

        <div className="dy-location-guide-card">
          <span className="dy-location-guide-icon">
            🚗
          </span>

          <div>
            <h3>자차 이용 시</h3>
            <p>
              내비게이션에 ‘서울 강서구 등촌동
              526-26’을 검색해 주세요. 주차는
              방문 전 연락 주시면 안내해드립니다.
            </p>
          </div>
        </div>
      </section>

      <div className="dy-location-contact-box">
        <div>
          <span>방문 전 상담 예약</span>
          <strong>010-8426-8616</strong>
        </div>

        <a href="tel:01084268616">
          전화상담 바로가기
        </a>
      </div>

      <style>{`
        .dy-location-page {
          width: 100%;
          background: #fff;
        }

        .dy-location-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 2px 0 13px;
          border-bottom: 2px solid #222;
        }

        .dy-location-heading h1 {
          margin: 0;
          color: #111;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-location-heading span {
          color: #888;
          font-size: 11px;
        }

        /*
          지도만 국민주택처럼
          가로 넓고 높이는 낮게
        */
        .dy-location-map-wrap {
          width: 100%;
          margin-top: 18px;
        }

        .dy-location-info {
          margin-top: 28px;
        }

        .dy-location-info h2 {
          margin: 0 0 12px;
          color: #222;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -0.7px;
        }

        .dy-location-info-table {
          border-top: 2px solid #333;
        }

        .dy-location-info-row {
          display: grid;
          grid-template-columns:
            145px minmax(0, 1fr);
          min-height: 58px;
          border-bottom: 1px solid #dfdfdf;
        }

        .dy-location-info-row > strong {
          display: flex;
          align-items: center;
          padding: 0 18px;
          background: #f7f7f7;
          color: #333;
          font-size: 13px;
          font-weight: 800;
          box-sizing: border-box;
        }

        .dy-location-info-row > p {
          display: flex;
          align-items: center;
          margin: 0;
          padding: 12px 18px;
          color: #555;
          font-size: 13px;
          line-height: 1.6;
          box-sizing: border-box;
        }

        .dy-location-info-row a {
          color: #333;
          font-weight: 700;
          text-decoration: none;
        }

        .dy-location-guide {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 24px;
        }

        .dy-location-guide-card {
          display: grid;
          grid-template-columns:
            56px minmax(0, 1fr);
          gap: 12px;
          min-height: 126px;
          padding: 18px;
          border: 1px solid #ddd;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-location-guide-icon {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 2px;
          font-size: 34px;
        }

        .dy-location-guide-card h3 {
          margin: 0 0 8px;
          color: #222;
          font-size: 15px;
          font-weight: 900;
        }

        .dy-location-guide-card p {
          margin: 0;
          color: #666;
          font-size: 12px;
          line-height: 1.75;
        }

        .dy-location-contact-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
          padding: 22px 24px;
          border: 1px solid #e3a916;
          background: #f7b92b;
          box-sizing: border-box;
        }

        .dy-location-contact-box > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dy-location-contact-box span {
          color: #fff;
          font-size: 14px;
          font-weight: 800;
        }

        .dy-location-contact-box strong {
          color: #fff;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-location-contact-box > a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 150px;
          height: 42px;
          padding: 0 18px;
          border: 1px solid #fff;
          background: #fff;
          color: #d58300;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          box-sizing: border-box;
        }

        @media (max-width: 760px) {
          .dy-location-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dy-location-info-row {
            grid-template-columns:
              105px minmax(0, 1fr);
          }

          .dy-location-guide {
            grid-template-columns: 1fr;
          }

          .dy-location-contact-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .dy-location-contact-box > a {
            width: 100%;
          }
        }

        @media (max-width: 520px) {
          .dy-location-info-row {
            grid-template-columns:
              92px minmax(0, 1fr);
          }

          .dy-location-info-row > strong,
          .dy-location-info-row > p {
            padding-right: 12px;
            padding-left: 12px;
          }
        }
      `}</style>
    </section>
  );
}