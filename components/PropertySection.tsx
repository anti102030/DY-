import Link from "next/link";
import type { Property } from "@/lib/homeData";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
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
                  <NoImagePlaceholder />
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
        <div className="km-property-empty">등록된 매물이 없습니다.</div>
      )}

      <style>{`
        .dy-section-photo-wrap {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .dy-section-photo-wrap > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dy-section-photo-wrap .dy-section-card-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 64%;
          max-width: 330px;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          opacity: 0.40;
          pointer-events: none;
          user-select: none;
          z-index: 3;
        }

        @media (max-width: 760px) {
          .dy-section-photo-wrap .dy-section-card-watermark {
            width: 68%;
            opacity: 0.44;
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
