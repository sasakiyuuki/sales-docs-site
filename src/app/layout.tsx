import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: "CASTER BIZ assistant - 営業資料",
  description: "株式会社キャスターの営業資料サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${notoSansJP.className} font-sans`}>{children}</body>
    </html>
  );
}
