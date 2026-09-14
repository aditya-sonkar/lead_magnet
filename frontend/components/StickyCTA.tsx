"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuoteModal, { QuoteFormData } from "./QuoteModal";
import CallbackModal, { CallbackFormData } from "./CallbackModal";

type CTA = {
    label: string;
    href: string;
};

export type StickyCTAData = {
    text: string;
    primaryCta?: CTA;
    secondaryCta?: CTA;
    callbackForm?: CallbackFormData;
};

export default function StickyCTA({
    data,
    quoteForm,
    callbackForm,
}: {
    data?: StickyCTAData | null;
    quoteForm?: QuoteFormData | QuoteFormData[] | null;
    callbackForm?: CallbackFormData | null;
}) {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [isCallbackOpen, setIsCallbackOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleOpenQuote = () => setIsQuoteOpen(true);
        const handleOpenCallback = () => setIsCallbackOpen(true);
        window.addEventListener("open-quote-modal", handleOpenQuote);
        window.addEventListener("open-callback-modal", handleOpenCallback);

        // Production-safe visibility: triggers when user scrolls past the first section (Hero)
        const getFirstSection = () => {
            return (
                document.querySelector("main > section:first-of-type") ||
                document.querySelector("section")
            );
        };

        const checkVisibility = () => {
            const firstSection = getFirstSection();
            if (firstSection) {
                const rect = firstSection.getBoundingClientRect();
                // Visible when user scrolls past the hero section
                setIsVisible(rect.bottom <= window.innerHeight * 0.25 || window.scrollY > 400);
            } else {
                setIsVisible(window.scrollY > 400);
            }
        };

        window.addEventListener("scroll", checkVisibility, { passive: true });
        window.addEventListener("resize", checkVisibility);
        checkVisibility();

        const firstSection = getFirstSection();
        let observer: IntersectionObserver | null = null;
        if (firstSection && "IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry) {
                        if (!entry.isIntersecting && window.scrollY > 200) {
                            setIsVisible(true);
                        } else if (entry.isIntersecting && entry.boundingClientRect.top >= -50) {
                            setIsVisible(false);
                        }
                    }
                },
                {
                    root: null,
                    threshold: 0.1,
                }
            );
            observer.observe(firstSection);
        }

        const handleGlobalClick = (e: MouseEvent) => {
            const el = (e.target as HTMLElement)?.closest("a, button");
            if (!el) return;
            // Ignore if clicked inside callback modal, quote modal, or hero quote form
            if (
                el.closest("#callback-modal") ||
                el.closest("[data-modal='callback']") ||
                el.closest("#quote-modal") ||
                el.closest("[data-modal='quote']") ||
                el.closest("#quote") ||
                el.closest("[data-quote-form]") ||
                el.getAttribute("data-no-callback") === "true" ||
                el.closest("[data-no-callback='true']")
            ) {
                return;
            }

            const href = el.getAttribute("href")?.toLowerCase() || "";
            const modalTarget = el.getAttribute("data-modal-target")?.toLowerCase() || "";

            if (
                href === "#call" ||
                href === "#callback" ||
                href === "#callback-modal" ||
                modalTarget === "callback"
            ) {
                e.preventDefault();
                e.stopPropagation();
                setIsCallbackOpen(true);
                return;
            }

            if (
                href === "#quote" ||
                href === "#quote-modal" ||
                modalTarget === "quote"
            ) {
                e.preventDefault();
                e.stopPropagation();
                setIsQuoteOpen(true);
                return;
            }
        };

        document.addEventListener("click", handleGlobalClick, true);

        return () => {
            window.removeEventListener("open-quote-modal", handleOpenQuote);
            window.removeEventListener("open-callback-modal", handleOpenCallback);
            document.removeEventListener("click", handleGlobalClick, true);
            window.removeEventListener("scroll", checkVisibility);
            window.removeEventListener("resize", checkVisibility);
            if (observer) observer.disconnect();
        };
    }, []);

    const rawData = (data as any)?.attributes || data;
    const displayText = (rawData?.text || "").trim();
    const rawPrimary = (rawData?.primaryCta as any)?.attributes || rawData?.primaryCta;
    const rawSecondary = (rawData?.secondaryCta as any)?.attributes || rawData?.secondaryCta;
    const primaryCta = rawPrimary?.label ? rawPrimary : null;
    const secondaryCta = rawSecondary?.label ? rawSecondary : null;
    const hasStickyContent = Boolean(displayText || primaryCta || secondaryCta);

    const isQuoteAction = (cta?: CTA | null) => {
        if (!cta) return false;
        const h = (cta.href || "").toLowerCase();
        return h === "#quote" || h === "#quote-modal";
    };

    const isCallbackAction = (cta?: CTA | null) => {
        if (!cta) return false;
        const h = (cta.href || "").toLowerCase();
        return (
            h === "#contact" ||
            h === "#call" ||
            h === "#callback" ||
            h === "#callback-modal"
        );
    };

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        if (href.startsWith("#")) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const handleCtaClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        cta?: CTA
    ) => {
        if (!cta) return;
        if (isQuoteAction(cta)) {
            e.preventDefault();
            setIsQuoteOpen(true);
            return;
        }
        if (isCallbackAction(cta)) {
            e.preventDefault();
            setIsCallbackOpen(true);
            return;
        }
        handleAnchorClick(e, cta.href);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && hasStickyContent && (
                    <div className="fixed bottom-3.5 sm:bottom-4 md:bottom-4.5 lg:bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 min-[340px]:px-3 sm:px-4 md:px-6">
                        <motion.div
                            initial={{ y: 90, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 90, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto w-[calc(100vw-16px)] min-[340px]:w-[calc(100vw-24px)] min-[480px]:w-auto max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-32px)] md:max-w-none"
                        >
                            <div className="relative rounded-[16px] min-[340px]:rounded-[18px] sm:rounded-[20px] bg-[#FFFFFF] py-2 min-[340px]:py-2.5 md:py-3 px-2.5 min-[340px]:px-3.5 min-[380px]:px-4 md:pl-6 md:pr-5.5 flex flex-col md:flex-row md:items-center gap-1.5 min-[340px]:gap-2 md:gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-black/10">
                                {displayText && (
                                    <div className="flex items-center justify-between gap-2 md:gap-0 shrink-0">
                                        <p className="font-nohemi text-[11px] min-[320px]:text-[clamp(12px,3.2vw,14px)] md:text-[clamp(13.5px,1.08vw,16px)] font-medium text-black leading-tight md:leading-none md:whitespace-nowrap tracking-tight">
                                            {displayText}
                                        </p>
                                    </div>
                                )}

                                {(primaryCta || secondaryCta) && (
                                    <div className="w-full md:w-auto flex items-center justify-between md:justify-start shrink-0 gap-1.5 min-[380px]:gap-2 md:gap-3">
                                        {primaryCta && (
                                            <a
                                                href={primaryCta.href || "#quote"}
                                                onClick={(e) => handleCtaClick(e, primaryCta)}
                                                className="group flex-[1.18] md:flex-none min-w-0 rounded-full bg-black py-1.5 min-[340px]:py-2 md:py-2.5 px-2 min-[340px]:px-2.5 min-[380px]:px-3.5 md:px-5 text-white text-[10px] min-[320px]:text-[11px] min-[360px]:text-[clamp(11.5px,3vw,13.5px)] md:text-[15px] xl:text-[16px] font-normal font-satoshi flex items-center justify-center gap-1 min-[340px]:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] shadow-sm hover:shadow whitespace-nowrap cursor-pointer"
                                            >
                                                <span>{primaryCta.label}</span>
                                                <span className="text-[10px] min-[320px]:text-[11px] min-[380px]:text-[12px] md:text-[15px] xl:text-[16px] leading-none transition-transform duration-150 group-hover:translate-x-0.5 shrink-0">
                                                    →
                                                </span>
                                            </a>
                                        )}

                                        {secondaryCta && (
                                            <a
                                                href={secondaryCta.href || "#contact"}
                                                onClick={(e) => handleCtaClick(e, secondaryCta)}
                                                style={{ color: "#000000" }}
                                                className="group flex-1 md:flex-none min-w-0 rounded-full bg-white border border-black py-1.5 min-[340px]:py-2 md:py-2.5 px-2 min-[340px]:px-2.5 min-[380px]:px-3.5 md:px-5 text-black text-[10px] min-[320px]:text-[11px] min-[360px]:text-[clamp(11.5px,3vw,13.5px)] md:text-[15px] xl:text-[16px] font-normal font-satoshi flex items-center justify-center gap-1 min-[340px]:gap-1.5 md:gap-2 transition-all duration-150 hover:bg-black/5 active:scale-[0.98] whitespace-nowrap cursor-pointer"
                                            >
                                                <span style={{ color: "#000000" }}>{secondaryCta.label}</span>
                                                <span className="text-[10px] min-[320px]:text-[11px] min-[380px]:text-[12px] md:text-[15px] xl:text-[16px] leading-none transition-transform duration-150 group-hover:translate-x-0.5 shrink-0" style={{ color: "#000000" }}>
                                                    →
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <QuoteModal
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
                form={quoteForm}
            />

            <CallbackModal
                isOpen={isCallbackOpen}
                onClose={() => setIsCallbackOpen(false)}
                data={callbackForm || (rawData?.callbackForm as any)?.attributes || rawData?.callbackForm}
            />
        </>
    );
}
