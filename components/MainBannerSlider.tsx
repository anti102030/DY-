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
      (current) => (current - 1 + BANNERS.length) % BANNERS.length,
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

      {showControls && BANNERS.length > 1 && (
        <div className="km-main-banner-controls">
          <button type="button" onClick={movePrev} aria-label="이전 배너">
            ‹
          </button>

          <span>
            {activeIndex + 1} / {BANNERS.length}
          </span>

          <button type="button" onClick={moveNext} aria-label="다음 배너">
            ›
          </button>
        </div>
      )}

      <style jsx>{`
        .km-main-banner-slider {
          position: relative;
        }

        .km-main-banner-controls {
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

        .km-main-banner-controls button {
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

        .km-main-banner-controls span {
          min-width: 36px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .km-main-banner-slider {
            width: calc(100% - 30px);
            max-width: calc(100% - 30px);
            margin: 14px auto 18px;
            overflow: hidden;
            box-sizing: border-box;
            background: #fff;
          }

          .km-main-banner-track {
            position: relative;
            width: 100%;
          }

          .km-main-banner-slide {
            display: none;
            width: 100%;
          }

          .km-main-banner-slide.is-active {
            display: block;
          }

          .km-main-banner-slide img {
            width: 100%;
            height: auto;
            max-width: 100%;
            display: block;
            object-fit: contain;
            object-position: center;
          }

          .km-main-banner-controls {
            right: 7px;
            bottom: 7px;
            gap: 3px;
            padding: 3px 5px;
          }

          .km-main-banner-controls button {
            width: 23px;
            height: 23px;
            font-size: 16px;
          }

          .km-main-banner-controls span {
            min-width: 28px;
            font-size: 9px;
          }
        }

        @media (max-width: 430px) {
          .km-main-banner-slider {
            width: calc(100% - 24px);
            max-width: calc(100% - 24px);
          }
        }
      `}</style>
    </section>
  );
}
