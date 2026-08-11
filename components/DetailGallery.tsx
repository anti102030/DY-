"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

const MAX_THUMBNAILS = 10;

function isRealImage(image: string) {
  const value = image.trim();
  if (!value) return false;
  if (value.startsWith("data:image/svg+xml")) return false;
  return true;
}

export default function DetailGallery({ images, title }: Props) {
  const realImages = useMemo(() => {
    const seen = new Set<string>();

    return images
      .filter((image) => isRealImage(image))
      .filter((image) => {
        const normalized = image.trim();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      })
      .slice(0, MAX_THUMBNAILS);
  }, [images]);

  const hasImages = realImages.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const selectedImage = hasImages ? realImages[selectedIndex] : "";

  useEffect(() => {
    if (selectedIndex >= realImages.length) setSelectedIndex(0);
  }, [realImages.length, selectedIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (open && event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!hasImages) {
    return (
      <div className="km-detail-gallery-box">
        <div className="km-detail-main-image km-detail-image-empty">사진 준비중</div>
      </div>
    );
  }

  const thumbnailSlots = Array.from({ length: MAX_THUMBNAILS }, (_, index) =>
    realImages[index] ?? null,
  );

  return (
    <>
      <div className="km-detail-gallery-box">
        <div className="km-detail-main-image">
          <button
            type="button"
            className="km-gallery-main-button"
            onClick={() => setOpen(true)}
          >
            <img src={selectedImage} alt={title} />
          </button>

          <div className="km-detail-watermark-logo" aria-hidden="true">
            <img src="/dy-logo-transparent.png" alt="" />
          </div>
        </div>

        <div className="km-detail-thumbnails" aria-label="매물 사진 목록">
          {thumbnailSlots.map((image, index) =>
            image ? (
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
            ) : (
              <div
                key={`empty-${index}`}
                className="km-gallery-thumbnail km-gallery-thumbnail-empty"
                aria-hidden="true"
              />
            ),
          )}
        </div>
      </div>

      {open && selectedImage && (
        <div
          className="km-gallery-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="km-gallery-close"
            onClick={() => setOpen(false)}
            aria-label="닫기"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt={title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
