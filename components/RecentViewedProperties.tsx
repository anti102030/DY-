"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type RecentProperty = {
  id: number;
  title: string;
  thumbnail_url: string;
};

const STORAGE_KEY = "dy_recent_properties";

export default function RecentViewedProperties() {
  const [properties, setProperties] = useState<RecentProperty[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setProperties(Array.isArray(parsed) ? parsed.slice(0, 2) : []);
    } catch {
      setProperties([]);
    }
  }, []);

  return (
    <section className="dy-sidebar-box">
      <h2>최근본매물</h2>

      {properties.length > 0 ? (
        <div className="dy-recent-grid">
          {properties.map((property) => (
            <Link
              href={`/listings/${property.id}`}
              className="dy-recent-card"
              key={property.id}
            >
              <img src={property.thumbnail_url} alt={property.title} />
              <p>{property.title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="dy-sidebar-empty">최근 본 매물이 없습니다.</p>
      )}
    </section>
  );
}
