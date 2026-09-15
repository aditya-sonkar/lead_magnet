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
  preload: false,
});

const nohemi = localFont({
  src: [
    { path: "../../public/fonts/nohemi/Nohemi-Thin.woff2", weight: "100" },
    { path: "../../public/fonts/nohemi/Nohemi-ExtraLight.woff2", weight: "200" },
    { path: "../../public/fonts/nohemi/Nohemi-Light.woff2", weight: "300" },
    { path: "../../public/fonts/nohemi/Nohemi-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/nohemi/Nohemi-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/nohemi/Nohemi-SemiBold.woff2", weight: "600" },
    { path: "../../public/fonts/nohemi/Nohemi-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/nohemi/Nohemi-ExtraBold.woff2", weight: "800" },
    { path: "../../public/fonts/nohemi/Nohemi-Black.woff2", weight: "900" },
  ],
  variable: "--font-nohemi",
  display: "swap",
  preload: false,
});

const satoshi = localFont({
  src: "../../public/fonts/satoshi/SatoshiVariable.ttf",
  variable: "--font-satoshi",
  weight: "100 900",
  display: "swap",
  preload: false,
});

const delight = localFont({
  src: "../../public/fonts/delight/DelightVariable.ttf",
  variable: "--font-delight",
  weight: "100 900",
  display: "swap",
  preload: false,
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
