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
    [],
  );

  const sourceItems = reviews.length > 0 ? reviews : fallbackItems;
  const canSlide = isMobile
    ? sourceItems.length > 1
    : reviews.length > VISIBLE_COUNT;

  const sliderItems = useMemo(() => {
    if (!canSlide) return sourceItems;

    return [
      ...sourceItems,
      ...sourceItems.slice(0, isMobile ? 1 : VISIBLE_COUNT),
    ];
  }, [canSlide, isMobile, sourceItems]);

  const moveNext = useCallback(() => {
    if (!canSlide || isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((current) => current + 1);
  }, [canSlide, isAnimating]);

  const movePrev = useCallback(() => {
    if (!canSlide || isAnimating) return;

    if (currentIndex === 0) {
      setCurrentIndex(sourceItems.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setCurrentIndex(sourceItems.length - 1);
        });
      });

      return;
    }

    setIsAnimating(true);
    setCurrentIndex((current) => current - 1);
  }, [canSlide, currentIndex, isAnimating, sourceItems.length]);

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
      className="km-reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-review-section-head">
        <h2>
          <strong>DY</strong> 다이아부동산 고객후기
        </h2>

        <div className="km-dot-line" />

        <Link href="/reviews">더보기 ＋</Link>
      </div>

      <div className="km-review-slider">
        <div className="km-review-slider-viewport">
          <div
            className="km-review-track"
            style={{
              transform: isMobile
                ? `translateX(calc(-${currentIndex} * (100% + 10px)))`
                : `translateX(calc(-${currentIndex} * (((100% - 48px) / 5) + 12px)))`,
              transition: isAnimating
                ? `transform ${TRANSITION_TIME}ms ease`
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {sliderItems.map((review, index) => {
              const isFallback = review.id < 0;
              const image = review.thumbnail_url?.trim() || PLACEHOLDER;

              const card = (
                <img src={image} alt={review.title || "고객후기"} />
              );

              if (isFallback) {
                return (
                  <div
                    className="km-review-card"
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
                  className="km-review-card"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>

        {canSlide && (
          <button
            type="button"
            className="km-review-arrow km-review-arrow-prev"
            aria-label="이전 고객후기"
            onClick={movePrev}
          >
            ‹
          </button>
        )}

        {canSlide && (
          <button
            type="button"
            className="km-review-arrow km-review-arrow-next"
            aria-label="다음 고객후기"
            onClick={moveNext}
          >
            ›
          </button>
        )}
      </div>

      <style>{`
        .km-reviews {
          width: 100%;
          box-sizing: border-box;
        }

        .km-review-section-head {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .km-review-section-head h2 {
          margin: 0;
          color: #111;
          font-size: 18px;
          font-weight: 900;
          white-space: nowrap;
          letter-spacing: -0.6px;
        }

        .km-review-section-head h2 strong {
          color: #e3a400;
        }

        .km-dot-line {
          flex: 1;
          height: 1px;
          border-top: 1px dotted #bbb;
        }

        .km-review-section-head > a {
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

        .km-review-slider {
          position: relative;
          width: 100%;
        }

        .km-review-slider-viewport {
          width: 100%;
          overflow: hidden;
        }

        .km-review-track {
          display: flex;
          align-items: stretch;
          gap: 12px;
          will-change: transform;
        }

        .km-review-card {
          width: calc((100% - 48px) / 5);
          flex: 0 0 calc((100% - 48px) / 5);
          display: block;
          overflow: hidden;
          border: 1px solid #d8d8d8;
          background: #eee;
          box-sizing: border-box;
          text-decoration: none;
        }

        .km-review-card img {
          width: 100%;
          height: 162px;
          display: block;
          object-fit: cover;
          background: #eee;
          transition: transform 0.25s ease;
        }

        .km-review-card:hover img {
          transform: scale(1.03);
        }

        .km-review-arrow {
          position: absolute;
          top: 50%;
          width: 34px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.92);
          color: #333;
          font-size: 29px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
          z-index: 5;
          box-sizing: border-box;
        }

        .km-review-arrow-prev {
          left: 0;
        }

        .km-review-arrow-next {
          right: 0;
        }

        .km-review-arrow:hover {
          background: #fff;
        }

        @media (max-width: 1100px) {
          .km-review-card img {
            height: 145px;
          }
        }

        @media (max-width: 820px) and (min-width: 761px) {
          .km-review-track {
            gap: 10px;
          }

          .km-review-card {
            width: calc((100% - 20px) / 3);
            flex: 0 0 calc((100% - 20px) / 3);
          }

          .km-review-card img {
            height: 150px;
          }
        }

        @media (max-width: 760px) {
          .km-reviews,
          .km-review-slider,
          .km-review-slider-viewport {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }

          .km-reviews,
          .km-review-slider,
          .km-review-slider-viewport {
            overflow: hidden;
          }

          .km-review-section-head {
            gap: 6px;
            margin-bottom: 8px;
          }

          .km-review-section-head h2 {
            min-width: 0;
            font-size: 15px;
            line-height: 1.2;
            white-space: nowrap;
          }

          .km-dot-line {
            min-width: 8px;
          }

          .km-review-section-head > a {
            width: 66px;
            min-width: 66px;
            height: 27px;
            font-size: 10px;
            flex-shrink: 0;
          }

          .km-review-track {
            width: 100%;
            gap: 10px;
            align-items: stretch;
          }

          .km-review-card {
            width: 100%;
            min-width: 100%;
            flex: 0 0 100%;
            box-sizing: border-box;
          }

          .km-review-card img {
            width: 100%;
            height: auto;
            aspect-ratio: 500 / 340;
            display: block;
            object-fit: contain;
            background: #f3f3f3;
          }

          .km-review-arrow {
            width: 30px;
            height: 44px;
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  );
}
