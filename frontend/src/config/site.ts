/**
 * Site-wide configuration & static constants
 */
export const siteConfig = {
    name: "Thumbstack",
    title: "TSP Lead Magnet | High-Converting Shopify Stores & Mobile Apps | Thumbstack",
    description:
        "TSP Lead Magnet by Thumbstack — design-first technology studio building high-converting Shopify stores, mobile apps, and custom digital experiences. Book your free strategy call today.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://leadmagnet-live.vercel.app",
    ogImage: "/images/og-image.jpg",
    links: {
        twitter: "https://twitter.com/thumbstack",
        instagram: "https://instagram.com/thumbstack",
        linkedin: "https://linkedin.com/company/thumbstack",
    },
    contact: {
        email: "hello@thumbstack.com",
    },
    navigation: [
        { label: "Problems", href: "#storefront-problems" },
        { label: "Our Work", href: "#our-work" },
        { label: "Process", href: "#our-process" },
        { label: "FAQ", href: "#faq" },
    ],
};

export type SiteConfig = typeof siteConfig;
