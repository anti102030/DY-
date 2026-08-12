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

type MainBannerSliderProps = {
  showControls?: boolean;
};

export default function MainBannerSlider({
  showControls: _showControls,
}: MainBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const moveNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % BANNERS.length);
  }, []);

  useEffect(() => {
    if (isPaused || BANNERS.length < 2) return;
    const timer = window.setInterval(moveNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [isPaused, moveNext]);

  return (
    <section
      className="km-main-gift-banner km-main-banner-slider dy-mobile-ref-banner"
      aria-label="프로모션 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-main-banner-track dy-mobile-ref-banner-track">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.src}
            className={`km-main-banner-slide dy-mobile-ref-banner-slide${
              index === activeIndex ? " is-active" : ""
            }`}
            aria-hidden={index !== activeIndex}
          >
            <img src={banner.src} alt={banner.alt} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .dy-mobile-ref-banner { position: relative; }

        @media (max-width: 760px) {
          .dy-mobile-ref-banner {
            position: relative !important;
            width: calc(100% - 30px) !important;
            max-width: calc(100% - 30px) !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 16px auto 18px !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #fff !important;
            box-sizing: border-box !important;
          }

          .dy-mobile-ref-banner-track {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            aspect-ratio: 16 / 8.2 !important;
            overflow: hidden !important;
            background: #fff !important;
          }

          .dy-mobile-ref-banner-slide {
            position: absolute !important;
            inset: 0 !important;
            display: none !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            overflow: hidden !important;
            background: #fff !important;
          }

          .dy-mobile-ref-banner-slide.is-active {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .dy-mobile-ref-banner-slide img {
            position: static !important;
            width: 94% !important;
            max-width: 94% !important;
            height: 94% !important;
            max-height: 94% !important;
            display: block !important;
            object-fit: contain !important;
            object-position: center center !important;
            transform: none !important;
            margin: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
