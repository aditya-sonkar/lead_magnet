"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getMediaUrl, getMediaDimensions } from "@/lib/strapi";
import Image from "next/image";

type StrapiMediaFormat = {
    url?: string;
    width?: number;
    height?: number;
};

type StrapiMedia =
    | {
          url?: string;
          data?: {
              attributes?: {
                  url?: string;
                  formats?: Record<string, StrapiMediaFormat>;
              };
              url?: string;
          };
          attributes?: {
              url?: string;
              formats?: Record<string, StrapiMediaFormat>;
          };
          [key: string]: unknown;
      }
    | string;

type ShowcaseItem = {
    id: number;
    name: string;
    beforeImage?: StrapiMedia | null;
    afterImage?: StrapiMedia | null;
    mobileBeforeImage?: StrapiMedia | null;
    mobileAfterImage?: StrapiMedia | null;
    beforeText?: string;
};

type WorkShowcaseData = {
    heading: string;
    description: string;
    MobileDescription?: string;
    mobileDescription?: string;
    Before?: string;
    before?: string;
    items: ShowcaseItem[];
};

export default function WorkShowcase({
    data,
}: {
    data: WorkShowcaseData;
}) {
    if (!data) return null;
    const items = data.items || [];
    const defaultItem = items.find((item) => item.name?.toLowerCase().includes("pacific")) || items[0];
    const initialId = defaultItem?.id ?? items[0]?.id;

    const [selectedItem, setSelectedItem] = useState(initialId);
    const [position, setPosition] = useState(50);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeScrollRef = useRef<HTMLDivElement>(null);
    const afterScrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const activeItem = items.find((item) => item.id === selectedItem) || defaultItem || items[0];
    const mobileDesc = data.MobileDescription || data.mobileDescription;
    const beforeText = data.Before || data.before || activeItem?.beforeText || "Before";

    const afterUrl = getMediaUrl(activeItem?.afterImage);
    const mobileAfterUrl = getMediaUrl(activeItem?.mobileAfterImage);
    const beforeUrl = getMediaUrl(activeItem?.beforeImage);
    const mobileBeforeUrl = getMediaUrl(activeItem?.mobileBeforeImage);

    const afterDims = getMediaDimensions(activeItem?.afterImage);
    const mobileAfterDims = getMediaDimensions(activeItem?.mobileAfterImage);
    const beforeDims = getMediaDimensions(activeItem?.beforeImage);
    const mobileBeforeDims = getMediaDimensions(activeItem?.mobileBeforeImage);
    
    const aDims = afterDims || mobileAfterDims || { width: 1920, height: 1080 };
    const maDims = mobileAfterDims || afterDims || { width: 1080, height: 1080 };
    const bDims = beforeDims || mobileBeforeDims || { width: 1920, height: 1080 };
    const mbDims = mobileBeforeDims || beforeDims || { width: 1080, height: 1080 };

    const hasImages = Boolean((beforeUrl || mobileBeforeUrl) && (afterUrl || mobileAfterUrl));

    useEffect(() => {
        if (items.length > 0 && (!selectedItem || !items.some((it) => it.id === selectedItem))) {
            const pacific = items.find((item) => item.name?.toLowerCase().includes("pacific")) || items[0];
            setSelectedItem(pacific?.id ?? items[0].id);
        }
    }, [items, selectedItem]);

    useEffect(() => {
        if (beforeScrollRef.current) beforeScrollRef.current.scrollTop = 0;
        if (afterScrollRef.current) afterScrollRef.current.scrollTop = 0;
    }, [selectedItem]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width <= 0) return;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        if (!Number.isNaN(percentage)) {
            setPosition(percentage);
        }
    }, []);

    const isAfterFullySlid = position <= 2;
    const isBeforeFullySlid = position >= 98;
    const canScrollAfter = isMobile ? (isAfterFullySlid && !isDragging) : false;
    const canScrollBefore = isMobile ? (isBeforeFullySlid && !isDragging) : false;

    const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isMobile) {
            setIsDragging(true);
            e.currentTarget.setPointerCapture?.(e.pointerId);
            updatePosition(e.clientX);
        }
    };

    const handleHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
        updatePosition(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDragging) {
            updatePosition(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
            try {
                e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {}
        }
        if (isMobile) {
            setPosition((prev) => {
                if (prev >= 96) return 100;
                if (prev <= 4) return 0;
                return prev;
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") {
            setPosition((prev) => Math.max(0, prev - 5));
        } else if (e.key === "ArrowRight") {
            setPosition((prev) => Math.min(100, prev + 5));
        }
    };

    const itemName = activeItem?.name || "";

    return (
        <section className="px-5 sm:px-6 py-14 sm:py-20 bg-[#f5f5f5] lg:px-[60px] xl:px-[80px] lg:pt-[115px] xl:pt-[125px] lg:pb-[120px] xl:pb-[135px]">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full">
                    <h2 suppressHydrationWarning className="max-w-[1150px] font-delight text-[clamp(26px,7.4vw,42px)] sm:text-[clamp(36px,4.2vw,65px)] font-medium leading-[1.15] sm:leading-[1.4] tracking-[-0.015em] mb-4 sm:mb-6">
                        {data.heading}
                    </h2>
                    {mobileDesc ? (
                        <>
                            <p className="block sm:hidden max-w-[650px] font-satoshi font-medium text-[clamp(13px,4.2vw,16px)] text-[#000000] whitespace-pre-line text-pretty leading-relaxed">
                                {mobileDesc}
                            </p>
                            <p className="hidden sm:block max-w-[815px] font-satoshi font-medium text-[clamp(14px,4.2vw,16px)] text-[#000000] whitespace-pre-line leading-relaxed">
                                {data.description}
                            </p>
                        </>
                    ) : (
                        <p className="max-w-[815px] font-satoshi font-medium text-[clamp(14px,4.2vw,16px)] text-[#000000] whitespace-pre-line leading-relaxed">
                            {data.description}
                        </p>
                    )}

                    <div className="mt-6 sm:mt-10 flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItem(item.id)}
                                type="button"
                                className={`shrink-0 rounded-full border px-4.5 sm:px-7 py-2 sm:py-3 text-[clamp(14px,1.2vw,18.5px)] font-satoshi font-medium transition-colors cursor-pointer ${
                                    (activeItem?.id === item.id || selectedItem === item.id)
                                        ? "border-[#307D6D] bg-[#B2ECDE] text-[#18362D] sm:border-[#79BDB4] sm:bg-[#DDF2EF] sm:text-[#0D2108]"
                                        : "border-[#CAC4D0] bg-transparent text-[#2B2B2B] hover:border-gray-400"
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                {activeItem && hasImages && (
                    <div
                        ref={containerRef}
                        role="slider"
                        data-theme="dark"
                        aria-label={itemName ? `${itemName} comparison slider` : "Before and after comparison slider"}
                        aria-valuenow={Math.round(position)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        onPointerDown={handleContainerPointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="relative mt-7 sm:mt-12 lg:mt-14 xl:mt-16 w-full h-[520px] sm:h-[620px] md:h-auto md:aspect-[16/9] overflow-hidden rounded-[8px] select-none bg-black/5 shadow-sm border border-black/5"
                    >
                        {/* "Before" Badge (Pinned at top-left of the card viewport, disappears when sliding towards After) */}
                        {beforeText && (
                            <div
                                className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
                                style={{
                                    clipPath: `inset(0 ${100 - position}% 0 0)`,
                                    WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
                                    opacity: position <= 10 ? 0 : 1,
                                    transition: "opacity 0.15s ease-out",
                                }}
                            >
                                <div className="absolute top-3 left-3 sm:top-5 sm:left-6 md:top-6 md:left-8 select-none pointer-events-auto">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPosition(100);
                                        }}
                                        title={`View full ${beforeText}`}
                                        className="inline-flex items-center justify-center px-3.5 sm:px-6 py-1 sm:py-2 rounded-full bg-white/90 hover:bg-white text-black font-satoshi text-[clamp(13px,1.5vw,22px)] font-medium tracking-tight shadow-md border border-black/10 transition-transform active:scale-95 cursor-pointer"
                                    >
                                        {beforeText}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* After Image Container (Independent scroll container for After image) */}
                        <div
                            ref={afterScrollRef}
                            className={`absolute inset-0 h-full w-full ${
                                canScrollAfter
                                    ? "overflow-y-auto touch-pan-y overscroll-y-contain pointer-events-auto"
                                    : "overflow-hidden touch-none pointer-events-none"
                            } md:overflow-hidden no-scrollbar`}
                        >
                            {(afterUrl || mobileAfterUrl) && (
                                <>
                                    {mobileAfterUrl && (
                                        <div className="block md:hidden">
                                            <Image
                                                src={mobileAfterUrl}
                                                alt={itemName ? `${itemName} - After` : "After"}
                                                width={maDims.width}
                                                height={maDims.height}
                                                className="w-full h-auto md:h-full md:aspect-[16/9] object-cover object-top pointer-events-none select-none block"
                                            />
                                        </div>
                                    )}
                                    <div className={mobileAfterUrl ? "hidden md:block" : "block"}>
                                        <Image
                                            src={afterUrl || mobileAfterUrl || ""}
                                            alt={itemName ? `${itemName} - After` : "After"}
                                            width={aDims.width}
                                            height={aDims.height}
                                            className="w-full h-auto md:h-full md:aspect-[16/9] object-cover object-top pointer-events-none select-none block"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Before Layer (Clipped horizontally by slider position with independent scroll container) */}
                        {(beforeUrl || mobileBeforeUrl) && (
                            <div
                                className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                                style={{
                                    clipPath: `inset(0 ${100 - position}% 0 0)`,
                                    WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
                                    opacity: position <= 0 ? 0 : 1,
                                }}
                            >
                                <div
                                    ref={beforeScrollRef}
                                    className={`h-full w-full ${
                                        canScrollBefore
                                            ? "overflow-y-auto touch-pan-y overscroll-y-contain pointer-events-auto"
                                            : "overflow-hidden touch-none pointer-events-none"
                                    } md:overflow-hidden no-scrollbar bg-[#f5f5f5]`}
                                >
                                    {mobileBeforeUrl && (
                                        <div className="block md:hidden">
                                            <Image
                                                src={mobileBeforeUrl}
                                                alt={itemName ? `${itemName} - Before` : "Before"}
                                                width={mbDims.width}
                                                height={mbDims.height}
                                                className="w-full h-auto md:h-full md:aspect-[16/9] object-cover object-top pointer-events-none select-none block"
                                            />
                                        </div>
                                    )}
                                    <div className={mobileBeforeUrl ? "hidden md:block" : "block"}>
                                        <Image
                                            src={beforeUrl || mobileBeforeUrl || ""}
                                            alt={itemName ? `${itemName} - Before` : "Before"}
                                            width={bDims.width}
                                            height={bDims.height}
                                            className="w-full h-auto md:h-full md:aspect-[16/9] object-cover object-top pointer-events-none select-none block"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Divider Line & Center Handle Knob (Pinned across the card viewport, never moves on vertical scroll) */}
                        <div
                            className="absolute top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white md:bg-black z-20 pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.3)]"
                            style={{ left: `${position}%` }}
                        >
                            {/* Extended touch area for easy dragging along the divider line on mobile */}
                            <div
                                onPointerDown={handleHandlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                className="absolute inset-y-0 -left-6 -right-6 pointer-events-auto touch-none cursor-ew-resize select-none"
                            />

                            {/* Center Handle Knob */}
                            <div
                                onPointerDown={handleHandlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                aria-hidden="true"
                                className="absolute top-1/2 flex h-10 w-10 sm:h-11 sm:w-11 md:h-[50px] md:w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-xl pointer-events-auto touch-none cursor-ew-resize select-none border border-white/40 active:scale-105 transition-transform z-30"
                            >
                                <div className="flex items-center justify-center gap-0.5 sm:gap-1 pointer-events-none">
                                    <svg
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                    <svg
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {afterUrl && !beforeUrl && !mobileBeforeUrl && (
                    <div className="mt-8 sm:mt-12 overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-lg">
                        <Image
                            src={afterUrl}
                            alt={itemName ? `${itemName} - Showcase` : "Showcase"}
                            width={aDims.width}
                            height={aDims.height}
                            className="h-auto w-full"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}