"use client";

import { useEffect, useMemo, useState } from "react";
import BrandWatermark from "@/components/BrandWatermark";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";

type Props = {
  images: string[];
  title: string;
};

function isRealImage(image: string) {
  const value = image.trim();

  if (!value) return false;

  // 상세페이지에서 사진이 없을 때 사용하는 SVG 임시 이미지 제외
  if (value.startsWith("data:image/svg+xml")) return false;

  return true;
}

export default function DetailGallery({ images, title }: Props) {
  const realImages = useMemo(
    () => images.filter((image) => isRealImage(image)),
    [images]
  );

  const hasImages = realImages.length > 0;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const selectedImage = hasImages ? realImages[selectedIndex] : "";

  useEffect(() => {
    if (selectedIndex >= realImages.length) {
      setSelectedIndex(0);
    }
  }, [realImages.length, selectedIndex]);

  function previous() {
    if (!hasImages) return;

    setSelectedIndex((current) =>
      current === 0 ? realImages.length - 1 : current - 1
    );
  }

  function next() {
    if (!hasImages) return;

    setSelectedIndex((current) =>
      current === realImages.length - 1 ? 0 : current + 1
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!open || !hasImages) return;

      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, hasImages, realImages.length]);

  if (!hasImages) {
    return (
      <div className="km-detail-gallery-box">
        <div className="km-detail-main-image dy-detail-empty-image">
          <NoImagePlaceholder />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="km-detail-gallery-box">
        <div className="km-detail-main-image dy-detail-image-wrap">
          <button
            type="button"
            className="km-gallery-main-button"
            onClick={() => setOpen(true)}
          >
            <img src={selectedImage} alt={title} />
          </button>

          <BrandWatermark className="dy-detail-photo-watermark" />
        </div>

        {realImages.length > 1 && (
          <div className="km-detail-thumbnails">
            {realImages.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={
                  index === selectedIndex
                    ? "km-gallery-thumbnail is-active"
                    : "km-gallery-thumbnail"
                }
                onClick={() => setSelectedIndex(index)}
              >
                <img src={image} alt={`${title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && selectedImage && (
        <div className="km-gallery-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="km-gallery-close"
            onClick={() => setOpen(false)}
            aria-label="닫기"
          >
            ×
          </button>

          {realImages.length > 1 && (
            <button
              type="button"
              className="km-gallery-modal-arrow km-gallery-modal-left"
              onClick={previous}
              aria-label="이전 사진"
            >
              ‹
            </button>
          )}

          <div className="dy-gallery-modal-image-wrap">
            <img src={selectedImage} alt={title} />
            <BrandWatermark className="dy-modal-photo-watermark" />
          </div>

          {realImages.length > 1 && (
            <button
              type="button"
              className="km-gallery-modal-arrow km-gallery-modal-right"
              onClick={next}
              aria-label="다음 사진"
            >
              ›
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .dy-detail-empty-image {
          background: #090909 !important;
          border: 0 !important;
          overflow: hidden;
        }

        /* 상세페이지 메인 사진 기준점 */
        .dy-detail-image-wrap {
          position: relative;
          overflow: hidden;
        }

        /* 상세페이지 메인 워터마크 */
        :global(.dy-detail-photo-watermark) {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 28%;
          max-width: 240px;
          height: auto;

          transform: translate(-50%, -50%);

          object-fit: contain;

          opacity: 0.38;

          pointer-events: none;
          user-select: none;

          z-index: 7;
        }

        /* 확대 이미지 영역 */
        .dy-gallery-modal-image-wrap {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          max-width: 90vw;
          max-height: 90vh;
        }

        .dy-gallery-modal-image-wrap > img {
          display: block;

          max-width: 90vw;
          max-height: 90vh;

          object-fit: contain;
        }

        /* 확대했을 때 워터마크 */
        .dy-gallery-modal-image-wrap :global(.dy-modal-photo-watermark) {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 28%;
          max-width: 300px;
          height: auto;

          transform: translate(-50%, -50%);

          object-fit: contain;

          opacity: 0.36;

          pointer-events: none;
          user-select: none;

          z-index: 3;
        }

        @media (max-width: 760px) {
          :global(.dy-detail-photo-watermark) {
            width: 32%;
            max-width: 200px;
            opacity: 0.4;
          }

          .dy-gallery-modal-image-wrap :global(.dy-modal-photo-watermark) {
            width: 32%;
            max-width: 220px;
            opacity: 0.38;
          }
        }
      `}</style>
    </>
  );
}