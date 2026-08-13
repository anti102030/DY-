"use client";

import { useEffect, useState } from "react";

function formatKoreaDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
}

export default function LiveDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const timer = window.setInterval(updateNow, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!now) {
    return <span suppressHydrationWarning>---- -- -- --:--:--</span>;
  }

  return <span suppressHydrationWarning>{formatKoreaDateTime(now)}</span>;
}
