"use client";

type BrandWatermarkProps = {
  className?: string;
};

export default function BrandWatermark({
  className = "",
}: BrandWatermarkProps) {
  return (
    <img
      src="/dy-watermark.png"
      alt=""
      aria-hidden="true"
      className={`dy-brand-watermark ${className}`}
      draggable={false}
    />
  );
}
