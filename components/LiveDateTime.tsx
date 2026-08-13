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
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
}

export default function LiveDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();

    const delay = (60 - new Date().getSeconds()) * 1000;
    let interval: number | undefined;

    const timeout = window.setTimeout(() => {
      updateNow();
      interval = window.setInterval(updateNow, 60_000);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, []);

  if (!now) {
    return <span suppressHydrationWarning>---- -- -- --:--</span>;
  }

  return <span suppressHydrationWarning>{formatKoreaDateTime(now)}</span>;
}
