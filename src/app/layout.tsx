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
  title: "Free PhotoBooth | Free Online Photo Strip Creator",
  description: "Turn your home into a free photobooth with exclusive templates, trendy filters, and fun stickers—beautiful results every time",
  keywords: ["photobooth", "free photobooth", "online photobooth", "照相亭", "在线照相亭", "免费照相亭"],
  authors: [{ name: "Free PhotoBooth Team" }],
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: "Free PhotoBooth | Free Online Photo Strip Creator",
    description: "Turn your home into a free photobooth with exclusive templates, trendy filters, and fun stickers—beautiful results every time",
    url: "https://freephotobooth.app",
    siteName: "Free PhotoBooth",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: '/icon.jpg',
        width: 400,
        height: 400,
        alt: 'Free PhotoBooth Logo',
      }
    ],
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
