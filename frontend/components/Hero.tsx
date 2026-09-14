"use client";

import QuoteForm, { QuoteFormData } from "./QuoteForm";
import { getMediaUrl } from "@/lib/strapi";

type Brand = {
    id: number;
    name: string;
    logo: {
        url: string;
    };
};

type HeroData = {
    heading: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    brandsHeading?: string;
    brands: Brand[];
    quoteForm?: QuoteFormData | QuoteFormData[];
};

export default function Hero({ data }: { data: HeroData }) {
    if (!data) return null;
    const form = Array.isArray(data.quoteForm) ? data.quoteForm[0] : data.quoteForm;

    const brandItems = data?.brands && data.brands.length > 0 ? data.brands : [];
    const trackBrands = brandItems.length > 0 && brandItems.length < 10
        ? [...brandItems, ...brandItems]
        : brandItems;

    const getBrandSize = (brand: Brand) => {
        const name = ((brand.name || "") + (brand.logo?.url || "")).toLowerCase();
        if (name.includes("figo")) return "h-[24px] sm:h-8 lg:h-9";
        if (name.includes("westside")) return "h-[21px] sm:h-[30px] lg:h-[34px]";
        if (name.includes("stiff")) return "h-[21px] sm:h-[30px] lg:h-[34px]";
        if (name.includes("paloma")) return "h-[19px] sm:h-7 lg:h-7.5";
        return "h-[20px] sm:h-7 lg:h-7.5";
    };

    const formatHeading = (text: string) => {
        if (!text) return null;

        if (text.includes("\n")) {
            const lines = text.split("\n").filter((l) => l.trim().length > 0);
            return lines.map((line, idx) => (
                <span
                    key={idx}
                    className={`block whitespace-normal 2xl:whitespace-nowrap ${idx < lines.length - 1 ? "mb-2 sm:mb-2.5 xl:mb-[2px] 2xl:mb-[3px]" : ""}`}
                >
                    {line}
                </span>
            ));
        }

        const words = text.trim().split(/\s+/);
        if (words.length <= 4) {
            return <span className="block whitespace-normal 2xl:whitespace-nowrap">{text}</span>;
        }

        const mid = Math.ceil(words.length / 2);
        return (
            <>
                <span className="block whitespace-normal 2xl:whitespace-nowrap mb-2 sm:mb-2.5 xl:mb-[2px] 2xl:mb-[3px]">
                    {words.slice(0, mid).join(" ")}
                </span>
                <span className="block whitespace-normal 2xl:whitespace-nowrap">
                    {words.slice(mid).join(" ")}
                </span>
            </>
        );
    };

    const formatDescription = (desc: string) => {
        if (!desc) return null;
        const text = desc.trim();
        if (text.includes("\n")) {
            const lines = text.split(/\r?\n/).filter(Boolean);
            return (
                <>
                    {lines.map((line, idx) => (
                        <span key={idx} className={`block ${idx > 0 ? "mt-0.5 sm:mt-1" : ""} xl:whitespace-nowrap`}>
                            {line}
                        </span>
                    ))}
                </>
            );
        }
        const match = text.match(/^(.+?\.)\s+(.+)$/);
        if (match) {
            return (
                <>
                    <span className="block xl:whitespace-nowrap">{match[1]}</span>
                    <span className="block xl:whitespace-nowrap mt-0.5 sm:mt-1">{match[2]}</span>
                </>
            );
        }
        return <span className="block">{text}</span>;
    };

    return (
        <section data-theme="dark" className="relative min-h-0 xl:min-h-screen bg-[#37386B] text-white flex flex-col font-sans overflow-x-hidden border-none outline-none">
            <div className="flex-grow flex items-start xl:items-center pt-[128px] sm:pt-[136px] xl:pt-[112px] 2xl:pt-[124px] pb-0 xl:pb-14 2xl:pb-16 px-5 sm:px-6 lg:px-[40px] xl:px-[48px] 2xl:px-[80px]">
                <div className="max-w-[1720px] mx-auto w-full grid grid-cols-1 xl:grid-cols-[1fr_495px] 2xl:grid-cols-[1fr_600px] gap-8 xl:gap-8 2xl:gap-16 items-start">

                    {/* Left Column: Hero copy and client brands */}
                    <div className="max-w-full flex flex-col justify-between self-stretch min-w-0">
                        <div>
                            <h1 className="font-nohemi font-normal text-white text-[clamp(32px,8.8vw,46px)] xl:text-[clamp(36px,4.2vw,65px)] 2xl:text-[clamp(44px,4.2vw,80px)] tracking-[-0.01em] mb-4 sm:mb-5 leading-[1.38] sm:leading-[1.32] xl:leading-[1.15] 2xl:leading-[82px] max-w-[620px] xl:max-w-none">
                                {formatHeading(data.heading)}
                            </h1>

                            <p className="font-satoshi font-light lg:font-normal text-white text-[12.2px] min-[390px]:text-[12.5px] sm:text-[14px] lg:text-[15.5px] xl:text-[16px] mb-4 sm:mb-5 lg:mb-6 max-w-[625px] xl:max-w-none leading-[1.75] sm:leading-[1.78] lg:leading-[1.65] tracking-normal">
                                {formatDescription(data.description)}
                            </p>

                            <a
                                href={data.primaryCta?.href || "#call"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const h = (data.primaryCta?.href || "").toLowerCase();
                                    const l = (data.primaryCta?.label || "").toLowerCase();
                                    if (h === "#quote" || (h.includes("quote") && !l.includes("call"))) {
                                        window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                    } else {
                                        window.dispatchEvent(new CustomEvent("open-callback-modal"));
                                    }
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black px-4 sm:px-6 py-2 sm:py-3.5 rounded-full font-satoshi font-medium text-[14.5px] sm:text-[18.5px] hover:bg-gray-100 transition-all duration-300 ease-out gap-2 sm:gap-2.5 shadow-sm hover:shadow-md cursor-pointer"
                            >
                                {data.primaryCta?.label || "Book a Free Call"}
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Client logo marquee */}
                        <div className="mt-16 sm:mt-20 lg:mt-26 xl:mt-auto pt-3 sm:pt-6 translate-y-3.5 sm:translate-y-4 xl:translate-y-0">
                            {data.brandsHeading && (
                                <p className="font-satoshi font-light text-white sm:text-white/88 text-[clamp(12px,3.3vw,15.5px)] sm:text-[17.5px] lg:text-[19px] mb-3 lg:mb-4 w-full text-center xl:text-left leading-snug tracking-[-0.2px] px-2 sm:px-0">
                                    {data.brandsHeading}
                                </p>
                            )}
                            {brandItems.length > 0 && (
                                <div
                                    className="w-full max-w-[963px] mx-auto xl:mx-0 overflow-hidden select-none"
                                    style={{
                                        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
                                    }}
                                >
                                    <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
                                        <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-12 pr-6 sm:pr-8 lg:pr-12">
                                            {trackBrands.map((brand, idx) => (
                                                <div key={`brand-track1-${idx}`} className="flex items-center justify-center h-9 sm:h-11 shrink-0">
                                                    <img
                                                        src={getMediaUrl(brand.logo)}
                                                        alt={brand.name || "Brand logo"}
                                                        className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-100`}
                                                        style={{ filter: 'brightness(0) invert(1)' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-6 sm:gap-8 lg:gap-12 pr-6 sm:pr-8 lg:pr-12" aria-hidden="true">
                                            {trackBrands.map((brand, idx) => (
                                                <div key={`brand-track2-${idx}`} className="flex items-center justify-center h-9 sm:h-11 shrink-0">
                                                    <img
                                                        src={getMediaUrl(brand.logo)}
                                                        alt={brand.name || "Brand logo"}
                                                        className={`${getBrandSize(brand)} w-auto object-contain transition-all duration-300 opacity-100`}
                                                        style={{ filter: 'brightness(0) invert(1)' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Shopify Quote Estimator */}
                    <div id="quote" data-quote-form="true" data-theme="light" className="-mx-5 sm:-mx-6 lg:-mx-[40px] xl:mx-0 w-[calc(100%+40px)] sm:w-[calc(100%+48px)] lg:w-[calc(100%+80px)] xl:w-full bg-[#F6F6F6] text-black px-5 sm:px-6 lg:px-[40px] xl:px-6 2xl:px-8 pt-9 sm:pt-8 lg:pt-8 xl:pt-7 2xl:pt-7.5 pb-6 sm:pb-6 xl:pb-7 2xl:pb-8 shadow-none xl:shadow-2xl relative mt-6 sm:mt-9 xl:mt-0 xl:translate-x-3 2xl:translate-x-4 rounded-t-[22px] sm:rounded-t-[20px] rounded-b-none xl:rounded-none transition-all duration-300 scroll-mt-24 border-none">
                        <QuoteForm form={form} variant="hero" />
                    </div>
                </div>
            </div>
        </section>
    );
}