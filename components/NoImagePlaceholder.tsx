"use client";

import BrandWatermark from "@/components/BrandWatermark";

type NoImagePlaceholderProps = {
  className?: string;
};

export default function NoImagePlaceholder({
  className = "",
}: NoImagePlaceholderProps) {
  return (
    <div className={`dy-no-image ${className}`}>
      <BrandWatermark className="dy-no-image-watermark" />

      <style jsx>{`
        .dy-no-image {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 180px;
          overflow: hidden;
          background: #080808;
        }

        .dy-no-image :global(.dy-no-image-watermark) {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 62%;
          max-width: 420px;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        @media (max-width: 760px) {
          .dy-no-image {
            min-height: 150px;
          }

          .dy-no-image :global(.dy-no-image-watermark) {
            width: 68%;
          }
        }
      `}</style>
    </div>
  );
}
