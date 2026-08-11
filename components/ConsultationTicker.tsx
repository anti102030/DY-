"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ConsultationTickerItem = {
  id: number;
  phone: string;
  region: string;
};

type ConsultationTickerProps = {
  items: ConsultationTickerItem[];
  fallbackRegion: string;
};

const VISIBLE_ROWS = 5;
const ROW_HEIGHT = 31;
const WAIT_TIME = 8000;
const MOVE_TIME = 900;

export default function ConsultationTicker({
  items,
  fallbackRegion,
}: ConsultationTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const list = useMemo(() => {
    const safeRegion = fallbackRegion.trim() || "수도권";

    const baseItems =
      items.length > 0
        ? items.map((item) => ({
            ...item,
            phone: item.phone.trim() || "010-XXXX-XXXX",
            region: item.region.trim() || safeRegion,
          }))
        : Array.from({ length: VISIBLE_ROWS }, (_, index) => ({
            id: -(index + 1),
            phone: "010-XXXX-XXXX",
            region: safeRegion,
          }));

    const filledItems = [...baseItems];

    while (filledItems.length < VISIBLE_ROWS + 1) {
      filledItems.push(
        ...baseItems.map((item, index) => ({
          ...item,
          id: Number(
            `${Math.abs(item.id)}${filledItems.length}${index}`
          ),
        }))
      );
    }

    return [...filledItems, ...filledItems];
  }, [items, fallbackRegion]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    setIsReady(false);

    const originalCount = list.length / 2;

    let currentIndex = 0;
    let moveTimer: ReturnType<typeof setTimeout> | null = null;
    let waitTimer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    const resetWithoutAnimation = () => {
      track.style.transition = "none";
      track.style.transform = "translate3d(0, 0, 0)";
      currentIndex = 0;

      void track.offsetHeight;
    };

    const scheduleNextMove = () => {
      if (stopped) return;

      waitTimer = setTimeout(() => {
        if (stopped) return;

        currentIndex += 1;

        track.style.transition =
          `transform ${MOVE_TIME}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        track.style.transform =
          `translate3d(0, -${currentIndex * ROW_HEIGHT}px, 0)`;

        moveTimer = setTimeout(() => {
          if (stopped) return;

          if (currentIndex >= originalCount) {
            resetWithoutAnimation();
          }

          scheduleNextMove();
        }, MOVE_TIME + 30);
      }, WAIT_TIME);
    };

    resetWithoutAnimation();

    const firstFrame = requestAnimationFrame(() => {
      const secondFrame = requestAnimationFrame(() => {
        if (stopped) return;

        setIsReady(true);

        if (originalCount > VISIBLE_ROWS) {
          scheduleNextMove();
        }
      });

      if (stopped) {
        cancelAnimationFrame(secondFrame);
      }
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(firstFrame);

      if (waitTimer) clearTimeout(waitTimer);
      if (moveTimer) clearTimeout(moveTimer);
    };
  }, [list]);

  return (
    <div
      className="consultation-ticker"
      aria-label="최근 상담 접수 현황"
      aria-live="polite"
      style={{
        width: "100%",
        height: VISIBLE_ROWS * ROW_HEIGHT,
        overflow: "hidden",
        border: "1px solid #dddddd",
        background: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <div
        ref={trackRef}
        className="consultation-ticker__track"
        style={{
          visibility: isReady ? "visible" : "hidden",
          opacity: isReady ? 1 : 0,
        }}
      >
        {list.map((item, index) => (
          <div
            className="consultation-ticker__row"
            key={`${item.id}-${index}`}
          >
            <span className="consultation-ticker__status">
              상담접수
            </span>

            <b className="consultation-ticker__phone">
              {item.phone}
            </b>

            <strong
              className="consultation-ticker__region"
              title={item.region}
            >
              {item.region}
            </strong>
          </div>
        ))}
      </div>

      <style jsx>{`
        .consultation-ticker__track {
          width: 100%;
          transform: translate3d(0, 0, 0);
          transition: opacity 0.12s ease;
          will-change: transform;
          backface-visibility: hidden;
        }

        .consultation-ticker__row {
          width: 100%;
          height: ${ROW_HEIGHT}px;
          display: grid;
          grid-template-columns: 74px 1fr 152px;
          align-items: center;
          border-bottom: 1px solid #eeeeee;
          background: #ffffff;
          box-sizing: border-box;
          line-height: 1;
        }

        .consultation-ticker__status,
        .consultation-ticker__phone,
        .consultation-ticker__region {
          min-width: 0;
          height: 100%;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          white-space: nowrap;
        }

        .consultation-ticker__status {
          justify-content: center;
          border-right: 0;
          background: #fafafa;
          color: #2f2f2f;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: -0.45px;
        }

        .consultation-ticker__phone {
          justify-content: center;
          overflow: hidden;
          padding: 0 8px;
          color: #222222;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.25px;
          text-overflow: ellipsis;
        }

        .consultation-ticker__region {
          overflow: hidden;
          justify-content: flex-start;
          padding: 0 12px 0 18px;
          color: #222222;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.55px;
          text-overflow: ellipsis;
        }

        @media (max-width: 700px) {
          .consultation-ticker__row {
            grid-template-columns: 66px 1fr 128px;
          }

          .consultation-ticker__status {
            font-size: 11.5px;
          }

          .consultation-ticker__phone {
            padding: 0 5px;
            font-size: 12.5px;
          }

          .consultation-ticker__region {
            padding: 0 8px 0 12px;
            font-size: 12.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .consultation-ticker__track {
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </div>
  );
}
