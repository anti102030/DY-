"use client";

import { useEffect, useMemo, useState } from "react";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";

type Props = {
  images: string[];
  title: string;
};

function isRealImage(image: string) {
  const value = image.trim();

  if (!value) return false;

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

          <div className="dy-detail-watermark-box">
            <img
              src="/dy-watermark.png"
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>
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

            <div className="dy-modal-watermark-box">
              <img
                src="/dy-watermark.png"
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </div>
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

        .dy-detail-image-wrap {
          position: relative !important;
          overflow: hidden !important;
        }

        .dy-detail-watermark-box {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;

          width: 180px !important;
          height: 180px !important;

          max-width: 28% !important;
          max-height: 50% !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          overflow: visible !important;
          opacity: 0.3 !important;

          pointer-events: none !important;
          user-select: none !important;
          z-index: 50 !important;
        }

        .dy-detail-watermark-box > img {
          display: block !important;

          width: 100% !important;
          height: 100% !important;

          max-width: 100% !important;
          max-height: 100% !important;

          object-fit: contain !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        .dy-gallery-modal-image-wrap {
          position: relative !important;

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

        .dy-modal-watermark-box {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;

          width: 200px !important;
          height: 200px !important;

          max-width: 26% !important;
          max-height: 50% !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          overflow: visible !important;
          opacity: 0.3 !important;

          pointer-events: none !important;
          user-select: none !important;
          z-index: 50 !important;
        }

        .dy-modal-watermark-box > img {
          display: block !important;

          width: 100% !important;
          height: 100% !important;

          max-width: 100% !important;
          max-height: 100% !important;

          object-fit: contain !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 760px) {
          .dy-detail-watermark-box {
            width: 120px !important;
            height: 120px !important;

            max-width: 26% !important;
            max-height: 42% !important;

            opacity: 0.34 !important;
          }

          .dy-modal-watermark-box {
            width: 130px !important;
            height: 130px !important;

            max-width: 26% !important;
            max-height: 42% !important;

            opacity: 0.34 !important;
          }
        }
      `}</style>
    </>
  );
}