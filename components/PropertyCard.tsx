import Link from "next/link";
import type { Property } from "@/lib/homeData";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  const card = (
    <article className="property-card">
      <h3 className="property-title">{property.title}</h3>

      <div className="property-image-wrap">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="property-image"
          />
        ) : (
          <NoImagePlaceholder className="property-image" />
        )}
      </div>

      <div className="property-info">
        <div className="info-row">
          <span className="label location-label">지역</span>
          <strong>{property.location}</strong>
        </div>

        <div className="info-row">
          <span className="label price-label">분양가</span>
          <strong>{property.price}</strong>
        </div>

        <div className="info-row">
          <span className="label deposit-label">입주금</span>
          <strong>{property.deposit}</strong>
        </div>

        <div className="info-row">
          <span className="label loan-label">융자금</span>
          <strong>{property.loan}</strong>
        </div>
      </div>
    </article>
  );

  if (!property.id) return card;

  return (
    <Link
      href={`/listings/${property.id}`}
      className="property-card-link"
    >
      {card}
    </Link>
  );
}
