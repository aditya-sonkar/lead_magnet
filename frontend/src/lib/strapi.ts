/**
 * Strapi client, API fetching & fallback handling
 */

/** Base URL for Strapi CMS API */
const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://lead-magnet-7s2k.onrender.com";
export const STRAPI_URL = RAW_STRAPI_URL.replace(/\/+$/, "").replace("localhost", "127.0.0.1");

/** Cache revalidation time (60 seconds) */
export const REVALIDATE_TIME = 60;

/** Centralized SVG icon paths for social media platforms */
export const SOCIAL_ICONS: Record<string, string> = {
    Instagram: "/images/insta_logo.svg",
    YouTube: "/images/youtube_logo.svg",
    Facebook: "/images/facebook.svg",
    LinkedIn: "/images/linkedin-icon.svg",
};

/**
 * Normalizes media input (string, object, or array) into a fully qualified Cloudinary or Strapi URL.
 */
export function getMediaUrl(
    media?: any
): string {
    if (!media) return "";
    let rawUrl: string | undefined | null;

    if (typeof media === "string") {
        rawUrl = media;
    } else if (Array.isArray(media)) {
        const first = media[0];
        rawUrl =
            first?.url ||
            first?.data?.attributes?.url ||
            first?.data?.url ||
            first?.attributes?.url ||
            (typeof first === "string" ? first : null);
    } else if (typeof media === "object") {
        rawUrl =
            media?.url ||
            media?.data?.attributes?.url ||
            media?.data?.url ||
            media?.attributes?.url;
    }

    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return rawUrl;
    }
    return `${STRAPI_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
}

export function getMediaDimensions(media?: any): { width: number; height: number } | null {
    if (!media) return null;
    let obj: any;
    if (Array.isArray(media)) obj = media[0];
    else if (typeof media === "object") obj = media;

    const attrs = obj?.attributes || obj?.data?.attributes || obj?.data || obj;
    if (attrs?.width && attrs?.height) {
        return { width: attrs.width, height: attrs.height };
    }
    return null;
}

export function getMediaAlt(media?: any, fallback: string = ""): string {
    if (!media) return fallback;
    let obj: any;
    if (Array.isArray(media)) obj = media[0];
    else if (typeof media === "object") obj = media;

    const attrs = obj?.attributes || obj?.data?.attributes || obj?.data || obj;
    return attrs?.alternativeText || fallback;
}

export async function getLandingPage(slug: string = "shopify-lead-magnet") {
    // Next.js fetch with `next: { revalidate: 60 }` handles caching and deduplication natively.
    // In-memory cache in a long-running/serverless environment causes stale data issues.
    return fetchLandingPageInternal(slug);
}

async function fetchLandingPageInternal(slug: string = "shopify-lead-magnet") {
    try {
        // Deep populate query for all section components inside Dynamic Zone and stickyCTA
        const sectionsPopulate = [
            // SEO metadata
            "populate[seo][populate]=*",

            // Hero: primary CTA, client brands with logos, and quote form
            "populate[sections][on][sections.hero][populate][primaryCta][populate]=*",
            "populate[sections][on][sections.hero][populate][brands][populate]=*",
            "populate[sections][on][sections.hero][populate][quoteForm][populate]=*",

            // Storefront Problems: pain point items and multi-state summary
            "populate[sections][on][sections.storefront-problems][populate][items][populate]=*",
            "populate[sections][on][sections.storefront-problems][populate][summary][populate]=*",

            // Conversion Insights: insight cards with uploaded images
            "populate[sections][on][sections.conversion-insights][populate][cards][populate]=*",

            // Work Showcase: showcase items with all before/after/mobile media
            "populate[sections][on][sections.work-showcase][populate][items][populate]=*",

            // Engagement Fit: suitable and not-suitable points
            "populate[sections][on][sections.engagement-fit][populate][suitablePoints][populate]=*",
            "populate[sections][on][sections.engagement-fit][populate][notSuitablePoints][populate]=*",

            // Our Work: projects with desktop and mobile media
            "populate[sections][on][sections.our-work][populate][projects][populate]=*",

            // Final CTA: brand logos, primary CTA, and secondary CTA
            "populate[sections][on][sections.final-cta][populate][logos][populate]=*",
            "populate[sections][on][sections.final-cta][populate][primaryCta][populate]=*",
            "populate[sections][on][sections.final-cta][populate][secondaryCta][populate]=*",

            // Our Process: marquee items, process cards with icons & services, CTA, image, and video
            "populate[sections][on][sections.our-process][populate][marqueeItems][populate]=*",
            "populate[sections][on][sections.our-process][populate][cta][populate]=*",
            "populate[sections][on][sections.our-process][populate][image][populate]=*",
            "populate[sections][on][sections.our-process][populate][video][populate]=*",
            "populate[sections][on][sections.our-process][populate][cards][populate]=*",

            // FAQ: question and answer items
            "populate[sections][on][sections.faq][populate][items][populate]=*",

            // Sticky CTA: text, primary CTA, secondary CTA, and callback form
            "populate[stickyCTA][populate]=*",
        ].join("&");

        // 1. Try fetching from the Collection Type: /api/pages
        let pageJson: any = null;

        // Attempt 1A: by target slug with deep population
        const slugRes = await fetch(
            `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&${sectionsPopulate}`,
            { next: { revalidate: REVALIDATE_TIME } }
        ).catch(() => null);

        if (slugRes && slugRes.ok) {
            pageJson = await slugRes.json().catch(() => null);
        }

        // Attempt 1B: try alternate slug "lead-magnet" if "shopify-lead-magnet" was empty or vice-versa
        if (!pageJson?.data || (Array.isArray(pageJson.data) && pageJson.data.length === 0)) {
            const altSlug = slug === "shopify-lead-magnet" ? "lead-magnet" : "shopify-lead-magnet";
            const altRes = await fetch(
                `${STRAPI_URL}/api/pages?filters[slug][$eq]=${altSlug}&${sectionsPopulate}`,
                { next: { revalidate: REVALIDATE_TIME } }
            ).catch(() => null);

            if (altRes && altRes.ok) {
                pageJson = await altRes.json().catch(() => null);
            }
        }

        // Attempt 1C: fetch first page with sectionsPopulate
        if (!pageJson?.data || (Array.isArray(pageJson.data) && pageJson.data.length === 0)) {
            const allPagesRes = await fetch(
                `${STRAPI_URL}/api/pages?${sectionsPopulate}`,
                { next: { revalidate: REVALIDATE_TIME } }
            ).catch(() => null);

            if (allPagesRes && allPagesRes.ok) {
                pageJson = await allPagesRes.json().catch(() => null);
            }
        }

        // Attempt 1D: fallback with deep component population
        if (!pageJson?.data || (Array.isArray(pageJson.data) && pageJson.data.length === 0)) {
            const simpleRes = await fetch(
                `${STRAPI_URL}/api/pages?populate[sections][populate]=*&populate[stickyCTA][populate]=*`,
                { next: { revalidate: REVALIDATE_TIME } }
            ).catch(() => null);

            if (simpleRes && simpleRes.ok) {
                pageJson = await simpleRes.json().catch(() => null);
            }
        }

        // Normalize pageData from Strapi response (Strapi 4 attributes vs Strapi 5 flat)
        let pageData: any = null;
        if (pageJson?.data) {
            const rawItem = Array.isArray(pageJson.data) ? pageJson.data[0] : pageJson.data;
            if (rawItem) {
                pageData = rawItem.attributes ? { id: rawItem.id, ...rawItem.attributes } : rawItem;
            }
        }

        // 2. Fetch Header, Footer, and Forms in parallel
        const [headerData, footerData, formsData] = await Promise.all([
            getHeader(),
            getFooter(),
            getForms(),
        ]);

        // If Collection Type (/api/pages) has data, return it
        if (pageData) {
            const rawStickyCTA = pageData.stickyCTA || pageData.sticky_cta || pageData.StickyCTA;
            const unwrappedStickyCTA = rawStickyCTA?.attributes ? { id: rawStickyCTA.id, ...rawStickyCTA.attributes } : rawStickyCTA;


            // Inject global forms into hero and stickyCTA
            if (formsData && formsData.length > 0) {
                const globalQuoteEntry = formsData.find((f: any) => f.formType === "quote");
                const globalCallbackEntry = formsData.find((f: any) => f.formType === "callback");

                const globalQuoteForm = globalQuoteEntry?.formConfig?.[0] || globalQuoteEntry?.quoteForm;
                const globalCallbackForm = globalCallbackEntry?.formConfig?.[0] || globalCallbackEntry?.callbackForm;

                if (globalQuoteForm) {
                    if (pageData.hero) {
                        pageData.hero.quoteForm = globalQuoteForm;
                    }
                    if (pageData.sections && Array.isArray(pageData.sections)) {
                        const dynamicHero = pageData.sections.find((s: any) => 
                            s?.__component === "sections.hero" || s?.__component === "hero" || s?.__component === "Hero"
                        );
                        if (dynamicHero) {
                            dynamicHero.quoteForm = globalQuoteForm;
                        }
                    }
                }

                if (globalCallbackForm) {
                    if (unwrappedStickyCTA) {
                        unwrappedStickyCTA.callbackForm = globalCallbackForm;
                    }
                    pageData.callbackForm = globalCallbackForm;
                    
                    if (pageData.sections && Array.isArray(pageData.sections)) {
                        const dynamicCallback = pageData.sections.find((s: any) => 
                            s?.__component?.toLowerCase().includes("callback")
                        );
                        if (dynamicCallback) {
                            dynamicCallback.callbackForm = globalCallbackForm;
                        }
                    }
                }
            }

            const result = {
                ...pageData,
                header: headerData || pageData.header,
                footer: footerData || pageData.footer,
                stickyCTA: unwrappedStickyCTA,
            };
            return result;
        }

        console.warn("[Strapi Fetch] No published page found in /api/pages");
        return null;
    } catch (err: unknown) {
        if (err && typeof err === "object" && "digest" in err && (err as { digest: string }).digest === "DYNAMIC_SERVER_USAGE") {
            throw err;
        }
        console.error("Error fetching landing page:", err);
        return null;
    }
}

/**
 * Fetches Header Single Type from Strapi (/api/header)
 */
export async function getHeader(): Promise<any> {

    const urls = [
        `${STRAPI_URL}/api/header?populate=*`,
        `${STRAPI_URL}/api/header?populate[Header][populate][quickLinks][populate]=*`,
        `${STRAPI_URL}/api/header?populate[Header][populate]=*`,
        `${STRAPI_URL}/api/header`,
    ];

    for (const url of urls) {
        try {
            const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
            if (res.ok) {
                const json = await res.json().catch(() => null);
                const d = json?.data;
                if (!d) continue;
                const raw = Array.isArray(d) ? d[0] : d;
                if (!raw) continue;
                const unwrapped = raw?.attributes ? { id: raw.id, ...raw.attributes } : raw;
                const headerObj = unwrapped?.Header?.attributes || unwrapped?.Header || unwrapped?.header || unwrapped;
                if (headerObj && typeof headerObj === "object") {
                    cachedHeader = headerObj;
                    return headerObj;
                }
            }
        } catch {
            // try next
        }
    }
    return null;
}

/**
 * Fetches Footer Single Type from Strapi (/api/footer) with full nested population
 */
export async function getFooter(): Promise<any> {

    const deepNested = [
        "populate[footer][populate][logo][populate]=*",
        "populate[footer][populate][quickLinks][populate]=*",
        "populate[footer][populate][socialLinks][populate]=*",
        "populate[footer][populate][contacts][populate]=*",
        "populate[footer][populate][privacyLink][populate]=*",
        "populate[footer][populate][termsLink][populate]=*",
        "populate[footer][populate][Newsletter][populate]=*",
        "populate[footer][populate][newsletter][populate]=*",
    ].join("&");

    const urls = [
        `${STRAPI_URL}/api/footer?${deepNested}`,
        `${STRAPI_URL}/api/footer?populate[footer][populate]=*`,
        `${STRAPI_URL}/api/footer?populate[Footer][populate]=*`,
        `${STRAPI_URL}/api/footer?populate=*`,
        `${STRAPI_URL}/api/footer?${deepNested}&status=draft`,
        `${STRAPI_URL}/api/footer?populate[footer][populate]=*&status=draft`,
        `${STRAPI_URL}/api/footer?populate=*&status=draft`,
        `${STRAPI_URL}/api/footer`,
    ];

    for (const url of urls) {
        try {
            const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
            if (res.ok) {
                const json = await res.json().catch(() => null);
                const d = json?.data;
                if (!d) continue;
                const raw = Array.isArray(d) ? d[0] : d;
                if (!raw) continue;
                const unwrapped = raw?.attributes ? { id: raw.id, ...raw.attributes } : raw;
                const footerObj = unwrapped?.footer?.attributes || unwrapped?.footer || unwrapped?.Footer || unwrapped;
                if (footerObj && typeof footerObj === "object") {
                    return footerObj;
                }
            }
        } catch {
            // try next
        }
    }
    return null;
}


/**
 * Fetches Forms Collection Type from Strapi (/api/forms) to populate Quote and Callback forms
 */
export async function getForms(): Promise<any[]> {

    try {
        const query = 'populate[formConfig][populate]=*';
        const res = await fetch(`${STRAPI_URL}/api/forms?${query}`, { next: { revalidate: REVALIDATE_TIME } });
        if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json?.data) {
                const forms = json.data.map((item: any) => {
                    const attrs = item.attributes || item;
                    return { id: item.id, ...attrs };
                });
                return forms;
            }
        }
    } catch {
        // ignore
    }
    return [];
}