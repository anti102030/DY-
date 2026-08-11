"use client";

import { useEffect } from "react";
import type { RecentProperty } from "@/components/RecentViewedProperties";

const STORAGE_KEY = "dy_recent_properties";

export default function RecentViewedTracker({
  property,
}: {
  property: RecentProperty;
}) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const current = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(current) ? current : [];

      const next = [
        property,
        ...list.filter((item) => item?.id !== property.id),
      ].slice(0, 6);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage를 사용할 수 없는 환경에서는 아무 작업도 하지 않습니다.
    }
  }, [property]);

  return null;
}
