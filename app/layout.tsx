import type { Metadata } from "next";
import "./globals.css";
import "./km-home.css";

export const metadata: Metadata = {
  title: "DY다이아부동산",
  description: "서울·경기·인천 수도권 부동산 매물",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "DY다이아부동산",
    description: "서울·경기·인천 수도권 부동산 매물",
    images: [
      {
        url: "/dy-og.png",
        width: 600,
        height: 600,
        alt: "DY다이아부동산",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DY다이아부동산",
    description: "서울·경기·인천 수도권 부동산 매물",
    images: ["/dy-og.png"],
  },
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