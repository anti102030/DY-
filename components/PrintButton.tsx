"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()}>
      프린트하기
    </button>
  );
}
