import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PhotoProvider } from "./context/PhotoContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KacaKacaBooth - 免费在线照相亭 | Free Online Photobooth",
  description: "KacaKacaBooth是一个免费的在线照相亭，可以拍摄四连拍照片，添加滤镜、边框和贴纸，一键导出分享。Free online photobooth to take 4 consecutive photos with filters, frames and stickers.",
  keywords: ["photobooth", "free photobooth", "online photobooth", "照相亭", "在线照相亭", "免费照相亭"],
  authors: [{ name: "KacaKacaBooth Team" }],
  openGraph: {
    title: "KacaKacaBooth - 免费在线照相亭 | Free Online Photobooth",
    description: "拍摄四连拍照片，添加滤镜、边框和贴纸，一键导出分享。Take 4 consecutive photos, add filters, frames and stickers.",
    url: "https://kacakacabooth.com",
    siteName: "KacaKacaBooth",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XFXR1XMKSS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XFXR1XMKSS');
          `}
        </Script>
        <PhotoProvider>
          {children}
        </PhotoProvider>
      </body>
    </html>
  );
}
