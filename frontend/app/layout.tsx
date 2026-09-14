import type { Metadata } from "next";
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
  src: [
    { path: "../public/fonts/Nohemi-Thin.woff2", weight: "100" },
    { path: "../public/fonts/Nohemi-ExtraLight.woff2", weight: "200" },
    { path: "../public/fonts/Nohemi-Light.woff2", weight: "300" },
    { path: "../public/fonts/Nohemi-Regular.woff2", weight: "400" },
    { path: "../public/fonts/Nohemi-Medium.woff2", weight: "500" },
    { path: "../public/fonts/Nohemi-SemiBold.woff2", weight: "600" },
    { path: "../public/fonts/Nohemi-Bold.woff2", weight: "700" },
    { path: "../public/fonts/Nohemi-ExtraBold.woff2", weight: "800" },
    { path: "../public/fonts/Nohemi-Black.woff2", weight: "900" },
  ],
  variable: "--font-nohemi",
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

export const metadata: Metadata = {
  title: "Thumbstack - Turn More Traffic Into Customers",
  description: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences. Book a free strategy call today.",
  metadataBase: new URL("https://leadmagnet-live.vercel.app"),
  openGraph: {
    title: "Thumbstack - Turn More Traffic Into Customers",
    description: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences.",
    url: "https://leadmagnet-live.vercel.app",
    siteName: "Thumbstack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thumbstack - Turn More Traffic Into Customers",
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
      className={`${inter.variable} ${nohemi.variable} ${satoshi.variable} ${delight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-satoshi">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
