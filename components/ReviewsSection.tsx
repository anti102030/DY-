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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="500"
      height="340"
    >
      <rect
        width="100%"
        height="100%"
        fill="#ececec"
      />

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

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "공개")
        .order("id", {
          ascending: false,
        })
        .limit(30);

      if (error) {
        console.error(
          "고객후기 불러오기 실패:",
          error,
        );

        return;
      }

      setReviews(
        (data ?? []) as ReviewRow[],
      );

      setCurrentIndex(0);
    }

    loadReviews();
  }, []);

  /*
    후기가 없을 때 보여줄 기본 카드
  */
  const fallbackItems = useMemo<ReviewRow[]>(
    () =>
      Array.from(
        {
          length: VISIBLE_COUNT,
        },

        (_, index) => ({
          id: -(index + 1),
          title:
            "DY다이아부동산 고객후기",
          content: "",
          author: null,
          thumbnail_url: "",
          image_urls: [],
          status: "공개",
          created_at:
            new Date().toISOString(),
          is_best: false,
        }),
      ),
    [],
  );

  const sourceItems =
    reviews.length > 0
      ? reviews
      : fallbackItems;

  const canSlide =
    reviews.length > VISIBLE_COUNT;

  /*
    무한슬라이드용 배열
    실제 후기 뒤에 앞쪽 5개를 복제
  */
  const sliderItems = useMemo(() => {
    if (!canSlide) {
      return sourceItems;
    }

    return [
      ...sourceItems,
      ...sourceItems.slice(
        0,
        VISIBLE_COUNT,
      ),
    ];
  }, [
    canSlide,
    sourceItems,
  ]);

  /*
    다음 한 칸
  */
  const moveNext =
    useCallback(() => {
      if (
        !canSlide ||
        isAnimating
      ) {
        return;
      }

      setIsAnimating(true);

      setCurrentIndex(
        (current) =>
          current + 1,
      );
    }, [
      canSlide,
      isAnimating,
    ]);

  /*
    이전 한 칸
  */
  const movePrev =
    useCallback(() => {
      if (
        !canSlide ||
        isAnimating
      ) {
        return;
      }

      /*
        0에서 뒤로 가려고 하면
        마지막 위치로 순간 이동 후
        왼쪽 이동 애니메이션
      */
      if (currentIndex === 0) {
        setCurrentIndex(
          sourceItems.length,
        );

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);

            setCurrentIndex(
              sourceItems.length - 1,
            );
          });
        });

        return;
      }

      setIsAnimating(true);

      setCurrentIndex(
        (current) =>
          current - 1,
      );
    }, [
      canSlide,
      currentIndex,
      isAnimating,
      sourceItems.length,
    ]);

  /*
    애니메이션 종료
  */
  function handleTransitionEnd() {
    if (!canSlide) {
      return;
    }

    /*
      복제된 영역까지 이동했으면
      실제 처음 위치로 순간 이동
    */
    if (
      currentIndex >=
      sourceItems.length
    ) {
      setIsAnimating(false);

      setCurrentIndex(0);

      return;
    }

    setIsAnimating(false);
  }

  /*
    자동 재생
  */
  useEffect(() => {
    if (
      !canSlide ||
      isPaused
    ) {
      return;
    }

    timerRef.current =
      window.setInterval(() => {
        moveNext();
      }, AUTOPLAY_DELAY);

    return () => {
      if (
        timerRef.current !== null
      ) {
        window.clearInterval(
          timerRef.current,
        );
      }
    };
  }, [
    canSlide,
    isPaused,
    moveNext,
  ]);

  return (
    <section
      className="km-reviews"
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
    >
      {/* 제목 */}
      <div className="km-review-section-head">
        <h2>
          <strong>DY</strong>{" "}
          다이아부동산 고객후기
        </h2>

        <div className="km-dot-line" />

        <Link href="/reviews">
          더보기 ＋
        </Link>
      </div>

      {/* 슬라이더 */}
      <div className="km-review-slider">
        <div className="km-review-slider-viewport">
          <div
            className="km-review-track"
            style={{
              transform: `translateX(
                calc(
                  -${currentIndex} *
                  (
                    (100% - 48px) / 5
                    + 12px
                  )
                )
              )`,

              transition:
                isAnimating
                  ? `transform ${TRANSITION_TIME}ms ease`
                  : "none",
            }}
            onTransitionEnd={
              handleTransitionEnd
            }
          >
            {sliderItems.map(
              (
                review,
                index,
              ) => {
                const isFallback =
                  review.id < 0;

                const image =
                  review.thumbnail_url?.trim() ||
                  PLACEHOLDER;

                const card = (
                  <img
                    src={image}
                    alt={
                      review.title ||
                      "고객후기"
                    }
                  />
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
              },
            )}
          </div>
        </div>

        {/* 왼쪽 */}
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

        {/* 오른쪽 */}
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

        /*
          =========================
          제목
          =========================
        */

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

          border-top:
            1px dotted #bbb;
        }

        .km-review-section-head > a {
          min-width: 88px;
          height: 30px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid #d3d3d3;

          border-radius: 18px;

          background: #fff;

          color: #333;

          font-size: 11px;
          font-weight: 700;

          text-decoration: none;

          box-sizing: border-box;
        }

        /*
          =========================
          슬라이더
          =========================
        */

        .km-review-slider {
          position: relative;

          width: 100%;
        }

        .km-review-slider-viewport {
          width: 100%;

          overflow: hidden;
        }

        /*
          gap 12px
          5개 보이도록
        */

        .km-review-track {
          display: flex;

          align-items: stretch;

          gap: 12px;

          will-change: transform;
        }

        /*
          한 카드 폭 =
          전체폭 - gap 4개
          나누기 5
        */

        .km-review-card {
          width:
            calc(
              (
                100% - 48px
              ) / 5
            );

          flex:
            0 0
            calc(
              (
                100% - 48px
              ) / 5
            );

          display: block;

          overflow: hidden;

          border:
            1px solid #d8d8d8;

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

          transition:
            transform 0.25s ease;
        }

        .km-review-card:hover img {
          transform: scale(1.03);
        }

        /*
          =========================
          화살표
          =========================
        */

        .km-review-arrow {
          position: absolute;

          top: 50%;

          width: 34px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          transform:
            translateY(-50%);

          border:
            1px solid rgba(
              0,
              0,
              0,
              0.15
            );

          background:
            rgba(
              255,
              255,
              255,
              0.92
            );

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

        /*
          =========================
          반응형
          =========================
        */

        @media (
          max-width: 1100px
        ) {
          .km-review-card img {
            height: 145px;
          }
        }

        @media (
          max-width: 820px
        ) {
          .km-review-track {
            gap: 10px;
          }

          .km-review-card {
            width:
              calc(
                (
                  100% - 20px
                ) / 3
              );

            flex:
              0 0
              calc(
                (
                  100% - 20px
                ) / 3
              );
          }

          .km-review-card img {
            height: 150px;
          }
        }

        @media (
          max-width: 520px
        ) {
          .km-review-section-head h2 {
            font-size: 15px;
          }

          .km-review-section-head > a {
            min-width: 76px;
          }

          .km-review-track {
            gap: 8px;
          }

          .km-review-card {
            width:
              calc(
                (
                  100% - 8px
                ) / 2
              );

            flex:
              0 0
              calc(
                (
                  100% - 8px
                ) / 2
              );
          }

          .km-review-card img {
            height: 140px;
          }

          .km-review-arrow {
            width: 30px;
            height: 44px;
          }
        }
      `}</style>
    </section>
  );
}