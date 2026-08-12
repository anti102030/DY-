import Link from "next/link";
import type { Property } from "@/lib/homeData";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";

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
                  <img
                    src={property.image}
                    alt={property.title}
                    loading="lazy"
                  />
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
