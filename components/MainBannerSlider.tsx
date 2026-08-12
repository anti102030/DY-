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

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, moveNext]);

  const activeBanner = BANNERS[activeIndex];

  return (
    <section
      className="dy-main-banner"
      aria-label="프로모션 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <picture className="dy-main-banner-picture">
        <source
          media="(max-width: 760px)"
          srcSet={activeBanner.mobileSrc}
        />

        <img
          className="dy-main-banner-image"
          src={activeBanner.desktopSrc}
          alt={activeBanner.alt}
        />
      </picture>

      <style jsx>{`
        /* ================================
           PC
           기존 배너 비율 그대로 유지
        ================================= */

        .dy-main-banner {
          position: relative;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #fff;
        }

        .dy-main-banner-picture {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .dy-main-banner-image {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
          object-fit: contain;
          object-position: center center;
        }

        /* ================================
           모바일 전용
           고정 높이 / aspect-ratio 제거
           이미지 전체를 그대로 표시
        ================================= */

        @media (max-width: 760px) {
          .dy-main-banner {
            position: relative !important;

            width: calc(100% - 30px) !important;
            max-width: calc(100% - 30px) !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 16px auto 24px !important;
            padding: 0 !important;

            overflow: visible !important;

            aspect-ratio: auto !important;

            background: #fff !important;

            box-sizing: border-box !important;
          }

          .dy-main-banner-picture {
            position: static !important;

            display: block !important;

            width: 100% !important;
            max-width: 100% !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 0 !important;
            padding: 0 !important;

            aspect-ratio: auto !important;

            overflow: visible !important;
          }

          .dy-main-banner-image {
            position: static !important;

            display: block !important;

            width: 100% !important;
            max-width: 100% !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 0 auto !important;
            padding: 0 !important;

            aspect-ratio: auto !important;

            object-fit: contain !important;
            object-position: center center !important;

            transform: none !important;

            clip: auto !important;
          }
        }
      `}</style>
    </section>
  );
}