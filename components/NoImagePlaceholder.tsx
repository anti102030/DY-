"use client";

type NoImagePlaceholderProps = {
  className?: string;
};

export default function NoImagePlaceholder({
  className = "",
}: NoImagePlaceholderProps) {
  return (
    <div className={`dy-no-image ${className}`}>
      <div className="dy-no-image-watermark-box">
        <img
          src="/dy-watermark.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>

      <style jsx>{`
        .dy-no-image {
          position: relative;

          width: 100%;
          height: 100%;
          min-height: 180px;

          overflow: hidden;

          background: #090909;
        }

        .dy-no-image-watermark-box {
          position: absolute !important;

          top: 50% !important;
          left: 50% !important;

          transform: translate(-50%, -50%) !important;

          width: 250px !important;
          height: 250px !important;

          max-width: 28% !important;
          max-height: 50% !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          overflow: visible !important;

          opacity: 0.3 !important;

          pointer-events: none !important;
          user-select: none !important;

          z-index: 20 !important;
        }

        .dy-no-image-watermark-box > img {
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
          .dy-no-image {
            min-height: 150px;
          }

          .dy-no-image-watermark-box {
            width: 120px !important;
            height: 120px !important;

            max-width: 26% !important;
            max-height: 42% !important;

            opacity: 0.34 !important;
          }
        }
      `}</style>
    </div>
  );
}