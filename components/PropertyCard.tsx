import Link from "next/link";
import type { Property } from "@/lib/homeData";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import BrandWatermark from "@/components/BrandWatermark";

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
          <div className="dy-property-photo-wrap">
            <img
              src={property.image}
              alt={property.title}
              className="property-image"
            />
            <BrandWatermark className="dy-property-card-watermark" />
          </div>
        ) : (
          <NoImagePlaceholder className="property-image" />
        )}
      </div>

      <style jsx>{`
        .dy-property-photo-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .dy-property-photo-wrap :global(.dy-property-card-watermark) {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 42%;
          max-width: 230px;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          opacity: 0.34;
          pointer-events: none;
          user-select: none;
          z-index: 3;
        }
      `}</style>

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
