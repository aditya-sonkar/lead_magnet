"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl, getMediaAlt, getMediaDimensions } from "@/lib/strapi";
import Image from "next/image";

type OurWorkImage = {
    url: string;
    alternativeText?: string | null;
};

type OurWorkProject = {
    id: number;
    images?: OurWorkImage | OurWorkImage[] | null;
    mobileImages?: OurWorkImage | OurWorkImage[] | null;
};

type OurWorkData = {
    heading: string;
    description: string;
    projects: OurWorkProject[];
};

export default function OurWork({ data }: { data: OurWorkData }) {
    const projects = data?.projects || [];
    const total = projects.length;
    const hasMultipleProjects = total > 1;

    const initialIndex = total > 0 ? Math.floor(total / 2) : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(1);

    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);

    const nextProject = () => {
        if (!hasMultipleProjects) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    const previousProject = () => {
        if (!hasMultipleProjects) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const goToProject = (dotIdx: number) => {
        if (!hasMultipleProjects || dotIdx === currentIndex) return;
        setDirection(dotIdx > currentIndex ? 1 : -1);
        setCurrentIndex(dotIdx);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null) return;
        if (Math.abs(touchDeltaX.current) > 45) {
            if (touchDeltaX.current < 0) {
                nextProject();
            } else {
                previousProject();
            }
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
    };

    return (
        <section className="w-full pt-10 sm:pt-20 pb-0 overflow-hidden bg-[#F5F5F5]">
            <div className="mx-auto flex w-full max-w-[1880px] flex-col px-6 lg:px-[60px] xl:px-[80px]">
                <div className="flex w-full justify-between items-end gap-6">
                    <div className="max-w-[960px]">
                        <h2 className="font-nohemi text-[clamp(28px,4.2vw,65px)] font-medium sm:font-normal leading-[1.15] tracking-[-0.015em] text-[#000000]">
                            {data.heading}
                        </h2>

                        <p className="max-w-[835px] font-satoshi text-[clamp(13.5px,1.1vw,16px)] font-medium text-[#000000] whitespace-pre-line text-pretty leading-relaxed mt-3">
                            {data.description}
                        </p>
                    </div>

                    {/* Desktop project navigation */}
                    <div className="hidden md:flex gap-3 shrink-0 mb-1">
                        <button
                            onClick={previousProject}
                            type="button"
                            aria-label="Previous project"
                            disabled={!hasMultipleProjects}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-all ${hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100 active:scale-90"
                                    : "opacity-40 cursor-not-allowed"
                                }`}
                        >
                            <Image
                                src="/images/arrow_left.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="h-4 w-4"
                            />
                        </button>

                        <button
                            onClick={nextProject}
                            type="button"
                            aria-label="Next project"
                            disabled={!hasMultipleProjects}
                            className={`flex h-11 w-11 items-center justify-center rounded-md bg-[#092008] transition-all ${hasMultipleProjects
                                    ? "hover:opacity-80 cursor-pointer opacity-100 active:scale-90"
                                    : "opacity-40 cursor-not-allowed"
                                }`}
                        >
                            <Image
                                src="/images/arrow_right.svg"
                                alt=""
                                width={16}
                                height={16}
                                className="h-4 w-4"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile project navigation */}
                {hasMultipleProjects && (
                    <div className="flex md:hidden items-center justify-between w-full mt-6 pt-1">
                        <button
                            onClick={previousProject}
                            type="button"
                            disabled={!hasMultipleProjects}
                            className="flex items-center gap-2 font-satoshi text-[clamp(13.5px,1.1vw,15px)] font-medium text-[#000000] hover:opacity-75 transition-opacity cursor-pointer select-none active:scale-90"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>

                        {/* Tracker Indicator */}
                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2].slice(0, Math.min(3, total)).map((dotIdx) => {
                                const isCurrent = dotIdx === (currentIndex % Math.min(3, total));

                                return (
                                    <button
                                        key={dotIdx}
                                        onClick={() => goToProject(dotIdx)}
                                        type="button"
                                        aria-label={`Indicator ${dotIdx + 1}`}
                                        className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-full cursor-pointer ${isCurrent
                                                ? "w-7 h-1.5 bg-[#2442EB]"
                                                : "w-2.5 h-1.5 bg-[#2442EB]/25 hover:bg-[#2442EB]/40"
                                            }`}
                                    />
                                );
                            })}
                        </div>

                        <button
                            onClick={nextProject}
                            type="button"
                            disabled={!hasMultipleProjects}
                            className="flex items-center gap-2 font-satoshi text-[clamp(13.5px,1.1vw,15px)] font-medium text-[#000000] hover:opacity-75 transition-opacity cursor-pointer select-none active:scale-90"
                        >
                            <span>Next</span>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Production full-width showcase banner with instant fast-clicking support */}
            <div
                data-theme="dark"
                className="mt-6 sm:mt-10 w-full overflow-hidden select-none relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {total > 0 ? (
                    <div className="relative w-full overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={{
                                    enter: (dir: number) => ({
                                        x: dir > 0 ? "100%" : "-100%",
                                        opacity: 0.5,
                                    }),
                                    center: {
                                        x: 0,
                                        opacity: 1,
                                    },
                                    exit: (dir: number) => ({
                                        x: dir > 0 ? "-100%" : "100%",
                                        opacity: 0.5,
                                    }),
                                }}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 180, damping: 22, mass: 0.8 },
                                    opacity: { duration: 0.4 },
                                }}
                                className="w-full will-change-transform"
                            >
                                {(() => {
                                    const proj = projects[currentIndex];
                                    const bUrl = getMediaUrl(proj?.images);
                                    const mUrl = getMediaUrl(proj?.mobileImages);
                                    const bDims = getMediaDimensions(proj?.images);
                                    const mDims = getMediaDimensions(proj?.mobileImages);
                                    const dims = bDims || mDims || { width: 1920, height: 1080 };
                                    const alt =
                                        getMediaAlt(proj?.images) ||
                                        getMediaAlt(proj?.mobileImages) ||
                                        data?.heading ||
                                        "Our Work";

                                    const imageClasses = "h-auto w-full max-h-[85vh] 2xl:max-h-[860px] object-cover object-top block select-none pointer-events-none";

                                    return mUrl ? (
                                        <>
                                            <div className="block md:hidden">
                                                <Image
                                                    src={mUrl}
                                                    alt={alt}
                                                    width={mDims?.width || 1080}
                                                    height={mDims?.height || 1080}
                                                    className={imageClasses}
                                                    priority={currentIndex === 0}
                                                />
                                            </div>
                                            <div className="hidden md:block">
                                                <Image
                                                    src={bUrl || mUrl || ""}
                                                    alt={alt}
                                                    width={dims.width}
                                                    height={dims.height}
                                                    className={imageClasses}
                                                    priority={currentIndex === 0}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Image
                                            src={bUrl || mUrl || ""}
                                            alt={alt}
                                            width={dims.width}
                                            height={dims.height}
                                            className={imageClasses}
                                            priority={currentIndex === 0}
                                        />
                                    );
                                })()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex h-[320px] w-full items-center justify-center bg-[#F5F5F5] text-gray-400">
                        <p className="font-satoshi text-base">No banner image available</p>
                    </div>
                )}
            </div>

            {/* Div under the image */}
            <div className="w-full h-8 sm:h-12 lg:h-16 bg-[#FFFFFF]" />
        </section>
    );
}