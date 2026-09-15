import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { siteConfig } from "@/config/site";

const inter = localFont({
  src: "../../public/fonts/inter/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const nohemi = localFont({
  src: "../../public/fonts/nohemi/Nohemi-VF.ttf",
  variable: "--font-nohemi",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: "../../public/fonts/satoshi/SatoshiVariable.ttf",
  variable: "--font-satoshi",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const delight = localFont({
  src: "../../public/fonts/delight/DelightVariable.ttf",
  variable: "--font-delight",
  weight: "100 900",
  display: "swap",
  preload: true,
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#37386B",
};

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${nohemi.variable} ${satoshi.variable} ${delight.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-satoshi">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
