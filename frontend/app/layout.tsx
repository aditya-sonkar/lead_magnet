import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = localFont({
  src: "../public/fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const nohemi = localFont({
  src: "../public/fonts/Nohemi-VF.ttf",
  variable: "--font-nohemi",
  weight: "100 900",
  display: "swap",
});

const satoshi = localFont({
  src: "../public/fonts/SatoshiVariable.ttf",
  variable: "--font-satoshi",
  weight: "100 900",
  display: "swap",
});

const delight = localFont({
  src: "../public/fonts/DelightVariable.ttf",
  variable: "--font-delight",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#37386B",
};

export const metadata: Metadata = {
  title: "Thumbstack - Lead Magnet",
  description: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences. Book a free strategy call today.",
  metadataBase: new URL("https://leadmagnet-live.vercel.app"),
  openGraph: {
    title: "Thumbstack - Lead Magnet",
    description: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences.",
    url: "https://leadmagnet-live.vercel.app",
    siteName: "Thumbstack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thumbstack - Lead Magnet",
    description: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nohemi.variable} ${satoshi.variable} ${delight.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-satoshi">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
