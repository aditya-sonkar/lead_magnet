"use client";

import { useState } from "react";
import Image from "next/image";

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
    warningMessage?: string;
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
    const [showWarning, setShowWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        setShowWarning(false); // Clear warning on selection change
        setIsSubmitted(false); // Reset to default instruction on selection change
    };

    return (
        <section id="storefront-problems" suppressHydrationWarning className="w-full bg-white px-6 pt-15 pb-10 text-[#0D2108] lg:px-[60px] xl:px-[80px] lg:pt-[105px] xl:pt-[110px] lg:pb-[30px] border-none outline-none">
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
                <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-x-[clamp(16px,1.4vw,28px)] lg:gap-y-[clamp(24px,2.2vw,40px)] xl:gap-x-[clamp(20px,1.8vw,32px)] xl:gap-y-[clamp(28px,2.5vw,46px)]">
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
                                className={`relative min-h-[130px] sm:min-h-[155px] lg:min-h-[165px] rounded-[10px] px-5 pt-6 pb-6 sm:p-[clamp(16px,1.2vw,22px)] sm:pb-9 lg:pb-11 cursor-pointer select-none transition-colors duration-200 ${isSelected
                                    ? "bg-[#bec2eb]"
                                    : "bg-[#3145DD14] hover:bg-[#bec2eb]"
                                    }`}
                            >
                                <div className="pr-9 sm:pr-9">
                                    <h3 className="font-delight text-[19.5px] sm:text-[18.5px] lg:text-[19px] font-medium leading-[1.32] sm:leading-[1.25] text-[#0F1D07] text-balance whitespace-pre-line">
                                        {item.title}
                                    </h3>

                                    <p className="font-satoshi mt-2 sm:mt-2.5 text-[15.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.5] sm:leading-[1.55] text-[#0F1D07]">
                                        {item.description}
                                    </p>
                                </div>

                                <div
                                    className={`absolute right-3 top-3 sm:right-3.5 sm:top-3.5 flex h-7 w-7 sm:h-7 sm:w-7 items-center justify-center rounded-[8px] shrink-0 transition-all duration-200 ${isSelected ? "bg-[#3145DD] text-white" : "bg-white text-[#1A1A1A] shadow-xs"
                                        }`}
                                >
                                    {isSelected ? (
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 lg:w-3.5 lg:h-3.5 text-white"
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
                                         <Image
                                             src="/icons/plus.svg"
                                             alt="Add"
                                             width={14}
                                             height={14}
                                             className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 lg:w-3.5 lg:h-3.5 object-contain"
                                         />
                                     )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom summary and action bar */}
                {(() => {
                    const count = selectedIds.length;

                    // Exact Strapi summary resolver for states: default, one, two, three, multiple
                    const summaryText = (() => {
                        const sData = data.summary;
                        if (!sData) return null;

                        const getTextByState = (targetState: string) => {
                            if (!Array.isArray(sData)) return null;
                            const item = sData.find((s: any) => String(s?.state || s?.type || s?.name || "").toLowerCase().trim() === targetState);
                            if (!item) return null;
                            return typeof item === "string" ? item : (item.text || item.description || item.content || item.label || item.value || null);
                        };

                        // BEFORE SUBMIT: Always show 'default' state from Strapi
                        if (!isSubmitted) {
                            const defText = getTextByState("default") || (Array.isArray(sData) && typeof sData[0] === "object" ? sData[0]?.text : null);
                            return defText ? defText.replace(/\{count\}/g, String(count)) : null;
                        }

                        // AFTER SUBMIT: Match count to Strapi state ('one', 'two', 'three', or 'multiple')
                        let targetState = "multiple";
                        if (count === 1) targetState = "one";
                        else if (count === 2) targetState = "two";
                        else if (count === 3) targetState = "three";

                        const matchedText = getTextByState(targetState) || getTextByState("multiple");
                        if (matchedText) {
                            return matchedText.replace(/\{count\}/g, String(count));
                        }

                        return null;
                    })();

                    // Only render the bar when there is CMS content or a CTA label
                    if (!summaryText && !data.submitLabel) return null;

                    return (
                        <div className="mt-8 sm:mt-10 lg:mt-12 xl:mt-14 2xl:mt-16 flex flex-col items-start sm:items-center justify-between gap-4 sm:gap-5 rounded-[10px] bg-[#F7F7F7] px-5 py-3.5 sm:py-3 sm:flex-row">
                            {summaryText && (
                                <p className="font-satoshi text-[14.5px] sm:text-[15px] lg:text-[16px] font-bold leading-[2.1] sm:leading-[1.5] text-[#0F1D07]">
                                    {summaryText}
                                </p>
                            )}

                            {data.submitLabel && (
                                <div className="w-full sm:w-auto flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isSubmitting || isSuccess) return;

                                            if (selectedIds.length === 0) {
                                                setShowWarning(true);
                                                setIsSubmitted(false);
                                                return;
                                            }
                                            setShowWarning(false);
                                            setIsSubmitting(true);
                                            
                                            setTimeout(() => {
                                                setIsSubmitting(false);
                                                setIsSubmitted(true);
                                                setIsSuccess(true);
                                                
                                                // Reset success badge after 1.5s
                                                setTimeout(() => {
                                                    setIsSuccess(false);
                                                }, 1500);
                                            }, 600);
                                        }}
                                        className={`flex w-full font-inter items-center justify-center rounded-full px-10 py-2.5 sm:py-3.5 text-[clamp(13px,1.05vw,14.5px)] font-medium text-white transition hover:opacity-90 sm:w-[260px] cursor-pointer ${
                                            isSuccess ? "bg-[#168050]" : "bg-[#3447E5]"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                <span>Diagnosing...</span>
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <svg className="w-4 h-4 mr-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Complete!</span>
                                            </>
                                        ) : (
                                            <>
                                                {data.submitLabel}
                                                <span className="ml-2">→</span>
                                            </>
                                        )}
                                    </button>
                                     {showWarning && data.warningMessage && (
                                         <p className="font-satoshi mt-2 text-[12.5px] sm:text-[13px] text-[#DC2626] font-medium text-center w-full animate-in fade-in slide-in-from-top-1 duration-200">
                                             {data.warningMessage}
                                         </p>
                                     )}
                                </div>
                            )}
                        </div>
                    );
                })()}

            </div>
        </section>
    );
}