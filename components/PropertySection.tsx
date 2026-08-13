import Link from "next/link";
import type { Property } from "@/lib/homeData";
import BrandWatermark from "@/components/BrandWatermark";

type Props = {
  title: string;
  properties: Property[];
  city?: string;
  hideHeading?: boolean;
};

export default function PropertySection({
  title,
  properties,
  city,
  hideHeading = false,
}: Props) {
  return (
    <section
      className={`km-property-section${
        hideHeading ? " km-property-section-no-heading" : ""
      }`}
    >
      {!hideHeading && (
        <div className="km-property-heading">
          <h2>{title}</h2>

          <div className="km-property-heading-line" />

          <Link href={city ? `/listings?city=${city}` : "/listings"}>
            더보기 ＋
          </Link>
        </div>
      )}

      {properties.length > 0 ? (
        <div className="km-property-grid">
          {properties.map((property) => (
            <article key={property.id} className="km-property-card">
              <Link
                href={`/listings/${property.id}`}
                className="km-property-title"
              >
                {property.title}
              </Link>

              <Link
                href={`/listings/${property.id}`}
                className="km-property-image"
              >
                {property.image ? (
                  <span className="dy-section-photo-wrap">
                    <img
                      src={property.image}
                      alt={property.title}
                      loading="lazy"
                    />

                    <BrandWatermark className="dy-section-card-watermark" />
                  </span>
                ) : (
                  <span className="dy-section-photo-wrap dy-section-no-photo">
                    <BrandWatermark className="dy-section-card-watermark" />
                  </span>
                )}
              </Link>

              <div className="km-property-info">
                <div>
                  <span className="is-region">지역</span>
                  <strong>{property.location || "-"}</strong>
                </div>

                <div>
                  <span className="is-price">분양가</span>
                  <strong>{property.price || "-"}</strong>
                </div>

                <div>
                  <span className="is-deposit">입주금</span>
                  <strong>{property.deposit || "-"}</strong>
                </div>

                <div>
                  <span className="is-loan">융자금</span>
                  <strong>{property.loan || "-"}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="km-property-empty">
          등록된 매물이 없습니다.
        </div>
      )}

      <style>{`
        /*
         * 사진 있음 / 사진 없음
         * 둘 다 완전히 동일한 영역 사용
         */
        .dy-section-photo-wrap {
          position: relative;
          display: block;

          width: 100%;
          height: 100%;

          overflow: hidden;
        }

        /*
         * 실제 매물 사진
         */
        .dy-section-photo-wrap > img:not(.dy-section-card-watermark) {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        /*
         * 사진이 없는 경우
         * 카드 사진 영역 크기는 그대로 유지
         */
        .dy-section-no-photo {
          width: 100%;
          height: 100%;

          background: #090909;
        }

        /*
         * 사진 있음 / 사진 없음
         * 동일한 워터마크 설정
         */
        .dy-section-photo-wrap .dy-section-card-watermark {
          position: absolute !important;

          top: 50% !important;
          left: 50% !important;

          transform: translate(-50%, -50%) !important;

          width: 42% !important;
          max-width: 230px !important;

          height: auto !important;

          object-fit: contain !important;

          opacity: 0.34 !important;

          pointer-events: none !important;
          user-select: none !important;

          z-index: 3 !important;
        }

        @media (max-width: 760px) {
          .dy-section-photo-wrap .dy-section-card-watermark {
            width: 46% !important;
            opacity: 0.38 !important;
          }
        }
      `}</style>

      {hideHeading && (
        <style>{`
          .km-property-section-no-heading {
            margin-top: 0;
            padding-top: 0;
            border-top: 1px solid #d8d8d8;
          }

          .km-property-section-no-heading .km-property-grid {
            margin-top: 12px;
          }
        `}</style>
      )}
    </section>
  );
}