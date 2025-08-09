import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MetaBlobs from "@/components/MetaBlobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "カウントアプリ",
  description: "Next.js + TypeScript + Tailwind のシンプルなカウンター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 背景アニメーションレイヤー + すりガラスオーバーレイ */}
        <div className="relative min-h-dvh overflow-hidden">
          {/* ランダム移動 + 融合・分離のメタボール（CSRでのみ中身を描画） */}
          <MetaBlobs count={7} />

          {/* すりガラス（ブラー + 半透明ダーク） */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 supports-[backdrop-filter]:backdrop-blur-2xl md:supports-[backdrop-filter]:backdrop-blur-3xl backdrop-saturate-150 backdrop-brightness-105 bg-neutral-900/16 dark:bg-neutral-900/35"
          />

          {/* コンテンツ（最前面） */}
          <div className="relative z-10">
            {/* 余分な上部余白を解消 */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
