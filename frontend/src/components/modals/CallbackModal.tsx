"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CallbackFormData = {
    id?: number;
    title?: string;
    description?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    shopifyLinkLabel?: string;
    shopifyLinkPlaceholder?: string;
    buttonLabel?: string;
    submittingButtonLabel?: string;
    disclaimer?: string;
    successTitle?: string;
    successDescription?: string;
    closeButtonLabel?: string;
};

interface CallbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: CallbackFormData | null;
    selectedProblems?: string[];
    source?: string;
}

export default function CallbackModal({ isOpen, onClose, data, selectedProblems, source }: CallbackModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [shopifyLink, setShopifyLink] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalContainerRef = useRef<HTMLDivElement>(null);

    // All text comes exclusively from CMS
    const title = data?.title;
    const description = data?.description;
    const emailLabel = data?.emailLabel;
    const emailPlaceholder = data?.emailPlaceholder;
    const phoneLabel = data?.phoneLabel;
    const phonePlaceholder = data?.phonePlaceholder;
    const shopifyLinkLabel = data?.shopifyLinkLabel;
    const shopifyLinkPlaceholder = data?.shopifyLinkPlaceholder;
    const buttonLabel = data?.buttonLabel;
    const disclaimer = data?.disclaimer;
    const successTitle = data?.successTitle;
    const successDescription = data?.successDescription;

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

    // Reset state on modal open
    useEffect(() => {
        if (isOpen && isSubmitted) {
            setIsSubmitted(false);
            setIsSubmitting(false);
            setEmail("");
            setPhone("");
            setShopifyLink("");
        }
    }, [isOpen]);

    // Auto-close modal after 3.5s on successful submission
    useEffect(() => {
        if (!isSubmitted) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [isSubmitted, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    phone,
                    shopifyLink,
                    selectedProblems: selectedProblems && selectedProblems.length > 0 ? selectedProblems : undefined,
                    source: source || "Callback Modal",
                }),
            });
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={modalContainerRef}
                    data-lenis-prevent="true"
                    className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Semi-transparent Backdrop (no blur, dark overlay showing background) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Modal Card - Scrollable on mobile, Exact same width as QuoteModal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
                        id="callback-modal"
                        data-modal="callback"
                        data-lenis-prevent="true"
                        className="relative w-full max-w-[530px] sm:max-w-[555px] md:max-w-[570px] max-h-[94vh] sm:max-h-[90vh] bg-[#FAFAFC] rounded-none p-5 sm:p-8 md:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col overflow-y-auto overscroll-contain transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close callback modal"
                            className="absolute top-3.5 right-3.5 sm:top-7 sm:right-7 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer z-20"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="w-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2 my-auto"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EBF7F2] border border-[#A7E2C7] flex items-center justify-center text-[#168050] mb-4 shadow-sm">
                                    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-nohemi text-[20px] sm:text-[24px] font-normal text-[#111827] mb-2 leading-tight">
                                    {successTitle || "We've received your details! We'll call you shortly."}
                                </h3>
                                <p className="font-satoshi text-[13px] sm:text-[14px] text-[#4B5563] leading-relaxed max-w-[420px] mb-6">
                                    {successDescription || "Our team will reach out to you shortly to discuss your project and schedule your free call."}
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="font-satoshi px-7 py-2.5 rounded-full bg-[#242120] text-white hover:bg-black text-[13px] sm:text-[13.5px] font-medium transition-colors cursor-pointer shadow-sm"
                                >
                                    {data?.closeButtonLabel || "Done"}
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Title & Description */}
                                <div className="pt-2 sm:pt-3 mb-3.5 sm:mb-4">
                                    <h2 className="font-nohemi text-[clamp(21px,2.4vw,28px)] sm:text-[26px] md:text-[28px] font-normal text-[#111827] leading-[1.15] tracking-[-0.01em] pr-8">
                                        {title}
                                    </h2>
                                    <p className="font-satoshi text-[#222222] text-[10.5px] sm:text-[11px] md:text-[11.5px] leading-relaxed mt-1.5 sm:mt-2 max-w-[520px] whitespace-pre-line font-normal">
                                        {description}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Input Fields */}
                                    <div className="space-y-6 sm:space-y-6.5">
                                        {/* Email Field */}
                                        <div>
                                            <label className="font-nohemi block text-[clamp(14px,1.15vw,15.5px)] font-normal text-[#111827] mb-1.5">
                                                {emailLabel}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={emailPlaceholder}
                                                className="font-satoshi w-full px-5 sm:px-5.5 py-2 sm:py-2.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12px,0.95vw,13px)] text-[#111827] bg-[#F1F1F3] placeholder-[#444444] transition-all duration-200"
                                            />
                                        </div>

                                        {/* Phone Number Field */}
                                        <div>
                                            <label className="font-nohemi block text-[clamp(14px,1.15vw,15.5px)] font-normal text-[#111827] mb-1.5">
                                                {phoneLabel}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={phonePlaceholder}
                                                className="font-satoshi w-full px-5 sm:px-5.5 py-2 sm:py-2.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12px,0.95vw,13px)] text-[#111827] bg-[#F1F1F3] placeholder-[#444444] transition-all duration-200"
                                            />
                                        </div>

                                        {/* Shopify Link Field */}
                                        <div>
                                            <label className="font-nohemi block text-[clamp(14px,1.15vw,15.5px)] font-normal text-[#111827] mb-1.5">
                                                {shopifyLinkLabel}
                                            </label>
                                            <input
                                                type="text"
                                                value={shopifyLink}
                                                onChange={(e) => setShopifyLink(e.target.value)}
                                                placeholder={shopifyLinkPlaceholder}
                                                className="font-satoshi w-full px-5 sm:px-5.5 py-2 sm:py-2.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12px,0.95vw,13px)] text-[#111827] bg-[#F1F1F3] placeholder-[#444444] transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-3.5 sm:mt-4 pb-2 sm:pb-3">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-3 sm:py-3.5 px-6 rounded-full transition-all duration-200 flex justify-center items-center text-[clamp(14px,1.1vw,15px)] cursor-pointer shadow-md active:scale-[0.99] ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    <span>{data?.submittingButtonLabel || "Submitting..."}</span>
                                                </>
                                            ) : (
                                                buttonLabel
                                            )}
                                        </button>
                                        {disclaimer && (
                                            <p className="text-center font-satoshi text-[10.5px] sm:text-[11px] md:text-[11.5px] text-[#222222] mt-1.5 sm:mt-2 font-normal leading-normal">
                                                {disclaimer}
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
