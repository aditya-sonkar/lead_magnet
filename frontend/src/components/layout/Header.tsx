"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIAL_ICONS } from "@/lib/strapi";

export type HeaderLink = {
    id: number;
    label: string;
    href: string;
};

export type HeaderData = {
    logoText?: string;
    quickLinks?: HeaderLink[];
};

export type FooterContact = {
    id: number;
    location: string;
    phone: string;
    email: string;
    Address?: string;
};

export type SocialLink = {
    id: number;
    platform: string;
    href: string;
};

export type FooterData = {
    contactHeading?: string;
    quickLinksHeading?: string;
    quickLinks?: HeaderLink[];
    socialLinks?: SocialLink[];
    contacts?: FooterContact[];
};

export default function Header({
    data,
    footerData,
}: {
    data?: HeaderData;
    footerData?: FooterData;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Detect whether header is over a light or dark section as user scrolls
    useEffect(() => {
        let rafId: number | null = null;

        const checkTheme = () => {
            if (typeof window === "undefined") return;
            const headerY = 44;

            // 1. Explicit light element under header (e.g. quote form on mobile)
            const lightElements = document.querySelectorAll("[data-theme='light']");
            for (let i = 0; i < lightElements.length; i++) {
                const rect = lightElements[i].getBoundingClientRect();
                if (rect.top <= headerY && rect.bottom > headerY) {
                    setIsLight(true);
                    return;
                }
            }

            // 2. Explicit dark section under header (Hero, OurProcess, Footer)
            const darkElements = document.querySelectorAll("[data-theme='dark']");
            for (let i = 0; i < darkElements.length; i++) {
                const rect = darkElements[i].getBoundingClientRect();
                if (rect.top <= headerY && rect.bottom > headerY) {
                    setIsLight(false);
                    return;
                }
            }

            // 3. Fallback: If scrolled past initial top and not over any dark section, it's light
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            setIsLight(scrollY > 80);
        };

        const onScroll = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                checkTheme();
                rafId = null;
            });
        };

        checkTheme();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        // Connect with Lenis smooth scroll if present
        const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
        if (lenis) {
            lenis.on("scroll", onScroll);
        }

        return () => {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (lenis) {
                lenis.off("scroll", onScroll);
            }
        };
    }, []);

    // Nav links: prefer footer quickLinks, fallback to header quickLinks, then empty
    const navLinks: HeaderLink[] = (
        footerData?.quickLinks && footerData.quickLinks.length > 0
            ? footerData.quickLinks
            : data?.quickLinks && data.quickLinks.length > 0
            ? data.quickLinks
            : []
    );
    // Contacts: from CMS only — do not show placeholder contact details
    const contacts: FooterContact[] = (
        footerData?.contacts && footerData.contacts.length > 0
            ? footerData.contacts
            : []
    );
    // Social links: from CMS only — do not show placeholder social links
    const socialLinks: SocialLink[] = (
        footerData?.socialLinks && footerData.socialLinks.length > 0
            ? footerData.socialLinks
            : []
    );
    const brandName = data?.logoText || "Thumbstack.";

    const lineColor = isOpen
        ? "bg-white"
        : isLight
        ? "bg-[#2442EB]"
        : "bg-white";

    return (
        <>
            {/* Header bar */}
            <header className="fixed top-0 left-0 right-0 z-[110] px-5 sm:px-6 lg:px-[40px] xl:px-[48px] 2xl:px-[80px] min-[2000px]:px-[60px] min-[2500px]:px-[80px] pointer-events-none">
                <div className="max-w-[1720px] min-[2000px]:max-w-none mx-auto w-full flex justify-between items-center h-[72px] sm:h-[88px] pt-2 sm:pt-2.5 lg:pt-0 -translate-y-1 sm:-translate-y-1.5 lg:-translate-y-2">
                    <a
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`font-nohemi font-medium text-[25.5px] sm:text-[25px] lg:text-[26px] tracking-[-0.02em] leading-none pointer-events-auto select-none transition-colors duration-300 flex items-center translate-y-[2px] sm:translate-y-[1px] lg:translate-y-0 ${
                            isOpen
                                ? "text-white"
                                : isLight
                                ? "text-[#0F1D07]"
                                : "text-white"
                        }`}
                    >
                        {isOpen && brandName.endsWith(".") ? (
                            <>
                                {brandName.slice(0, -1)}<span className="text-[#38E29D]">.</span>
                            </>
                        ) : (
                            brandName
                        )}
                    </a>

                    {/* Menu toggle button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className={`group flex w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full items-center justify-center transition-all duration-300 ease-out pointer-events-auto cursor-pointer active:scale-95 ${
                            isOpen
                                ? "bg-transparent text-white hover:text-[#38E29D]"
                                : isLight
                                ? "bg-[#D4F8EE] hover:bg-[#C2F3E5] shadow-sm"
                                : "bg-transparent hover:opacity-80"
                        }`}
                    >
                        <div className="relative w-6 h-5 flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                            <span
                                className={`absolute left-0 w-6 h-[2px] ${lineColor} rounded-full transition-all duration-300 ease-in-out origin-center ${
                                    isOpen
                                        ? "rotate-45 translate-y-0 translate-x-0"
                                        : "-translate-y-[7px] group-hover:translate-x-[3.5px]"
                                }`}
                            />
                            <span
                                className={`absolute left-0 w-[17px] h-[2px] ${lineColor} rounded-full transition-all duration-300 ease-in-out origin-left ${
                                    isOpen
                                        ? "opacity-0 scale-x-0 translate-x-0"
                                        : "opacity-100 group-hover:-translate-x-[3.5px]"
                                }`}
                            />
                            <span
                                className={`absolute left-0 w-6 h-[2px] ${lineColor} rounded-full transition-all duration-300 ease-in-out origin-center ${
                                    isOpen
                                        ? "-rotate-45 translate-y-0 translate-x-0"
                                        : "translate-y-[7px] group-hover:translate-x-[3.5px]"
                                    }`}
                            />
                        </div>
                    </button>
                </div>
            </header>

            {/* Menu overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        onTouchMove={(e) => e.stopPropagation()}
                        onWheel={(e) => e.stopPropagation()}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[100] bg-[#13230D] text-white overflow-y-auto overscroll-contain pointer-events-auto touch-pan-y"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        <div className="min-h-full flex flex-col justify-between pt-[72px] sm:pt-[88px] pb-6 px-5 sm:px-6 lg:px-[40px] xl:px-[48px] 2xl:px-[80px]">
                            <div className="w-full max-w-[1500px] mx-auto flex-1 pt-6 sm:pt-10 lg:pt-12 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16 items-start">
                                {/* Navigation links */}
                                <nav className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-5 lg:gap-7 lg:pl-[138px]">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group relative block overflow-hidden font-nohemi text-[clamp(28px,4.5vw,60px)] font-normal tracking-[-0.02em] leading-[1.2] text-white w-fit cursor-pointer select-none"
                                        >
                                            <span className="block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] lg:group-hover:-translate-y-full">
                                                {link.label}
                                            </span>

                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0 block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full lg:group-hover:translate-y-0 text-[#38E29D]"
                                            >
                                                {link.label}
                                            </span>
                                        </a>
                                    ))}
                                </nav>

                                <div className="w-full border-t border-white/10 my-7 sm:my-8 lg:hidden" />

                                {/* Contact details */}
                                <div className="lg:col-span-5 flex flex-col justify-start lg:pt-3">
                                    <h3 className="font-satoshi font-bold text-[clamp(16px,1.25vw,18px)] text-white mb-5 sm:mb-6 tracking-wide">
                                        {footerData?.contactHeading}
                                    </h3>

                                    <div className="space-y-4 sm:space-y-6">
                                        {contacts.map((contact) => (
                                            <div key={contact.id} className="space-y-1">
                                                <p className="font-satoshi font-medium text-[clamp(13.5px,1.05vw,15px)] text-white">
                                                    {contact.location}
                                                </p>
                                                {contact.phone && (
                                                    <a
                                                        href={`tel:${contact.phone}`}
                                                        className="block font-satoshi text-[clamp(13.5px,1.05vw,15px)] text-white underline underline-offset-4 decoration-white/40 hover:decoration-[#38E29D] hover:text-[#38E29D] transition-colors"
                                                    >
                                                        {contact.phone}
                                                    </a>
                                                )}
                                                {contact.email && (
                                                    <a
                                                        href={`mailto:${contact.email}`}
                                                        className="block font-satoshi text-[clamp(13px,1vw,14px)] text-[#CBD2C9] underline underline-offset-4 decoration-white/30 hover:text-white transition-colors"
                                                    >
                                                        {contact.email}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="hidden lg:block mt-8 sm:mt-10">
                                        {((data as any)?.cta?.label || (data as any)?.ctaLabel || (footerData as any)?.cta?.label) && (
                                        <a
                                            href={(data as any)?.cta?.href || (footerData as any)?.cta?.href || "#quote"}
                                            onClick={() => setIsOpen(false)}
                                            className="inline-flex items-center gap-2 rounded-full bg-[#3145DD] hover:bg-[#2537c7] text-white px-7 py-3.5 font-satoshi text-[15px] font-medium transition-all shadow-md active:scale-95 w-fit"
                                        >
                                            <span>{(data as any)?.cta?.label || (data as any)?.ctaLabel || (footerData as any)?.cta?.label}</span>
                                            <span className="text-[17px] leading-none">→</span>
                                        </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-6 pb-2 flex items-center justify-end lg:justify-center gap-5 sm:gap-6">
                                {socialLinks.map((social) => {
                                    const iconSrc = SOCIAL_ICONS[social.platform];
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:opacity-80 transition-opacity p-1"
                                            aria-label={social.platform}
                                        >
                                            {iconSrc ? (
                                                <Image
                                                    src={iconSrc}
                                                    alt={social.platform}
                                                    width={20}
                                                    height={20}
                                                    className="h-4.5 w-4.5 sm:h-5 sm:w-5 object-contain filter brightness-100"
                                                />
                                            ) : (
                                                <span className="text-[13px] font-satoshi text-white">
                                                    {social.platform}
                                                </span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
