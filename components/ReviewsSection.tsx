"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";
import BrandWatermark from "@/components/BrandWatermark";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="340">
      <rect width="100%" height="100%" fill="#ececec" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#999"
        font-size="28"
        font-family="Arial"
      >
        고객후기
      </text>
    </svg>
  `);

const VISIBLE_COUNT = 5;
const AUTOPLAY_DELAY = 3500;
const TRANSITION_TIME = 500;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");

    const updateMobile = () => {
      setIsMobile(media.matches);
      setCurrentIndex(0);
      setIsAnimating(false);
    };

    updateMobile();
    media.addEventListener("change", updateMobile);

    return () => {
      media.removeEventListener("change", updateMobile);
    };
  }, []);

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "공개")
        .order("id", { ascending: false })
        .limit(30);

      if (error) {
        console.error("고객후기 불러오기 실패:", error);
        return;
      }

      setReviews((data ?? []) as ReviewRow[]);
      setCurrentIndex(0);
    }

    loadReviews();
  }, []);

  const fallbackItems = useMemo<ReviewRow[]>(
    () =>
      Array.from({ length: VISIBLE_COUNT }, (_, index) => ({
        id: -(index + 1),
        title: "DY다이아부동산 고객후기",
        content: "",
        author: null,
        thumbnail_url: "",
        image_urls: [],
        status: "공개",
        created_at: new Date().toISOString(),
        is_best: false,
      })),
    []
  );

  const sourceItems =
    reviews.length > 0 ? reviews : fallbackItems;

  const canSlide = isMobile
    ? sourceItems.length > 1
    : reviews.length > VISIBLE_COUNT;

  const sliderItems = useMemo(() => {
    if (!canSlide) return sourceItems;

    return [
      ...sourceItems,
      ...sourceItems.slice(
        0,
        isMobile ? 1 : VISIBLE_COUNT
      ),
    ];
  }, [canSlide, isMobile, sourceItems]);

  const moveNext = useCallback(() => {
    if (!canSlide || isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((current) => current + 1);
  }, [canSlide, isAnimating]);

  function handleTransitionEnd() {
    if (!canSlide) return;

    if (currentIndex >= sourceItems.length) {
      setIsAnimating(false);
      setCurrentIndex(0);
      return;
    }

    setIsAnimating(false);
  }

  useEffect(() => {
    if (!canSlide || isPaused) return;

    timerRef.current = window.setInterval(() => {
      moveNext();
    }, AUTOPLAY_DELAY);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [canSlide, isPaused, moveNext]);

  return (
    <section
      className="km-reviews dy26-reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-review-section-head dy26-review-head">
        <h2>
          <strong>DY</strong>{" "}
          다이아부동산 고객후기
        </h2>

        <div className="km-dot-line" />

        <Link href="/reviews">
          더보기 ＋
        </Link>
      </div>

      <div className="km-review-slider dy26-review-slider">
        <div className="km-review-slider-viewport dy26-review-viewport">
          <div
            className="km-review-track dy26-review-track"
            style={{
              transform: isMobile
                ? `translateX(-${currentIndex * 100}%)`
                : `translateX(calc(-${currentIndex} * (((100% - 48px) / 5) + 12px)))`,
              transition: isAnimating
                ? `transform ${TRANSITION_TIME}ms ease`
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {sliderItems.map((review, index) => {
              const isFallback = review.id < 0;

              const image =
                review.thumbnail_url?.trim() ||
                PLACEHOLDER;

              const card = (
                <div className="dy26-review-image-wrap">
                  <img
                    className="dy26-review-photo"
                    src={image}
                    alt={
                      review.title ||
                      "고객후기"
                    }
                  />

                  <BrandWatermark className="dy26-review-watermark" />
                </div>
              );

              if (isFallback) {
                return (
                  <div
                    className="km-review-card dy26-review-card"
                    key={`fallback-${index}`}
                  >
                    {card}
                  </div>
                );
              }

              return (
                <Link
                  key={`${review.id}-${index}`}
                  href={`/reviews/${review.id}`}
                  className="km-review-card dy26-review-card"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .dy26-reviews {
          width: 100%;
          box-sizing: border-box;
        }

        .dy26-review-head {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .dy26-review-head h2 {
          margin: 0;
          color: #111;
          font-size: 18px;
          font-weight: 900;
          white-space: nowrap;
          letter-spacing: -0.6px;
        }

        .dy26-review-head h2 strong {
          color: #e3a400;
        }

        .dy26-review-head .km-dot-line {
          flex: 1;
          min-width: 0;
          height: 1px;
          border-top: 1px dotted #bbb;
        }

        .dy26-review-head > a {
          min-width: 88px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d3d3d3;
          border-radius: 18px;
          background: #fff;
          color: #333;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy26-review-slider {
          position: relative;
          width: 100%;
        }

        .dy26-review-viewport {
          width: 100%;
          overflow: hidden;
        }

        .dy26-review-track {
          display: flex;
          align-items: stretch;
          gap: 12px;
          will-change: transform;
        }

        .dy26-review-card {
          width: calc((100% - 48px) / 5);
          flex: 0 0 calc((100% - 48px) / 5);
          display: block;
          overflow: hidden;
          border: 1px solid #d8d8d8;
          background: #eee;
          box-sizing: border-box;
          text-decoration: none;
        }

        /*
         * PC 고객후기 이미지 높이
         * 아래 분양정보 매물 이미지와 비슷하게 맞춤
         */
        .dy26-review-image-wrap {
          position: relative;
          width: 100%;
          height: 132px;
          overflow: hidden;
          background: #111;
        }

        .dy26-review-photo {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: #eee;
          transition: transform 0.25s ease;
        }

        .dy26-review-image-wrap .dy26-review-watermark {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 42%;
          max-width: 220px;
          height: auto;

          transform: translate(-50%, -50%);
          object-fit: contain;

          opacity: 0.32;

          pointer-events: none;
          user-select: none;

          z-index: 2;
        }

        .dy26-review-card:hover .dy26-review-photo {
          transform: scale(1.03);
        }

        /*
         * 태블릿에서도 높이를 따로 키우지 않고
         * PC와 같은 132px 유지
         */
        @media (max-width: 1100px) and (min-width: 761px) {
          .dy26-review-image-wrap {
            height: 132px;
          }
        }

        @media (max-width: 760px) {
          .dy26-reviews {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }

          .dy26-review-head {
            width: 100% !important;
            gap: 7px !important;
            margin-bottom: 10px !important;
          }

          .dy26-review-head h2 {
            min-width: 0 !important;
            flex: 0 1 auto !important;
            font-size: 16px !important;
            letter-spacing: -0.8px !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .dy26-review-head .km-dot-line {
            display: none !important;
          }

          .dy26-review-head > a {
            margin-left: auto !important;
            min-width: 72px !important;
            height: 28px !important;
            flex: 0 0 72px !important;
            font-size: 10px !important;
          }

          .dy26-review-slider,
          .dy26-review-viewport {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
          }

          .dy26-review-track {
            width: 100% !important;
            gap: 0 !important;
          }

          .dy26-review-card {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
            aspect-ratio: 16 / 9 !important;
          }

          .dy26-review-image-wrap {
            width: 100% !important;
            height: 100% !important;
          }

          .dy26-review-photo {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            object-position: center !important;
            background: #f2f2f2 !important;
          }

          .dy26-review-image-wrap .dy26-review-watermark {
            width: 60% !important;
            max-width: 320px !important;
          }
        }

        @media (max-width: 430px) {
          .dy26-review-head h2 {
            font-size: 15px !important;
          }

          .dy26-review-head > a {
            min-width: 66px !important;
            flex-basis: 66px !important;
          }
        }
      `}</style>
    </section>
  );
}