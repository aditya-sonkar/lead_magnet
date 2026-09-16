"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuoteForm from "./QuoteForm";
import type { QuoteFormData, BudgetRange, FormOption } from "@/types";

export type { QuoteFormData, BudgetRange, FormOption };

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    form?: QuoteFormData | QuoteFormData[] | null;
}

export default function QuoteModal({ isOpen, onClose, form: rawForm }: QuoteModalProps) {
    const form = Array.isArray(rawForm) ? rawForm[0] : rawForm;

    // Container ref for modal
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const modalCardRef = useRef<HTMLDivElement>(null);

    // Lock body & document scroll, pause Lenis, and handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const origBodyOverflow = document.body.style.overflow;
        const origDocOverflow = document.documentElement.style.overflow;
        const origBodyOverscroll = document.body.style.overscrollBehavior;
        const origDocOverscroll = document.documentElement.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
        document.documentElement.style.overscrollBehavior = "none";

        if (typeof window !== "undefined") {
            (window as any).__lenis?.stop();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = origBodyOverflow;
            document.documentElement.style.overflow = origDocOverflow;
            document.body.style.overscrollBehavior = origBodyOverscroll;
            document.documentElement.style.overscrollBehavior = origDocOverscroll;
            if (typeof window !== "undefined") {
                (window as any).__lenis?.start();
            }
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={modalContainerRef}
                    id="quote-modal"
                    data-modal="quote"
                    onClick={onClose}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 md:p-6 bg-black/60 cursor-pointer select-none overflow-y-auto overscroll-contain no-scrollbar"
                >
                    {/* Modal Card */}
                    <motion.div
                        ref={modalCardRef}
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
                        data-lenis-prevent="true"
                        className="relative w-full max-w-[570px] sm:max-w-[595px] md:max-w-[610px] max-h-[94vh] sm:max-h-[90vh] min-h-0 sm:min-h-[535px] md:min-h-[555px] pb-6 sm:pb-10 md:pb-11 bg-[#F6F6F6] rounded-none pt-6 sm:pt-11 md:pt-12 px-5 sm:px-7 md:px-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain cursor-default select-text"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close quote modal"
                            className="absolute top-5 right-4 sm:top-8 sm:right-6 md:top-9 md:right-7 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#333333] hover:text-black transition-colors cursor-pointer z-20"
                        >
                            <svg className="w-6 h-6 sm:w-6.5 sm:h-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <QuoteForm form={form} variant="modal" onClose={onClose} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
