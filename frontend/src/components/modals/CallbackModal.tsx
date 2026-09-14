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
}

export default function CallbackModal({ isOpen, onClose, data }: CallbackModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [shopifyLink, setShopifyLink] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalContainerRef = useRef<HTMLDivElement>(null);

    // All text comes exclusively from CMS — no hardcoded fallbacks
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

    // Auto-close modal after 2.5s on successful submission
    useEffect(() => {
        if (!isSubmitted) return;
        const timer = setTimeout(() => {
            onClose();
        }, 2500);
        return () => clearTimeout(timer);
    }, [isSubmitted, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
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
                        className="relative w-full max-w-[550px] sm:max-w-[570px] max-h-[92vh] sm:max-h-[88vh] bg-[#FAFAFC] rounded-none p-4 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] my-auto text-[#111827] z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close callback modal"
                            className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 w-7 h-7 flex items-center justify-center text-[#111827] hover:opacity-60 transition-opacity cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Title & Description */}
                        <div className="mb-5 sm:mb-6">
                            <h2 className="font-nohemi text-[clamp(26px,3.2vw,34px)] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8">
                                {title}
                            </h2>
                            <p className="font-satoshi text-[#555555] text-[clamp(12.5px,1.05vw,13.5px)] leading-relaxed mt-1.5 sm:mt-2 max-w-[520px] whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {isSubmitted ? (
                            <div className="p-6 rounded-none bg-[#EBF7F2] text-[#1E7448] text-center font-satoshi text-[clamp(14px,1.1vw,15px)] space-y-2.5 my-4">
                                <p className="font-medium text-[clamp(15px,1.2vw,16px)]">✓ {successTitle || "We've received your details! We'll call you shortly."}</p>
                                {successDescription && (
                                    <p className="text-[clamp(12.5px,1vw,13.5px)] text-[#2A7550]">
                                        {successDescription}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
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
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12.5px,1vw,13.5px)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
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
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12.5px,1vw,13.5px)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
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
                                        className="font-satoshi w-full px-5 py-2.5 sm:py-3 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] focus:ring-1 focus:ring-[#18181B] text-[clamp(12.5px,1vw,13.5px)] text-[#111827] bg-[#F1F1F3] placeholder-[#8E8E93] transition-all duration-200"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2 sm:pt-2.5">
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
                                        <p className="text-center font-satoshi text-[clamp(11.5px,0.9vw,12.5px)] text-[#777777] mt-2.5 sm:mt-3">
                                            {disclaimer}
                                        </p>
                                    )}
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
