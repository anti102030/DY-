import Link from "next/link";
import type { Property } from "@/lib/homeData";

type Props = {
  title: string;
  properties: Property[];
  city?: string;
  variant?: "cards" | "regional-list";
};

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(value))
    .replaceAll(". ", "-")
    .replace(".", "");
}

function RegionalPropertyList({
  properties,
}: {
  properties: Property[];
}) {
  if (properties.length === 0) {
    return <div className="km-property-empty">등록된 매물이 없습니다.</div>;
  }

  return (
    <div className="dy-regional-property-list">
      {properties.map((property) => {
        const addressText = [
          property.city,
          property.district,
          property.neighborhood,
        ]
          .filter(Boolean)
          .join(" ");

        const areaSquareMeter = property.areaPyeong
          ? Math.round(property.areaPyeong * 3.3058)
          : null;

        return (
          <article
            key={property.id}
            className="dy-regional-property-item"
          >
            <Link
              href={`/listings/${property.id}`}
              className="dy-regional-property-thumb"
            >
              <img
                src={property.image || "/images/no-image.png"}
                alt={property.title}
                loading="lazy"
              />
            </Link>

            <div className="dy-regional-property-content">
              <div className="dy-regional-badges">
                <b className="dy-regional-safe">안심인증</b>
                <b className="dy-regional-confirm">
                  {formatDate(property.createdAt)} 확인
                </b>
                <b className="dy-regional-new">
                  {property.listingBadge || "신축분양"}
                </b>
                <b className="dy-regional-alert">
                  <span aria-hidden="true">🔔</span>
                  알림
                </b>
              </div>

              <p className="dy-regional-number">
                [매물번호 {property.id}] {addressText}
              </p>

              <Link
                href={`/listings/${property.id}`}
                className="dy-regional-title"
              >
                {property.title}
              </Link>

              <div className="dy-regional-summary">
                <span>
                  {property.areaPyeong
                    ? `${property.areaPyeong}평`
                    : "면적문의"}
                  {areaSquareMeter ? (
                    <em>({areaSquareMeter}㎡)</em>
                  ) : null}
                </span>
                <i>|</i>
                <span>
                  방{property.rooms ?? "-"}욕실
                  {property.bathrooms ?? "-"}
                </span>
                <i>|</i>
                <span>주차대수 문의</span>
              </div>

              <div className="dy-regional-subway">
                지하철 <strong>정보문의</strong>
              </div>

              <div className="dy-regional-price">
                <span>분양가</span>
                <b>{property.price || "문의"}</b>
                <span>입주금</span>
                <b>{property.deposit || "문의"}</b>
                <span>융자금</span>
                <b>{property.loan || "문의"}</b>
              </div>
            </div>

            <aside className="dy-regional-manager">
              <strong>DY다이아부동산</strong>
              <a href="tel:01084268616">010-8426-8616</a>
            </aside>
          </article>
        );
      })}

      <style>{`
        .dy-regional-property-list {
          border-top: 1px solid #d8d8d8;
          background: #fff;
        }

        .dy-regional-property-item {
          min-height: 205px;
          padding: 12px 10px;
          display: grid;
          grid-template-columns: 274px minmax(0, 1fr) 165px;
          column-gap: 14px;
          align-items: stretch;
          border-bottom: 1px solid #d8d8d8;
          box-sizing: border-box;
        }

        .dy-regional-property-thumb {
          display: block;
          width: 274px;
          height: 181px;
          overflow: hidden;
          background: #f3f3f3;
        }

        .dy-regional-property-thumb img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .dy-regional-property-content {
          min-width: 0;
          padding-top: 1px;
        }

        .dy-regional-badges {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 9px;
        }

        .dy-regional-badges > b {
          min-height: 28px;
          padding: 0 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border-radius: 0;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }

        .dy-regional-safe {
          border: 1px solid #56aee8;
          background: #56aee8;
          color: #fff;
        }

        .dy-regional-confirm,
        .dy-regional-new,
        .dy-regional-alert {
          border: 1px solid #d8d8d8;
          background: #fff;
          color: #111;
        }

        .dy-regional-alert {
          gap: 2px;
          padding: 0 7px !important;
        }

        .dy-regional-alert span {
          font-size: 11px;
          line-height: 1;
        }

        .dy-regional-number {
          margin: 0 0 5px;
          color: #111;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.3;
        }

        .dy-regional-title {
          display: block;
          margin-bottom: 7px;
          overflow: hidden;
          color: #111;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.3;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dy-regional-summary {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }

        .dy-regional-summary em {
          margin-left: 3px;
          color: #49a800;
          font-style: normal;
          font-weight: 800;
        }

        .dy-regional-summary i {
          color: #bbb;
          font-style: normal;
        }

        .dy-regional-subway {
          margin-bottom: 9px;
          color: #666;
          font-size: 13px;
        }

        .dy-regional-subway strong {
          color: #49a800;
        }

        .dy-regional-price {
          min-height: 36px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          border: 1px solid #eadbc2;
          background: #fffaf0;
          box-sizing: border-box;
          font-size: 12px;
        }

        .dy-regional-price span {
          padding: 4px 7px;
          color: #fff;
          font-weight: 800;
          line-height: 1;
        }

        .dy-regional-price span:nth-of-type(1) {
          background: #365fc1;
        }

        .dy-regional-price span:nth-of-type(2) {
          background: #df3e7d;
        }

        .dy-regional-price span:nth-of-type(3) {
          background: #86ae27;
        }

        .dy-regional-price b {
          margin-right: 4px;
          color: #111;
          font-size: 12px;
          font-weight: 900;
        }

        .dy-regional-manager {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .dy-regional-manager strong {
          margin-bottom: 8px;
          color: #111;
          font-size: 14px;
          font-weight: 900;
        }

        .dy-regional-manager a {
          color: #f2a000;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .dy-regional-property-item {
            grid-template-columns: 210px minmax(0, 1fr);
          }

          .dy-regional-property-thumb {
            width: 210px;
          }

          .dy-regional-manager {
            grid-column: 1 / -1;
            padding: 10px 0 0;
            flex-direction: row;
            gap: 12px;
          }
        }

        @media (max-width: 620px) {
          .dy-regional-property-item {
            grid-template-columns: 1fr;
          }

          .dy-regional-property-thumb {
            width: 100%;
            height: 220px;
          }

          .dy-regional-property-content {
            padding-top: 10px;
          }

          .dy-regional-manager {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default function PropertySection({
  title,
  properties,
  city,
  variant = "cards",
}: Props) {
  if (variant === "regional-list") {
    return (
      <section className="km-property-section km-property-section-regional">
        <RegionalPropertyList properties={properties} />
      </section>
    );
  }

  return (
    <section className="km-property-section">
      <div className="km-property-heading">
        <h2>{title}</h2>
        <div className="km-property-heading-line" />
        <Link href={city ? `/listings?city=${city}` : "/listings"}>
          더보기 ＋
        </Link>
      </div>

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
                <img
                  src={property.image || "/images/no-image.png"}
                  alt={property.title}
                  loading="lazy"
                />
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
    </section>
  );
}
