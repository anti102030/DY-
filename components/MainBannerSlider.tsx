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
  showControls = true,
}: MainBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const moveNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % BANNERS.length);
  }, []);

  const movePrev = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current - 1 + BANNERS.length) % BANNERS.length
    );
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
      className="km-main-gift-banner km-main-banner-slider dy26-main-banner"
      aria-label="프로모션 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-main-banner-track dy26-main-banner-track">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.src}
            className={`km-main-banner-slide dy26-main-banner-slide${
              index === activeIndex ? " is-active" : ""
            }`}
            aria-hidden={index !== activeIndex}
          >
            <img src={banner.src} alt={banner.alt} />
          </div>
        ))}
      </div>

      {showControls && BANNERS.length > 1 && (
        <div className="km-main-banner-controls dy26-main-banner-controls">
          <button
            type="button"
            onClick={movePrev}
            aria-label="이전 배너"
          >
            ‹
          </button>

          <span>
            {activeIndex + 1} / {BANNERS.length}
          </span>

          <button
            type="button"
            onClick={moveNext}
            aria-label="다음 배너"
          >
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .dy26-main-banner {
          position: relative;
        }

        .dy26-main-banner-controls {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          z-index: 5;
        }

        .dy26-main-banner-controls button {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }

        .dy26-main-banner-controls span {
          min-width: 36px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .dy26-main-banner {
            width: calc(100% - 30px) !important;
            max-width: calc(100% - 30px) !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 16px auto 22px !important;
            overflow: hidden !important;
            background: #fff !important;
            box-sizing: border-box !important;
          }

          .dy26-main-banner-track {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
          }

          .dy26-main-banner-slide {
            position: static !important;
            display: none !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }

          .dy26-main-banner-slide.is-active {
            display: block !important;
          }

          .dy26-main-banner-slide img {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            display: block !important;
            object-fit: contain !important;
            object-position: center !important;
            transform: none !important;
          }

          .dy26-main-banner-controls {
            right: 7px !important;
            bottom: 7px !important;
            gap: 3px !important;
            padding: 3px 5px !important;
          }

          .dy26-main-banner-controls button {
            width: 23px !important;
            height: 23px !important;
            font-size: 16px !important;
          }

          .dy26-main-banner-controls span {
            min-width: 28px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
    </section>
  );
}
