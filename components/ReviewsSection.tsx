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
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        fill="#999" font-size="28" font-family="Arial">고객후기</text>
    </svg>
  `);

const DESKTOP_VISIBLE = 5;
const MOBILE_VISIBLE = 3;
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

    const update = () => {
      setIsMobile(media.matches);
      setCurrentIndex(0);
      setIsAnimating(false);
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
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
      Array.from({ length: DESKTOP_VISIBLE }, (_, index) => ({
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
  const visibleCount = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE;
  const canSlide = sourceItems.length > visibleCount;

  const sliderItems = useMemo(() => {
    if (!canSlide) return sourceItems;

    return [
      ...sourceItems,
      ...sourceItems.slice(0, visibleCount),
    ];
  }, [canSlide, sourceItems, visibleCount]);

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

  const transform = isMobile
    ? `translateX(calc(-${currentIndex} * (((100% - 16px) / 3) + 8px)))`
    : `translateX(calc(-${currentIndex} * (((100% - 48px) / 5) + 12px)))`;

  return (
    <section
      className="km-reviews dy-mobile-ref-reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="km-review-section-head dy-mobile-ref-review-head">
        <h2>
          <strong>DY</strong> 다이아부동산 고객후기
        </h2>

        <div className="km-dot-line" />

        <Link href="/reviews">더보기 ＋</Link>
      </div>

      <div className="dy-mobile-ref-review-viewport">
        <div
          className="dy-mobile-ref-review-track"
          style={{
            transform,
            transition: isAnimating
              ? `transform ${TRANSITION_TIME}ms ease`
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {sliderItems.map((review, index) => {
            const isFallback = review.id < 0;
            const image =
              review.thumbnail_url?.trim() || PLACEHOLDER;

            const content = (
              <>
                <img
                  src={image}
                  alt={review.title || "고객후기"}
                />
                <p>{review.title || "고객후기"}</p>
              </>
            );

            return isFallback ? (
              <div
                className="dy-mobile-ref-review-card"
                key={`fallback-${index}`}
              >
                {content}
              </div>
            ) : (
              <Link
                key={`${review.id}-${index}`}
                href={`/reviews/${review.id}`}
                className="dy-mobile-ref-review-card"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .dy-mobile-ref-reviews {
          width: 100%;
          box-sizing: border-box;
        }

        .dy-mobile-ref-review-head {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .dy-mobile-ref-review-head h2 {
          margin: 0;
          color: #111;
          font-size: 18px;
          font-weight: 900;
          white-space: nowrap;
          letter-spacing: -0.6px;
        }

        .dy-mobile-ref-review-head h2 strong {
          color: #e3a400;
        }

        .dy-mobile-ref-review-head .km-dot-line {
          flex: 1;
          min-width: 0;
          height: 1px;
          border-top: 1px dotted #bbb;
        }

        .dy-mobile-ref-review-head > a {
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

        .dy-mobile-ref-review-viewport {
          width: 100%;
          overflow: hidden;
        }

        .dy-mobile-ref-review-track {
          display: flex;
          align-items: stretch;
          gap: 12px;
          will-change: transform;
        }

        .dy-mobile-ref-review-card {
          width: calc((100% - 48px) / 5);
          flex: 0 0 calc((100% - 48px) / 5);
          min-width: 0;
          display: block;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy-mobile-ref-review-card img {
          width: 100%;
          height: 162px;
          display: block;
          object-fit: cover;
          border: 1px solid #d8d8d8;
          background: #eee;
          box-sizing: border-box;
        }

        .dy-mobile-ref-review-card p {
          display: none;
        }

        @media (max-width: 760px) {
          .dy-mobile-ref-review-head {
            gap: 8px !important;
            margin-bottom: 12px !important;
          }

          .dy-mobile-ref-review-head h2 {
            min-width: 0 !important;
            font-size: 17px !important;
            letter-spacing: -0.8px !important;
          }

          .dy-mobile-ref-review-head .km-dot-line {
            display: none !important;
          }

          .dy-mobile-ref-review-head > a {
            margin-left: auto !important;
            min-width: 76px !important;
            flex: 0 0 76px !important;
            height: 30px !important;
            font-size: 11px !important;
          }

          .dy-mobile-ref-review-track {
            gap: 8px !important;
          }

          .dy-mobile-ref-review-card {
            width: calc((100% - 16px) / 3) !important;
            flex: 0 0 calc((100% - 16px) / 3) !important;
          }

          .dy-mobile-ref-review-card img {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
            object-fit: cover !important;
          }

          .dy-mobile-ref-review-card p {
            display: block !important;
            margin: 6px 0 0 !important;
            overflow: hidden !important;
            color: #333 !important;
            font-size: 11px !important;
            line-height: 1.25 !important;
            text-align: center !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
        }

        @media (max-width: 390px) {
          .dy-mobile-ref-review-head h2 {
            font-size: 15px !important;
          }

          .dy-mobile-ref-review-head > a {
            min-width: 68px !important;
            flex-basis: 68px !important;
          }

          .dy-mobile-ref-review-card p {
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
