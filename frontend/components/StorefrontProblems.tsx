"use client";

import { useState } from "react";

type PainPoint = {
    id: number;
    title: string;
    description: string;
};

type StorefrontProblemsData = {
    heading: string;
    description: string;
    items: PainPoint[];
    summary: string;
    submitLabel: string;
    submitHref: string;
};

function renderFormattedDescription(desc: string) {
    if (!desc) return null;
    if ((desc.includes("recognise") || desc.includes("recognize")) && desc.includes("contacted us about")) {
        const formatted = desc
            .replace(/(recogni[sz]e)\s+(three)/i, "$1<br-mobile>$2")
            .replace(/(\bthey)\s+(contacted us about)/i, "$1<br-mobile>$2");

        if (formatted.includes("<br-mobile>")) {
            const chunks = formatted.split("<br-mobile>");
            return chunks.map((chunk, idx) => (
                <span key={idx}>
                    {chunk}
                    {idx < chunks.length - 1 && (
                        <>
                            <span className="hidden sm:inline"> </span>
                            <br className="sm:hidden" />
                        </>
                    )}
                </span>
            ));
        }
    }
    return desc;
}

export default function StorefrontProblems({
    data,
}: {
    data: StorefrontProblemsData;
}) {
    if (!data) return null;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <section id="storefront-problems" className="w-full bg-white px-6 pt-15 pb-10 text-[#0D2108] lg:px-[60px] xl:px-[80px] lg:pt-[90px] lg:pb-[30px] border-none outline-none">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full">
                    <h2 className="font-delight text-[clamp(32px,4.2vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] xl:whitespace-nowrap text-[#0F1D07]">
                        {data.heading}
                    </h2>

                    <p className="font-satoshi font-medium mt-4 sm:mt-5 max-w-[365px] sm:max-w-[430px] whitespace-pre-line text-[14px] sm:text-[15.5px] lg:text-[16px] leading-[1.6] sm:leading-[1.7] text-[#0F1D07]">
                        {renderFormattedDescription(data.description)}
                    </p>
                </div>

                {/* Interactive problem selection cards */}
                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-[clamp(16px,1.4vw,28px)] xl:gap-[clamp(20px,1.8vw,32px)]">
                    {(data.items || []).map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleSelect(item.id)}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleSelect(item.id);
                                    }
                                }}
                                className={`relative min-h-[130px] sm:min-h-[155px] lg:min-h-[165px] rounded-[12px] px-5 pt-6 pb-6 sm:p-[clamp(16px,1.2vw,22px)] sm:pb-9 lg:pb-11 cursor-pointer select-none transition-colors duration-200 ${isSelected
                                    ? "bg-[#B4BCFE]"
                                    : "bg-[#EFF0FD] sm:bg-[#EEF0FF] hover:bg-[#B4BCFE]"
                                    }`}
                            >
                                <div className="pr-9 sm:pr-7">
                                    <h3 className="font-delight text-[19.5px] sm:text-[18.5px] lg:text-[19px] font-medium leading-[1.32] sm:leading-[1.25] text-[#0F1D07] text-balance whitespace-pre-line">
                                        {item.title}
                                    </h3>

                                    <p className="font-satoshi mt-2 sm:mt-2.5 text-[15.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.5] sm:leading-[1.55] text-[#0F1D07]">
                                        {item.description}
                                    </p>
                                </div>

                                <div
                                    className={`absolute right-4 top-4.5 sm:right-4 sm:top-4 flex h-8 w-8 sm:h-6.5 sm:w-6.5 items-center justify-center rounded-[9px] shrink-0 transition-all duration-200 ${isSelected ? "bg-[#3145DD] text-white" : "bg-white text-[#1A1A1A] shadow-xs"
                                        }`}
                                >
                                    {isSelected ? (
                                        <svg
                                            className="w-5 h-5 sm:w-4 sm:h-4 text-white"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5.5 h-5.5 sm:w-4 sm:h-4 text-[#1A1A1A]"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8 2.5V13.5M2.5 8H13.5"
                                                stroke="currentColor"
                                                strokeWidth="0.95"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom summary and action bar */}
                {(() => {
                    const count = selectedIds.length;

                    // Derive summary text exclusively from CMS data — no hardcoded fallbacks
                    const summaryText = (() => {
                        if (Array.isArray(data.summary)) {
                            if (count === 0) {
                                const def = (data.summary as any[]).find((s: any) => s?.state === "default");
                                return def?.text || null;
                            } else if (count === 1) {
                                const one = (data.summary as any[]).find((s: any) => s?.state === "one");
                                return one?.text ? one.text.replace(/\{count\}/g, "1") : null;
                            } else {
                                const mult = (data.summary as any[]).find((s: any) => s?.state === "multiple");
                                return mult?.text ? mult.text.replace(/\{count\}/g, String(count)) : null;
                            }
                        }
                        // String summary: interpolate {count} if present
                        if (typeof data.summary === "string" && data.summary.trim()) {
                            return data.summary.replace(/\{count\}/g, String(count));
                        }
                        return null;
                    })();

                    // Only render the bar when there is CMS content or a CTA label
                    if (!summaryText && !data.submitLabel) return null;

                    return (
                        <div className="mt-8 flex flex-col items-start sm:items-center justify-between gap-4 sm:gap-5 rounded-[8px] bg-[#F7F7F7] px-5 py-3.5 sm:py-3 sm:flex-row">
                            {summaryText && (
                                <p className="font-satoshi text-[14.5px] sm:text-[15px] lg:text-[16px] font-bold leading-[2.1] sm:leading-[1.5] text-[#0F1D07]">
                                    {summaryText}
                                </p>
                            )}

                            {data.submitLabel && (
                                <a
                                    href={data.submitHref}
                                    onClick={(e) => {
                                        if (data.submitHref === "#quote" || data.submitHref?.includes("quote")) {
                                            e.preventDefault();
                                            window.dispatchEvent(new CustomEvent("open-quote-modal"));
                                        }
                                    }}
                                    className="flex w-full font-inter items-center justify-center rounded-full bg-[#3447E5] px-10 py-2.5 sm:py-3.5 text-[clamp(13px,1.05vw,14.5px)] font-medium text-white transition hover:opacity-90 sm:w-[260px] cursor-pointer"
                                >
                                    {data.submitLabel}
                                    <span className="ml-2">→</span>
                                </a>
                            )}
                        </div>
                    );
                })()}

            </div>
        </section>
    );
}