"use client";

import React from "react";
import { useQuoteForm } from "./useQuoteForm";
import type { QuoteFormData, BudgetRange, FormOption } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export type { QuoteFormData, BudgetRange, FormOption };

const formatHint = (hint?: string) => {
    if (!hint) return "";
    const trimmed = hint.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("(") && trimmed.endsWith(")")) return trimmed;
    return `(${trimmed})`;
};

interface QuoteFormProps {
    form?: QuoteFormData | QuoteFormData[] | null;
    variant?: "hero" | "modal";
    onClose?: () => void;
}

export default function QuoteForm({ form: rawForm, variant = "hero", onClose }: QuoteFormProps) {
    const form = Array.isArray(rawForm) ? rawForm[0] : rawForm;
    const isHero = variant === "hero";

    const {
        step, setStep,
        hasStore, setHasStore,
        storeUrl, setStoreUrl,
        selectedIssues,
        selectedBudget,
        activeStep3Budget, setActiveStep3Budget,
        otherIssues, setOtherIssues,
        phone, email, setEmail,
        isSubmitted,
        isSubmitting,
        step1Warning, setStep1Warning,
        step2Warning,
        step3Warning,
        issuesTouched,
        budgetTouched,
        phoneTouched,
        issuesList,
        budgetList,
        toggleIssue,
        handleSelectBudget,
        handleStep1Continue,
        handleStep2Continue,
        handlePhoneChange,
        handleBookCallSubmit,
        formatCurrency,
        resetForm,
    } = useQuoteForm(form);

    const [clickedIssue, setClickedIssue] = React.useState<string | null>(null);

    const noOptionLabel = form?.noLabel;
    const shopifyQuestionHint = formatHint(form?.shopifyQuestionHint ?? "(choose one)");
    const issuesHint = formatHint(form?.issuesHint ?? "(multiple options)");
    const budgetHint = formatHint(form?.budgetHint ?? "(choose one)");

    // Automatically reset hero form to step 1 (after 5s), or auto-close sticky CTA modal (after 3.5s) on successful submission
    React.useEffect(() => {
        if (!isSubmitted) return;

        if (isHero) {
            const timer = setTimeout(() => {
                resetForm();
            }, 5000);
            return () => clearTimeout(timer);
        } else if (onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted, isHero, resetForm, onClose]);

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`w-full flex flex-col items-center justify-center text-center ${
                    isHero
                        ? "py-10 sm:py-14 px-4 min-h-[360px] sm:min-h-[420px]"
                        : "py-8 sm:py-12 px-4 flex-1 my-auto"
                }`}
            >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EBF7F2] border border-[#A7E2C7] flex items-center justify-center text-[#168050] mb-4 shadow-sm">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-nohemi text-[20px] sm:text-[24px] font-normal text-[#111827] mb-2 leading-tight">
                    {form?.successTitle || "We've received your details! We'll call you shortly."}
                </h3>
                <p className="font-satoshi text-[13px] sm:text-[14px] text-[#4B5563] leading-relaxed max-w-[420px]">
                    {form?.successDescription || "Our team is reviewing your requirements and will reach out to you with your personalized quote."}
                </p>
                {!isHero && (
                    <button
                        type="button"
                        onClick={() => onClose?.()}
                        className="font-satoshi px-7 py-2.5 rounded-full bg-[#242120] text-white hover:bg-black text-[13px] sm:text-[13.5px] font-medium transition-colors cursor-pointer shadow-sm mt-6"
                    >
                        {form?.closeButtonLabel || "Done"}
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <div className={isHero ? "w-full" : "flex flex-col justify-between flex-1"}>
            {/* Title & Description */}
            <div>
                <div className={isHero ? "w-full max-w-[620px] xl:max-w-none pt-2 sm:pt-0" : "mb-2 sm:mb-3.5"}>
                    <h2
                        className={
                            isHero
                                ? "font-nohemi text-[clamp(24px,6.5vw,28px)] sm:text-[clamp(20px,2.7vw,28px)] font-normal text-[#1A1A1A] mt-2 sm:mt-1.5 mb-1 sm:mb-1 xl:mb-0.5 leading-tight whitespace-normal xl:whitespace-nowrap"
                                : "font-nohemi text-[19px] sm:text-[27px] md:text-[29px] font-normal text-[#111827] leading-[1.15] tracking-tight pr-8"
                        }
                    >
                        {step === 1 && form?.title}
                        {step === 2 && form?.step2Title}
                        {step === 3 && form?.resultTitle}
                    </h2>
                    <p
                        className={
                            isHero
                                ? "font-satoshi text-[#222222] sm:text-[#444444] text-[14px] sm:text-[12.5px] xl:text-[13px] 2xl:text-[13.2px] tracking-tight leading-[1.42] sm:leading-relaxed mt-1 sm:mt-1 xl:mt-0.5 mb-3.5 sm:mb-4 whitespace-normal"
                                : "font-satoshi text-[#222222] text-[11px] sm:text-[12px] md:text-[12.5px] leading-normal mt-0.5 font-normal"
                        }
                    >
                        {step === 1 && form?.description}
                        {step === 2 && form?.step2Description}
                        {step === 3 && form?.resultDescription}
                    </p>
                </div>

                {/* Step Bar */}
                <div className={isHero ? "mb-6 sm:mb-8 select-none" : "mb-3 sm:mb-7 select-none"}>
                    <div className={isHero ? "mb-2" : "flex items-center justify-between mb-1 sm:mb-3"}>
                        <span
                            className={
                                isHero
                                    ? "font-satoshi text-[15px] sm:text-[16px] font-medium text-[#3145DD]"
                                    : "font-satoshi text-[12.5px] sm:text-[16px] md:text-[16.5px] font-medium text-[#3145DD] pl-1"
                            }
                        >
                            {step === 1 && form?.stepLabel}
                            {step === 2 && form?.step2Label}
                            {step === 3 && form?.step3Label}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-4 w-full">
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Step 1: Store info"
                            onClick={() => setStep(1)}
                            className={`h-[3px] sm:h-[3.2px] flex-1 min-w-0 rounded-full transition-colors duration-300 cursor-pointer ${step >= 1 ? (isHero ? "bg-[#1A1A1A]" : "bg-[#18181B]") : (isHero ? "bg-[#C8CBC6]" : "bg-[#D8D8DC]")
                                }`}
                        />
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Step 2: Services and budget"
                            onClick={() => {
                                if (hasStore !== null) {
                                    setStep(2);
                                } else {
                                    setStep1Warning(form?.storeWarning || "");
                                }
                            }}
                            className={`h-[3px] sm:h-[3.2px] flex-1 min-w-0 rounded-full transition-colors duration-300 cursor-pointer ${step >= 2 ? (isHero ? "bg-[#1A1A1A]" : "bg-[#18181B]") : (isHero ? "bg-[#C8CBC6]" : "bg-[#D8D8DC]")
                                }`}
                        />
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Step 3: Estimate and book call"
                            onClick={() => {
                                if (hasStore === null) {
                                    setStep(1);
                                    setStep1Warning(form?.storeWarning || "");
                                    return;
                                }
                                handleStep2Continue();
                            }}
                            className={`h-[3px] sm:h-[3.2px] flex-1 min-w-0 rounded-full transition-colors duration-300 cursor-pointer ${step >= 3 ? (isHero ? "bg-[#1A1A1A]" : "bg-[#18181B]") : (isHero ? "bg-[#C8CBC6]" : "bg-[#D8D8DC]")
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Step 1: Store status & URL */}
            {step === 1 && (
                <div className={isHero ? "space-y-4" : "flex flex-col flex-1 justify-between"}>
                    <div className={isHero ? "space-y-4" : "space-y-4 sm:space-y-5"}>
                        <div>
                            <label
                                suppressHydrationWarning
                                className={
                                    isHero
                                        ? "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[15px] sm:text-[16.5px] font-[450] text-[#1A1A1A] sm:text-[#1A1A1A] mb-2"
                                        : "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[14.5px] sm:text-[16px] font-normal text-[#1A1A1A] mb-1.5"
                                }
                            >
                                <span>{form?.shopifyQuestion}</span>
                                {shopifyQuestionHint && (
                                    <span className={`${isHero ? "inline lg:hidden" : "inline"} text-[12.5px] sm:text-[13.5px] font-normal text-[#71717A] tracking-normal`}>
                                        {shopifyQuestionHint}
                                    </span>
                                )}
                            </label>

                            {isHero ? (
                                <div className="flex flex-nowrap overflow-x-auto no-scrollbar scroll-smooth gap-2 sm:gap-3 pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible -mx-1 px-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHasStore(true);
                                            setStep1Warning("");
                                        }}
                                        className={`font-satoshi font-normal px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border text-[14px] sm:text-[16.5px] transition-all duration-300 ease-out cursor-pointer shrink-0 whitespace-nowrap ${hasStore === true
                                                ? "border-[#307D6D] bg-[#B2ECDE] sm:bg-[#DBEFE9] text-[#18362D] sm:text-[#24332D]"
                                                : "border-[#E0DFE7] text-[#333333] bg-[#F8F8FA] hover:border-[#9CA3AF] hover:text-black"
                                            }`}
                                    >
                                        {form?.yesLabel}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHasStore(false);
                                            setStep1Warning("");
                                        }}
                                        className={`font-satoshi font-normal px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border text-[14px] sm:text-[16.5px] transition-all duration-300 ease-out cursor-pointer shrink-0 whitespace-nowrap ${hasStore === false
                                                ? "border-[#307D6D] bg-[#B2ECDE] sm:bg-[#DBEFE9] text-[#18362D] sm:text-[#24332D]"
                                                : "border-[#E0DFE7] text-[#333333] bg-[#F8F8FA] hover:border-[#9CA3AF] hover:text-black"
                                            }`}
                                    >
                                        {form?.noLabel}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHasStore(true);
                                            setStep1Warning("");
                                        }}
                                        className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#C5C5CA] text-[12px] sm:text-[13px] font-nohemi font-normal transition-all duration-200 cursor-pointer bg-[#F2F2F2] text-[#111827] hover:border-[#9CA3AF] ${hasStore === true ? "shadow-xs" : "hover:bg-[#EAEAEA]"
                                            }`}
                                    >
                                        <svg className="w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] shrink-0 text-[#18181B]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                            <circle cx="9" cy="9" r="7.75" stroke="currentColor" strokeWidth="1.25" />
                                            {hasStore === true && <circle cx="9" cy="9" r="3.75" fill="currentColor" />}
                                        </svg>
                                        <span className="font-nohemi font-normal text-[#111827] text-[12px] sm:text-[13px]">{form?.yesLabel}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHasStore(false);
                                            setStep1Warning("");
                                        }}
                                        className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#C5C5CA] text-[12px] sm:text-[13px] font-nohemi font-normal transition-all duration-200 cursor-pointer bg-[#F2F2F2] text-[#111827] hover:border-[#9CA3AF] ${hasStore === false ? "shadow-xs" : "hover:bg-[#EAEAEA]"
                                            }`}
                                    >
                                        <svg className="w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] shrink-0 text-[#18181B]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                            <circle cx="9" cy="9" r="7.75" stroke="currentColor" strokeWidth="1.25" />
                                            {hasStore === false && <circle cx="9" cy="9" r="3.75" fill="currentColor" />}
                                        </svg>
                                        <span className="font-nohemi font-normal text-[#111827] text-[11.5px] sm:text-[13px]">{noOptionLabel}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={isHero ? "pt-1 mb-4 sm:mb-0" : "mb-4 sm:mb-5"}>
                            <label
                                className={
                                    isHero
                                        ? "font-nohemi block text-[15px] sm:text-[16.5px] font-[450] text-[#1A1A1A] sm:text-[#1A1A1A] mb-2"
                                        : "font-nohemi block text-[14.5px] sm:text-[16px] font-normal text-[#1A1A1A] mb-1 sm:mb-1.5"
                                }
                            >
                                {form?.shopifyLinkLabel}
                            </label>
                            <input
                                type="text"
                                value={storeUrl}
                                onChange={(e) => setStoreUrl(e.target.value)}
                                placeholder={form?.shopifyLinkPlaceholder}
                                className={
                                    isHero
                                        ? "font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#18181B] text-[13px] sm:text-[13.5px] text-black bg-[#F2F2F2] placeholder-[#444444] placeholder:text-[11.5px] sm:placeholder:text-[12.5px] transition-all duration-300 ease-out"
                                        : "font-satoshi w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#C5C5CA] focus:outline-none focus:border-[#18181B] text-[12px] sm:text-[13px] text-[#111827] bg-[#F7F7F7] placeholder-[#444444] transition-all duration-200"
                                }
                            />
                        </div>

                        {step1Warning && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={
                                    isHero
                                        ? "flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mt-3 shadow-2xs"
                                        : "flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[13px] font-satoshi font-medium mt-2 sm:mt-3 shadow-2xs"
                                }
                            >
                                <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                </svg>
                                <span>{step1Warning}</span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleStep1Continue}
                        className={
                            isHero
                                ? "font-satoshi w-full bg-[#2B44E7] hover:bg-[#2037CA] text-white font-normal py-2.5 sm:py-3 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 mt-[195px] sm:mt-24 lg:mt-[90px] xl:mt-[90px] 2xl:mt-[120px] mb-6 sm:mb-7 lg:mb-6 xl:mb-8 text-[15px] sm:text-[16px] shadow-none cursor-pointer"
                                : "font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2 sm:py-2.5 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-4 sm:mt-auto mb-2 sm:mb-3 text-[13px] sm:text-[14px] cursor-pointer shadow-md active:scale-[0.99] shrink-0"
                        }
                    >
                        <span>{form?.continueLabel}</span>
                        {isHero ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        ) : (
                            <span className="text-[14px] sm:text-[15px]">→</span>
                        )}
                    </button>
                </div>
            )}

            {/* Step 2: Issues & budget selection */}
            {step === 2 && (
                <div className={isHero ? "space-y-3" : "flex flex-col flex-1 justify-between"}>
                    <div className={isHero ? "space-y-4" : "space-y-2.5 sm:space-y-4"}>
                        {/* Issues */}
                        <div>
                            <div className={isHero ? "flex items-center justify-between mb-1 sm:mb-2" : "mb-1.5 sm:mb-2"}>
                                <label
                                    suppressHydrationWarning
                                    className={
                                        isHero
                                            ? "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[15px] sm:text-[16.5px] lg:text-[20px] font-normal text-[#1A1A1A] sm:text-[#1A1A1A] mb-1"
                                            : "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[14px] sm:text-[19px] font-normal text-[#1A1A1A]"
                                    }
                                >
                                    <span>{form?.issuesLabel}</span>
                                    {issuesHint && (
                                        <span className={`${isHero ? "inline lg:hidden" : "inline"} text-[12px] sm:text-[13px] font-normal text-[#71717A] tracking-normal`}>
                                            {issuesHint}
                                        </span>
                                    )}
                                </label>
                            </div>

                            {isHero ? (
                                <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 sm:gap-2.5 pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible -mx-1 px-1">
                                    {issuesList.map((item) => {
                                        const isSelected = selectedIssues.includes(item.label);
                                        const wasJustClicked = clickedIssue === item.label;
                                        return (
                                            <button
                                                key={item.id || item.value}
                                                type="button"
                                                onClick={() => {
                                                    setClickedIssue(item.label);
                                                    toggleIssue(item.label);
                                                }}
                                                className={`font-inter font-normal inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full border text-[13.8px] sm:text-[15.5px] transition-all duration-300 ease-out cursor-pointer shrink-0 whitespace-nowrap active:scale-[0.98] ${isSelected
                                                        ? "border-[#307D6D] bg-[#B2ECDE] sm:bg-[#DBEFE9] text-[#18362D] sm:text-[#24332D] font-medium"
                                                        : "border-[#D1D1D6] text-[#4B5563] bg-[#F8F8FA] hover:border-[#9CA3AF] hover:text-black"
                                                    }`}
                                            >
                                                <AnimatePresence initial={false}>
                                                    {isSelected && (
                                                        <motion.span
                                                            key="hero-tick"
                                                            initial={wasJustClicked ? { width: 0, opacity: 0, scale: 0.3 } : false}
                                                            animate={{ width: "auto", opacity: 1, scale: 1 }}
                                                            exit={{ width: 0, opacity: 0, scale: 0.3 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.6 }}
                                                            className="inline-flex items-center justify-center shrink-0 overflow-hidden"
                                                        >
                                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#24332D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                                                <motion.path
                                                                    d="M20 6L9 17L4 12"
                                                                    initial={wasJustClicked ? { pathLength: 0 } : false}
                                                                    animate={{ pathLength: 1 }}
                                                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                                                />
                                                            </svg>
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 min-[460px]:grid-cols-[0.98fr_1.26fr_1.14fr] gap-1.5 sm:gap-2.5 w-full">
                                    {issuesList.map((item) => {
                                        const isSelected = selectedIssues.includes(item.label) || selectedIssues.includes(item.value);
                                        const wasJustClicked = clickedIssue === item.label || (item.value && clickedIssue === item.value);
                                        return (
                                            <button
                                                key={item.id || item.value}
                                                type="button"
                                                onClick={() => {
                                                    setClickedIssue(item.label);
                                                    toggleIssue(item.label);
                                                }}
                                                className="flex items-center justify-start min-[460px]:justify-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 sm:py-2 rounded-full border border-[#D1D1D6] hover:border-[#9CA3AF] hover:bg-[#EAEAEA] transition-all duration-150 cursor-pointer min-h-[34px] sm:min-h-[40px] w-full bg-[#F2F2F2]"
                                            >
                                                <span
                                                    className={`w-[16px] h-[16px] sm:w-[19px] sm:h-[19px] rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-150 ${isSelected
                                                            ? "bg-black text-white shadow-[0_0_0_1px_#ffffff,0_0_0_1.8px_#18181B]"
                                                            : "border border-[#18181B] bg-transparent"
                                                        }`}
                                                >
                                                    <AnimatePresence initial={false}>
                                                        {isSelected && (
                                                            <motion.svg
                                                                key="modal-tick"
                                                                initial={wasJustClicked ? { scale: 0.4, opacity: 0 } : false}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: 0.4, opacity: 0 }}
                                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                                className="w-[10px] h-[10px] sm:w-[10.5px] sm:h-[10.5px] text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={3.5}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <motion.path
                                                                    d="M20 6L9 17L4 12"
                                                                    initial={wasJustClicked ? { pathLength: 0 } : false}
                                                                    animate={{ pathLength: 1 }}
                                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                                />
                                                            </motion.svg>
                                                        )}
                                                    </AnimatePresence>
                                                </span>
                                                <div className="flex flex-col min-w-0 justify-center text-left">
                                                    <span className="font-nohemi text-[11px] min-[460px]:text-[11.5px] sm:text-[12px] md:text-[12.5px] font-normal text-black leading-tight truncate">
                                                        {item.label}
                                                    </span>
                                                    {item.sublabel && (
                                                        <span className="font-satoshi text-[9px] min-[460px]:text-[10px] sm:text-[10.5px] md:text-[11px] font-[350] text-[#4B5563] leading-tight -mt-[1px] truncate">
                                                            {item.sublabel}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Budget */}
                        <div>
                            <div className={isHero ? "flex items-center justify-between mb-0.5 sm:mb-1" : "mb-1.5 sm:mb-2"}>
                                <label
                                    suppressHydrationWarning
                                    className={
                                        isHero
                                            ? "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[15px] sm:text-[16.5px] lg:text-[20px] font-normal text-[#1A1A1A] sm:text-[#1A1A1A] mb-1"
                                            : "font-nohemi flex flex-wrap items-baseline gap-x-1.5 text-[14px] sm:text-[19px] font-normal text-[#1A1A1A]"
                                    }
                                >
                                    <span>{form?.budgetLabel}</span>
                                    {budgetHint && (
                                        <span className={`${isHero ? "inline lg:hidden" : "inline"} text-[12px] sm:text-[13px] font-normal text-[#71717A] tracking-normal`}>
                                            {budgetHint}
                                        </span>
                                    )}
                                </label>
                            </div>

                            {isHero ? (
                                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                    {budgetList.map((tier) => {
                                        const tierVal = tier.value || tier.label;
                                        const isSelected = selectedBudget === tier.value || (tier.label && selectedBudget === tier.label);
                                        return (
                                            <button
                                                key={tier.id || tier.value || tier.label}
                                                type="button"
                                                onClick={() => handleSelectBudget(tierVal)}
                                                className={`font-inter font-normal px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full border text-[13.8px] sm:text-[15.5px] transition-all duration-300 ease-out cursor-pointer shrink-0 whitespace-nowrap ${isSelected
                                                        ? "border-[#307D6D] bg-[#B2ECDE] sm:bg-[#DBEFE9] text-[#18362D] sm:text-[#24332D] font-medium"
                                                        : "border-[#D1D1D6] text-[#4B5563] bg-[#F8F8FA] hover:border-[#9CA3AF] hover:text-black"
                                                    }`}
                                            >
                                                {tier.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 min-[460px]:grid-cols-[1.02fr_1.18fr_1.35fr] gap-1.5 sm:gap-2.5 w-full">
                                    {budgetList.map((tier) => {
                                        const tierVal = tier.value || tier.label;
                                        const isSelected = selectedBudget === tier.value || (tier.label && selectedBudget === tier.label);
                                        return (
                                            <button
                                                key={tier.id || tier.value || tier.label}
                                                type="button"
                                                onClick={() => handleSelectBudget(tierVal)}
                                                className="flex items-center gap-2 pl-3 sm:pl-4.5 pr-2.5 sm:pr-3 py-1 sm:py-2 rounded-full border border-[#D1D1D6] hover:border-[#9CA3AF] hover:bg-[#EAEAEA] text-left transition-all duration-150 cursor-pointer min-h-[34px] sm:min-h-[40px] w-full bg-[#F2F2F2]"
                                            >
                                                <svg
                                                    className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] shrink-0 text-black"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="9"
                                                        cy="9"
                                                        r="7.5"
                                                        stroke="#333333"
                                                        strokeWidth="0.55"
                                                    />
                                                    {isSelected && (
                                                        <circle
                                                            cx="9"
                                                            cy="9"
                                                            r="4"
                                                            fill="#000000"
                                                        />
                                                    )}
                                                </svg>
                                                <div className="flex flex-col min-w-0 flex-1 justify-center">
                                                    <span className="font-nohemi text-[11px] min-[460px]:text-[11.5px] sm:text-[12px] md:text-[12.5px] font-normal text-black leading-tight truncate">
                                                        {tier.label}
                                                    </span>
                                                    {tier.sublabel && (
                                                        <span className="font-satoshi text-[9px] min-[460px]:text-[10px] sm:text-[10.5px] md:text-[11px] font-[350] text-[#4B5563] leading-tight -mt-[1px] truncate">
                                                            {tier.sublabel}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Other Issues */}
                        <div className={isHero ? "" : "mb-1 sm:mb-1.5 pb-0.5"}>
                            <label
                                className={
                                    isHero
                                        ? "font-nohemi block text-[15px] sm:text-[16.5px] lg:text-[16px] font-normal text-[#1A1A1A] sm:text-[#1A1A1A] mb-2"
                                        : "font-nohemi block text-[12.5px] sm:text-[14.5px] font-normal text-[#1A1A1A] mb-1 sm:mb-1.5"
                                }
                            >
                                {form?.otherIssuesLabel}
                            </label>
                            <input
                                type="text"
                                value={otherIssues}
                                onChange={(e) => setOtherIssues(e.target.value)}
                                placeholder={form?.otherIssuesPlaceholder}
                                className={
                                    isHero
                                        ? "font-satoshi w-full px-5 py-2 sm:py-2.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#18181B] text-[13px] sm:text-[13.5px] text-black bg-[#F2F2F2] placeholder-[#444444] placeholder:text-[11.5px] sm:placeholder:text-[12.5px] transition-all duration-300 ease-out"
                                        : "font-satoshi w-full px-3.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full border border-[#C5C5CA] focus:outline-none focus:border-[#18181B] text-[11.5px] sm:text-[13px] text-[#18181B] bg-[#F7F7F7] placeholder-[#444444] transition-all duration-200"
                                }
                            />
                        </div>

                        {step2Warning && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={
                                    isHero
                                        ? "flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mt-3.5 shadow-2xs"
                                        : "flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[13px] font-satoshi font-medium mt-2 sm:mt-3 shadow-2xs"
                                }
                            >
                                <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                </svg>
                                <span>{step2Warning}</span>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleStep2Continue}
                        className={
                            isHero
                                ? "font-satoshi w-full bg-[#2B44E7] hover:bg-[#2037CA] text-white font-medium py-2.5 sm:py-3 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 mt-[195px] sm:mt-6 mb-6 sm:mb-7 lg:mb-6 xl:mb-8 text-[15px] sm:text-[16px] shadow-none cursor-pointer"
                                : "font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 mt-4 sm:mt-6 mb-2 sm:mb-4 md:mb-5 text-[13.5px] sm:text-[15.5px] cursor-pointer shadow-md active:scale-[0.99] shrink-0"
                        }
                    >
                        <span>{form?.estimateButtonLabel}</span>
                        {isHero ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        ) : (
                            <span className="text-[16px] sm:text-[17px]">→</span>
                        )}
                    </button>
                </div>
            )}

            {/* Step 3: Estimate breakdown & lead capture */}
            {step === 3 && (
                <div className={isHero ? "space-y-4" : "flex flex-col justify-between flex-1"}>
                    <div>
                        <h3
                            className={
                                isHero
                                    ? "font-nohemi text-[15px] sm:text-[16.5px] font-[450] text-[#1A1A1A]"
                                    : "font-nohemi text-[15px] sm:text-[18px] font-normal text-[#111827]"
                            }
                        >
                            {form?.estimateLabel}
                        </h3>
                        <p
                            className={
                                isHero
                                    ? "font-satoshi text-[13px] sm:text-[13.5px] text-[#6B6B6B] mt-0 sm:-mt-0.5 lg:-mt-1 mb-2 sm:mb-2.5"
                                    : "font-satoshi text-[11px] sm:text-[12.5px] text-[#6B7280] mt-0.5 mb-2.5 sm:mb-3"
                            }
                        >
                            {form?.basedOnLabel}{" "}
                            {selectedIssues.length > 0 ? (
                                selectedIssues.map((issue, idx) => (
                                    <span key={idx}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="font-satoshi text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                        >
                                            {issue}
                                        </button>
                                        {idx < selectedIssues.length - 1 && ", "}
                                    </span>
                                ))
                            ) : (
                                issuesList.slice(0, 2).map((opt, idx) => (
                                    <span key={opt.id || idx}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="font-satoshi text-[#3145DD] underline cursor-pointer hover:opacity-80 font-normal"
                                        >
                                            {opt.label}
                                        </button>
                                        {idx < Math.min(issuesList.length, 2) - 1 && ", "}
                                    </span>
                                ))
                            )}
                        </p>

                        <div className="space-y-1 sm:space-y-1.5 mb-4">
                            {budgetList.map((tier) => {
                                const tierVal = tier.value || tier.label;
                                const currentActive =
                                    activeStep3Budget ||
                                    selectedBudget ||
                                    budgetList[1]?.value ||
                                    budgetList[1]?.label ||
                                    "balanced";
                                const isActive = currentActive === tier.value || currentActive === tier.label;
                                const isStep2Selection =
                                    Boolean(selectedBudget) && (selectedBudget === tier.value || selectedBudget === tier.label);

                                return isActive ? (
                                    <div key={tier.id || tierVal} className="py-0.5">
                                        <p className="font-satoshi text-[13px] sm:text-[13.5px] font-normal text-[#3145DD] leading-tight">
                                            {tier.label} (Chosen Plan)
                                        </p>
                                        <div className="flex items-center gap-2 mt-0">
                                            <div
                                                className={
                                                    isHero
                                                        ? "font-satoshi text-[22px] sm:text-[24px] md:text-[25px] font-medium text-[#3145DD] tracking-tight flex items-center leading-none"
                                                        : "font-satoshi text-[20px] min-[360px]:text-[22px] sm:text-[24px] md:text-[25px] font-medium text-[#3145DD] tracking-tight flex items-center leading-none"
                                                }
                                            >
                                                {formatCurrency(tier.range)}
                                            </div>
                                            {isStep2Selection && (
                                                <span className="inline-flex items-center justify-center shrink-0 -translate-y-[1px] sm:-translate-y-[1.5px]">
                                                    <svg
                                                        className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] md:w-[25px] md:h-[25px]"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        aria-label="Chosen Plan"
                                                    >
                                                        <circle cx="12" cy="12" r="10" fill="#B8DFC8" stroke="#168050" strokeWidth="1.8" />
                                                        <path d="M8.2 12.2L10.8 14.8L15.8 9.5" stroke="#168050" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={tier.id || tierVal}
                                        onClick={() => setActiveStep3Budget(tierVal)}
                                        className="text-[#6B6B6B] cursor-pointer hover:text-[#333333] transition-colors py-0.5"
                                    >
                                        <p className="font-satoshi text-[12px] sm:text-[12.5px] text-[#4A4A4A] leading-tight flex items-center gap-1.5">
                                            <span>{tier.label}</span>
                                        </p>
                                        <p className="font-satoshi text-[12.5px] sm:text-[13px] text-[#4A4A4A] font-normal mt-0 leading-tight flex items-center">
                                            {formatCurrency(tier.range)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Lead Capture Inputs */}
                        <div
                            className={
                                isHero
                                    ? "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
                                    : "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-2"
                            }
                        >
                            <div>
                                <label
                                    className={
                                        isHero
                                            ? "font-nohemi block text-[15px] sm:text-[16.5px] font-[450] text-[#1A1A1A] sm:text-[#1A1A1A] mb-2"
                                            : "font-nohemi block text-[12.5px] sm:text-[13.5px] font-normal text-[#111827] mb-1 sm:mb-1"
                                    }
                                >
                                    {form?.phoneLabel}
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    placeholder={form?.phonePlaceholder}
                                    className={
                                        isHero
                                            ? `font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border text-[13px] sm:text-[13.5px] text-black bg-[#F2F2F2] placeholder-[#444444] placeholder:text-[11.5px] sm:placeholder:text-[12.5px] transition-all duration-300 ease-out focus:outline-none ${phoneTouched && (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7)
                                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                : "border-[#CAC4D0] focus:border-[#18181B]"
                                            }`
                                            : `font-satoshi w-full px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-full border text-[12px] sm:text-[13px] text-[#111827] bg-[#F7F7F9] placeholder-[#444444] transition-all duration-200 focus:outline-none ${phoneTouched && (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7)
                                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                : "border-[#D1D5DB] focus:border-[#18181B]"
                                            }`
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    className={
                                        isHero
                                            ? "font-nohemi block text-[15px] sm:text-[16.5px] font-[450] text-[#1A1A1A] sm:text-[#1A1A1A] mb-2"
                                            : "font-nohemi block text-[12.5px] sm:text-[13.5px] font-normal text-[#111827] mb-1 sm:mb-1"
                                    }
                                >
                                    {form?.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={form?.emailPlaceholder}
                                    className={
                                        isHero
                                            ? "font-satoshi w-full px-5 py-3 sm:py-3.5 rounded-full border border-[#CAC4D0] focus:outline-none focus:border-[#18181B] text-[13px] sm:text-[13.5px] text-black bg-[#F2F2F2] placeholder-[#444444] placeholder:text-[11.5px] sm:placeholder:text-[12.5px] transition-all duration-300 ease-out"
                                            : "font-satoshi w-full px-3 sm:px-3.5 py-1.5 sm:py-2.5 rounded-full border border-[#D1D5DB] focus:outline-none focus:border-[#18181B] text-[12px] sm:text-[13px] text-[#111827] bg-[#F7F7F9] placeholder-[#444444] transition-all duration-200"
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        {step3Warning && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={
                                        isHero
                                            ? "flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12.5px] sm:text-[13px] font-satoshi font-medium mb-3 shadow-2xs"
                                            : "flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[11.5px] sm:text-[12.5px] font-satoshi font-medium mb-1.5 shadow-2xs"
                                    }
                                >
                                    <svg className="w-3.5 h-3.5 text-[#DC2626] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.5A.75.75 0 018 4.75zm0 6.5a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
                                    </svg>
                                    <span>{step3Warning}</span>
                                </motion.div>
                            )}

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-3 px-5 rounded-full bg-[#EBF7F2] border border-[#A7E2C7] text-[#168050] text-center font-satoshi text-[13.5px] sm:text-[14.5px] font-medium flex items-center justify-center gap-2 shadow-2xs mt-1"
                                >
                                    <svg className="w-4 h-4 text-[#168050] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{form?.successTitle || "We've received your details! We'll call you shortly."}</span>
                                </motion.div>
                            ) : (
                                <button
                                    type="button"
                                    data-no-callback="true"
                                    onClick={handleBookCallSubmit}
                                    disabled={isSubmitting}
                                    className={
                                        isHero
                                            ? `font-satoshi w-full bg-[#3145DD] hover:bg-[#2637b8] text-white font-medium py-2.5 sm:py-3 px-6 rounded-full transition-all duration-300 ease-out flex justify-center items-center gap-2 text-[15.5px] sm:text-[16px] shadow-sm hover:shadow-md cursor-pointer ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`
                                            : `font-satoshi w-full bg-[#242120] hover:bg-black text-white font-medium py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-full transition-all duration-200 flex justify-center items-center gap-2 text-[14px] sm:text-[15px] cursor-pointer shadow-md active:scale-[0.99] mt-3 sm:mt-2 ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            <span>{form?.submittingButtonLabel || "Submitting..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{form?.bookCallButtonLabel}</span>
                                            <span className={isHero ? "text-[17px]" : "text-[16px] sm:text-[17px]"}>→</span>
                                        </>
                                    )}
                                </button>
                            )}
                            {form?.disclaimer && (
                                <p
                                    className={
                                        isHero
                                            ? "text-center font-satoshi text-[12px] sm:text-[12.5px] text-[#777777] mt-3"
                                            : "text-center font-satoshi text-[10.5px] sm:text-[11.5px] text-[#111827] mt-1.5 sm:mt-1.5"
                                    }
                                >
                                    {form.disclaimer}
                                </p>
                            )}
                        </div>
                </div>
            )}
        </div>
    );
}
