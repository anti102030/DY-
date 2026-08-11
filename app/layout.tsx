import type { Metadata } from "next";
import "./globals.css";
import "./km-home.css";

export const metadata: Metadata = {
  title: "DY다이아부동산",
  description: "서울·경기·인천 수도권 부동산 매물",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}