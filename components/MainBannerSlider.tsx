"use client";

import { useCallback, useEffect, useState } from "react";

const BANNERS = [
  {
    src: "/dy-main-gift-banner.png",
    alt: "상담 고객 스타벅스 기프티콘 및 고객 증정 이벤트",
  },
  {
    src: "/hero-family-full.jpg",
    alt: "DY다이아부동산 내 집 마련 안내",
  },
];

const AUTOPLAY_DELAY = 4000;

export default function MainBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const moveNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % BANNERS.length);
  }, []);

  useEffect(() => {
    if (isPaused || BANNERS.length < 2) return;

    const timer = window.setInterval(moveNext, AUTOPLAY_DELAY);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, moveNext]);

  return (
    <section
      className="km-main-gift-banner km-main-banner-slider"
      aria-label="프로모션 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-main-banner-track">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.src}
            className={`km-main-banner-slide${
              index === activeIndex ? " is-active" : ""
            }`}
            aria-hidden={index !== activeIndex}
          >
            <img src={banner.src} alt={banner.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}
