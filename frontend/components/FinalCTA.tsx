"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/lib/strapi";

type FinalCtaLogo = {
    id: number;
    logo: {
        url: string;
    };
};

type FinalCtaData = {
    badge: string;
    heading: string;
    mobileHeading?: string;
    MobileHeading?: string;
    description: string;
    logos: FinalCtaLogo[];
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
};

export default function FinalCTA({
    data,
}: {
    data: FinalCtaData;
}) {
    if (!data) return null;
    const validLogos = (data.logos || []).filter((l) => Boolean(getMediaUrl(l?.logo)));
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (validLogos.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validLogos.length);
        }, 2200);

        return () => clearInterval(interval);
    }, [validLogos.length]);

    const currentLogo = validLogos[currentIndex];

    const parseHeading = (text: string) => {
        if (!text) return null;
        const parts = text.split(/\blike\b/i);
        if (parts.length >= 2) {
            const beforeLike = parts[0].trim();
            const afterLike = parts[1].trim();
            const words = afterLike.split(/\s+/);
            const firstWordAfter = words[0] || "";
            const rest = words.slice(1).join(" ");
            return {
                line1Before: beforeLike,
                likeWord: "like",
                line1After: firstWordAfter,
                line2: rest,
            };
        }
        return null;
    };

    const desktopHeadingParts = parseHeading(data?.heading || "");
    const activeMobileHeading = (data?.mobileHeading || data?.MobileHeading || "").trim();
    const mobileHeadingText = activeMobileHeading || data?.heading || "";
    const mobileHeadingParts = parseHeading(mobileHeadingText);

    const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
        const h = (href || "").toLowerCase();
        const l = (label || "").toLowerCase();
        if (h === "#quote" || h.includes("quote") || l.includes("quote")) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-quote-modal"));
        } else if (h === "#contact" || h === "#call" || h.includes("call") || l.includes("call") || l.includes("callback")) {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("open-callback-modal"));
        }
    };

    return (
        <>
        <section className="w-full px-4 sm:px-8 py-20 sm:py-28 lg:py-32 bg-[#F9FEFD]">
            <div className="w-full mx-auto max-w-[1180px]">
                {/* 1. DESKTOP / TABLET VIEW (Centered, badge, side-by-side buttons, scaling with 4.2vw text clamp) */}
                <div className="hidden sm:flex flex-col items-center text-center">
                    {data.badge && (
                        <span className="inline-block font-satoshi font-medium border-2 border-[#95E7D3] bg-[#D1F4EC] rounded-[12px] px-4 py-1.5 text-black text-[clamp(13px,1vw,15px)] mb-5">
                            {data.badge}
                        </span>
                    )}

                    <h2 className="font-nohemi font-normal font-[400] text-[clamp(36px,4.2vw,65px)] leading-[1.15] tracking-[-0.025em] text-[#000000]">
                        {desktopHeadingParts ? (
                            <>
                                <span>
                                    {desktopHeadingParts.line1Before}{" "}
                                </span>
                                <span className="inline-flex items-center whitespace-nowrap">
                                    <span>{desktopHeadingParts.likeWord}</span>
                                    <span className="mx-2.5 lg:mx-3.5 inline-flex h-[clamp(36px,4.2vw,65px)] w-[clamp(36px,4.2vw,65px)] align-middle -mt-1 lg:-mt-1.5 rounded-[10px] lg:rounded-[12px] border border-[#00000030] bg-white relative overflow-hidden select-none shrink-0 shadow-xs">
                                        <AnimatePresence mode="wait">
                                            {currentLogo?.logo && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={getMediaUrl(currentLogo.logo)}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1.5 lg:p-2"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                    <span>{desktopHeadingParts.line1After}</span>
                                </span>
                                {desktopHeadingParts.line2 && (
                                    <span className="block whitespace-nowrap mt-1 lg:mt-1.5">
                                        {desktopHeadingParts.line2}
                                    </span>
                                )}
                            </>
                        ) : (
                            data.heading
                        )}
                    </h2>

                    <p className="font-inter font-medium text-[clamp(14.5px,1.15vw,16px)] text-black w-full max-w-[630px] mt-4 leading-[1.5] text-center mx-auto">
                        {data.description}
                    </p>

                    <div className="mx-auto mt-7 flex flex-row items-center justify-center gap-3.5">
                        <a
                            href={data.primaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.primaryCta.href, data.primaryCta.label)}
                            className="w-auto min-w-[210px] lg:min-w-[245px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 lg:px-11 py-4 font-satoshi text-[clamp(16px,1.25vw,18px)] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] bg-black text-white hover:opacity-85"
                        >
                            {data.primaryCta.label}
                            <span className="ml-2 text-[19px]">→</span>
                        </a>

                        <a
                            href={data.secondaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.secondaryCta.href, data.secondaryCta.label)}
                            className="w-auto min-w-[210px] lg:min-w-[245px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 lg:px-11 py-4 font-satoshi text-[clamp(16px,1.25vw,18px)] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] border border-black/80 bg-transparent text-black hover:bg-black/5 hover:border-black"
                        >
                            {data.secondaryCta.label}
                            <span className="ml-2 text-[19px]">→</span>
                        </a>
                    </div>
                </div>

                {/* 2. SMALL SCREEN / MOBILE VIEW (Left-aligned, 3 lines stretching close to the right corner) */}
                <div className="flex sm:hidden flex-col items-start text-left w-full max-w-full">
                    <h2 className="w-full font-nohemi font-normal font-[400] text-[clamp(36px,10.5vw,56px)] leading-[1.1] tracking-[-0.03em] text-[#000000]">
                        {mobileHeadingParts ? (
                            <>
                                <span className="block whitespace-nowrap">
                                    {mobileHeadingParts.line1Before}
                                </span>
                                <span className="inline-flex items-center whitespace-nowrap mt-1">
                                    <span>{mobileHeadingParts.likeWord}</span>
                                    <span className="mx-2 inline-flex h-[clamp(48px,12.8vw,62px)] w-[clamp(48px,12.8vw,62px)] align-middle -mt-1.5 rounded-[8px] border-2 border-[#00000025] bg-white relative overflow-hidden select-none shrink-0 shadow-xs">
                                        <AnimatePresence mode="wait">
                                            {currentLogo?.logo && (
                                                <motion.img
                                                    key={currentLogo.id || currentIndex}
                                                    src={getMediaUrl(currentLogo.logo)}
                                                    alt=""
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                                    className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-1.5"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </span>
                                    <span>{mobileHeadingParts.line1After}</span>
                                </span>
                                {mobileHeadingParts.line2 && (
                                    <span className="block whitespace-nowrap mt-1">
                                        {mobileHeadingParts.line2}
                                    </span>
                                )}
                            </>
                        ) : (
                            mobileHeadingText || data.heading
                        )}
                    </h2>

                    <p className="font-inter font-normal text-[clamp(13px,3.5vw,14.2px)] text-[#1A1A1A] w-full mt-7 sm:mt-8 leading-[1.52] text-left">
                        {data.description}
                    </p>

                    <div className="w-full mt-3 flex flex-col items-stretch justify-start gap-3">
                        <a
                            href={data.primaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.primaryCta.href, data.primaryCta.label)}
                            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 font-satoshi text-[clamp(15.5px,1.15vw,17px)] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] bg-black text-white hover:opacity-85"
                        >
                            {data.primaryCta.label}
                            <span className="ml-2 text-[18px]">→</span>
                        </a>

                        <a
                            href={data.secondaryCta.href}
                            onClick={(e) => handleCtaClick(e, data.secondaryCta.href, data.secondaryCta.label)}
                            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 font-satoshi text-[clamp(15.5px,1.15vw,17px)] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] border border-[#D0D5DD] bg-white text-black hover:bg-black/5"
                        >
                            {data.secondaryCta.label}
                            <span className="ml-2 text-[18px]">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        {/* Symmetrical bottom white space matching the space above Final CTA (OurWork pb-10 sm:pb-20) */}
        <div className="w-full h-10 sm:h-20 bg-white" />
        </>
    );
}