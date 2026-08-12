"use client";

import { useCallback, useEffect, useState } from "react";

const BANNERS = [
  {
    desktopSrc: "/dy-main-gift-banner.png",
    mobileSrc: "/dy-main-gift-banner-mobile.png",
    alt: "상담 고객 스타벅스 기프티콘 및 고객 증정 이벤트",
  },
  {
    desktopSrc: "/hero-family-full.jpg",
    mobileSrc: "/hero-family-full-mobile.png",
    alt: "DY다이아부동산 내 집 마련 안내",
  },
];

const AUTOPLAY_DELAY = 4000;

type MainBannerSliderProps = {
  showControls?: boolean;
};

export default function MainBannerSlider({
  showControls = false,
}: MainBannerSliderProps) {
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
            key={banner.desktopSrc}
            className={`km-main-banner-slide ${
              index === activeIndex ? "is-active" : ""
            }`}
            aria-hidden={index !== activeIndex}
          >
            <picture>
              <source
                media="(max-width: 760px)"
                srcSet={banner.mobileSrc}
              />

              <img
                src={banner.desktopSrc}
                alt={banner.alt}
              />
            </picture>
          </div>
        ))}
      </div>

      <style jsx>{`
        .km-main-banner-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
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

        .km-main-banner-slide picture {
          display: block;
          width: 100%;
        }

        .km-main-banner-slide img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          object-position: center;
        }

        /*
         * 모바일 전용
         * PC 스타일에는 영향 없음
         */
        @media (max-width: 760px) {
          .km-main-banner-slider {
            width: calc(100% - 28px);
            margin: 16px auto 28px;
            padding: 0;
            overflow: hidden;
          }

          .km-main-banner-track {
            width: 100%;
          }

          .km-main-banner-slide {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .km-main-banner-slide picture {
            display: block;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .km-main-banner-slide img {
            position: static !important;

            display: block !important;

            width: 100% !important;
            max-width: 100% !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 0 auto !important;
            padding: 0 !important;

            object-fit: contain !important;
            object-position: center center !important;

            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}