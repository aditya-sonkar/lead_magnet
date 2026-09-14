"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/strapi";

type MarqueeItem = {
    id: number;
    text: string;
};

type ProcessService = {
    id: number;
    text: string;
};

type ProcessCard = {
    id: number;
    icon?: any;
    title: string;
    description: string;
    services: ProcessService[];
    cta?: {
        label: string;
        href: string;
    };
};

type MobileService = {
    id: number;
    title: string;
    description: string;
    icon?: any;
};

type CtaLink = {
    id?: number;
    label: string;
    href: string;
};

type OurProcessData = {
    marqueeItems: MarqueeItem[];
    eyebrow: string;
    heading: string;
    description: string;
    mobileEyebrow?: string;
    mobileHeading?: string;
    mobileDescription?: string;
    cta?: CtaLink;
    image?: {
        url: string;
    };
    cards: ProcessCard[];
    video?: {
        url: string;
    };
    service?: MobileService[];
    mobilePrimaryCta?: CtaLink;
    mobileSecondaryCta?: CtaLink;
};

export default function OurProcess({
    data,
}: {
    data: OurProcessData;
}) {
    if (!data) return null;
    const items = data?.marqueeItems || [];

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [repeatCount, setRepeatCount] = useState(1);
    const [scrollDistance, setScrollDistance] = useState(0);

    useEffect(() => {
        const updateDistance = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const contentWidth = contentRef.current.scrollWidth;

                // If viewport is ultra-wide (e.g. 4029px / 4K) and wider than single-track content,
                // dynamically repeat the items so it fills the screen and has room to scroll
                const singleTrackWidth = contentWidth / repeatCount;
                if (singleTrackWidth > 0 && containerWidth >= contentWidth - 40) {
                    const needed = Math.max(2, Math.ceil((containerWidth * 1.35) / singleTrackWidth));
                    if (needed !== repeatCount) {
                        setRepeatCount(needed);
                        return;
                    }
                } else if (singleTrackWidth > 0 && repeatCount > 1 && containerWidth < singleTrackWidth) {
                    setRepeatCount(1);
                    return;
                }

                const distance = contentWidth - containerWidth;
                setScrollDistance(distance > 0 ? distance : 0);
            }
        };

        updateDistance();
        const resizeObserver = new ResizeObserver(updateDistance);
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        if (contentRef.current) resizeObserver.observe(contentRef.current);

        window.addEventListener("resize", updateDistance);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateDistance);
        };
    }, [items, repeatCount]);

    const displayItems = Array.from({ length: repeatCount }, () => items).flat();

    const rawCtaLabel = data.cta?.label || "";
    const cleanCtaLabel = rawCtaLabel.replace(/[↗→]/g, "").replace(/->/g, "").trim();

    // Faster, responsive speed (~85px/s) with a crisp ~1s pause at each corner
    const travelTime = scrollDistance > 0 ? Math.max(5, Math.round(scrollDistance / 85)) : 6;
    const totalDuration = Math.round(travelTime / 0.45);

    return (
        <section data-theme="dark" className="w-full overflow-hidden">
            {/* Top Marquee Banner */}
            <div
                ref={containerRef}
                className="w-full overflow-hidden bg-[#4A71A5] py-2.5 sm:py-3 lg:py-3.5 select-none"
            >
                {scrollDistance > 0 && (
                    <style>{`
                        @keyframes ourProcessMarqueePingPong {
                            0%, 2.5% {
                                transform: translate3d(0, 0, 0);
                            }
                            47.5%, 52.5% {
                                transform: translate3d(-${scrollDistance}px, 0, 0);
                            }
                            97.5%, 100% {
                                transform: translate3d(0, 0, 0);
                            }
                        }
                    `}</style>
                )}
                <div
                    ref={contentRef}
                    className="flex w-max shrink-0 items-center px-4 lg:px-6 will-change-transform"
                    style={{
                        animation:
                            scrollDistance > 0
                                ? `ourProcessMarqueePingPong ${totalDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`
                                : "none",
                    }}
                >
                    {displayItems.map((item, index) => (
                        <div key={`marquee-${item.id || index}-${index}`} className="flex shrink-0 items-center">
                            {/* Mobile / Tablet */}
                            <div className="flex lg:hidden items-center">
                                <span className="text-white text-[clamp(11.5px,0.95vw,13px)] font-satoshi font-normal font-[400] uppercase tracking-[0.04em] whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="inline-block h-[7px] w-[7px] sm:h-[7.5px] sm:w-[7.5px] rounded-full bg-white shrink-0 mx-3 sm:mx-4" />
                            </div>

                            {/* Desktop */}
                            <div className="hidden lg:flex items-center">
                                <span className="text-white text-[clamp(16px,1.2vw,18.5px)] font-nohemi font-normal font-[400] whitespace-nowrap">
                                    {item.text}
                                </span>
                                <span className="inline-block h-[9px] w-[9px] xl:h-[10px] xl:w-[10px] rounded-full bg-white shrink-0 mx-4.5 xl:mx-5.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full bg-[#0F1D07] px-6 py-12 sm:px-8 lg:px-16 lg:py-24 text-white">
                <div className="mx-auto max-w-[1180px] w-full">
                    {/* Header */}
                    <div className="mb-8 sm:mb-10 lg:mb-14">
                        <span className="font-satoshi text-[clamp(13px,1vw,15px)] text-white/70 block">
                            {data.eyebrow}
                        </span>

                        {/* Heading & Desktop CTA */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2.5 sm:mt-3 md:mt-5">
                            <h2 className="font-delight text-[clamp(26px,4.2vw,38px)] font-medium md:max-w-[500px] leading-[1.15] text-white">
                                {data.heading}
                            </h2>

                            {data.cta && (
                                <a
                                    href={data.cta.href || "#"}
                                    className="hidden md:inline-flex shrink-0 rounded-xl font-bold bg-white px-6 py-2.5 font-satoshi text-[clamp(13.5px,1vw,14.5px)] text-[#0F1D07] shadow-sm hover:bg-white/90 transition -translate-y-2 items-center justify-center"
                                >
                                    <span>{cleanCtaLabel}</span>
                                </a>
                            )}
                        </div>

                        <p className="font-satoshi text-white/90 text-[clamp(13.5px,1.05vw,15px)] max-w-[750px] mt-3 sm:mt-4 leading-relaxed">
                            {data.description}
                        </p>

                        {/* Mobile CTA: shown below description on small screens */}
                        {data.cta && (
                            <div className="mt-5 sm:mt-6 md:hidden">
                                <a
                                    href={data.cta.href || "#"}
                                    className="inline-flex rounded-[14px] font-medium bg-white px-5 sm:px-6 py-2.5 sm:py-3 font-satoshi text-[clamp(13.5px,1vw,14.5px)] text-[#0F1D07] shadow-sm hover:bg-white/90 transition items-center justify-center"
                                >
                                    <span>{cleanCtaLabel}</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Responsive Grid: 2 columns on mobile/tablet, 4 columns on desktop */}
                    <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr gap-4 sm:gap-5 lg:gap-[clamp(20px,1.6vw,32px)]">
                        {/* 1. Image Diagram Card */}
                        <div className="col-span-2 order-1 lg:order-none lg:col-start-1 lg:col-span-2 lg:row-start-1 w-full h-full aspect-[2896/1614] overflow-hidden rounded-[10px] bg-white flex items-center justify-center p-2 sm:p-2.5 md:p-3 lg:p-3.5">
                            {getMediaUrl(data.image) && (
                                <div className="h-full w-full flex items-center justify-center">
                                    <img
                                        src={getMediaUrl(data.image)}
                                        alt={data.heading || "Our Process"}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 2. Strategise Card */}
                        {data.cards?.[0] && (
                            <ProcessCard
                                card={data.cards[0]}
                                className="col-span-1 order-2 lg:order-none lg:col-start-3 lg:col-span-1 lg:row-start-1"
                            />
                        )}

                        {/* 3. Design Card */}
                        {data.cards?.[1] && (
                            <ProcessCard
                                card={data.cards[1]}
                                className="col-span-1 order-3 lg:order-none lg:col-start-4 lg:col-span-1 lg:row-start-1"
                            />
                        )}

                        {/* 4. Video Showcase Card */}
                        <div className="order-4 col-span-2 lg:order-none lg:col-start-2 lg:col-span-2 lg:row-start-2 w-full h-full aspect-[2896/1614] relative rounded-[10px] overflow-hidden">
                            {getMediaUrl(data.video) && (
                                <video
                                    src={getMediaUrl(data.video)}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover rounded-[10px]"
                                />
                            )}
                        </div>

                        {/* 5. Build Card */}
                        {data.cards?.[2] && (
                            <ProcessCard
                                card={data.cards[2]}
                                className="col-span-1 order-5 lg:order-none lg:col-start-1 lg:col-span-1 lg:row-start-2"
                            />
                        )}

                        {/* 6. Grow Card */}
                        {data.cards?.[3] && (
                            <ProcessCard
                                card={data.cards[3]}
                                className="col-span-1 order-6 lg:order-none lg:col-start-4 lg:col-span-1 lg:row-start-2"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProcessCard({
    card,
    className = "",
}: {
    card: ProcessCard;
    className?: string;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const iconUrl = getMediaUrl(card.icon);

    const ctaBase = card.cta?.label || "";
    const ctaDesktop = ctaBase && (ctaBase.toLowerCase().includes(card.title.toLowerCase())
        ? ctaBase
        : `${ctaBase} ${card.title}`);

    const services = card.services || [];
    const hasServices = services.length > 0;

    return (
        <div
            className={`group relative flex h-full min-h-[240px] sm:min-h-[250px] lg:min-h-0 w-full flex-col rounded-[10px] text-white overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                hasServices && isHovered ? "bg-[#2D4620]" : "bg-[#1A2F11]"
            } ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered((prev) => !prev)}
        >
            {/* Front View (Normal State) */}
            <motion.div
                animate={{
                    opacity: hasServices && isHovered ? 0 : 1,
                    y: hasServices && isHovered ? -8 : 0,
                }}
                transition={{
                    duration: 0.38,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className={`flex h-full w-full flex-col justify-between p-4 sm:p-5 lg:p-4.5 xl:p-6 2xl:p-8 ${
                    hasServices && isHovered
                        ? "pointer-events-none"
                        : "pointer-events-auto"
                }`}
            >
                <div>
                    {/* Icon */}
                    {iconUrl && (
                        <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-7 lg:w-7 xl:h-8 xl:w-8 mb-2 sm:mb-3 lg:mb-3 xl:mb-4 flex items-center justify-start">
                            <img
                                src={iconUrl}
                                alt={card.title || ""}
                                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-7 lg:w-7 xl:h-8 xl:w-8 object-contain brightness-0 invert"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-satoshi text-[clamp(18px,2vw,32px)] font-bold leading-tight text-white">
                        {card.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 sm:mt-2 lg:mt-2 font-satoshi text-[clamp(11.5px,1.1vw,14.5px)] font-normal leading-[1.4] text-[#9BA893] max-w-[300px]">
                        {card.description}
                    </p>
                </div>

                {/* CTA */}
                {card.cta && (
                    <div className="mt-auto pt-2.5 sm:pt-3 lg:pt-3.5 xl:pt-5">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 font-satoshi text-[clamp(12px,1.2vw,15.5px)] font-semibold text-white transition-all duration-200">
                            <span className="lg:hidden">{ctaBase}</span>
                            <span className="hidden lg:inline">{ctaDesktop}</span>
                            <svg
                                className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <polyline points="13 5 20 12 13 19" />
                            </svg>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Hovered View (Services List) */}
            {hasServices && (
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute inset-0 flex h-full w-full flex-col justify-between px-3 py-2 sm:p-5 lg:px-7 lg:pt-2.5 lg:pb-10 ${
                        isHovered
                            ? "pointer-events-auto"
                            : "pointer-events-none"
                    }`}
                >
                    <div className="flex h-full w-full flex-col justify-between overflow-hidden">
                        {services.map((service, idx) => (
                            <motion.div
                                key={service.id || idx}
                                initial={false}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    x: isHovered ? 0 : -14,
                                }}
                                transition={{
                                    duration: isHovered ? 0.48 : 0.2,
                                    delay: isHovered ? 0.12 + idx * 0.055 : 0,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className={`flex flex-1 items-center gap-1.5 sm:gap-3 lg:gap-4.5 py-0.5 sm:py-1.5 lg:py-2 will-change-[transform,opacity] ${
                                    idx !== services.length - 1 ? "border-b border-[#3E5634]" : ""
                                }`}
                            >
                                <svg
                                    className="w-1.5 sm:w-[9px] lg:w-[10px] h-2.5 sm:h-[15px] lg:h-[17px] shrink-0 text-white"
                                    viewBox="0 0 10 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1L9 9L1 17"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="font-satoshi text-[clamp(11px,1.05vw,15px)] font-normal leading-[1.2] text-white">
                                    {service.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

