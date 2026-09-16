"use client";

import { useState } from "react";
import type { QuoteFormData, BudgetRange, FormOption } from "@/types";

export type { QuoteFormData, BudgetRange, FormOption };

export function useQuoteForm(form?: QuoteFormData | null) {
    // -- Form step ------------------------------------------------------------
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // -- Step 1 ---------------------------------------------------------------
    const [hasStore, setHasStore] = useState<boolean | null>(null);
    const [storeUrl, setStoreUrl] = useState("");
    const [step1Warning, setStep1Warning] = useState("");

    // -- Step 2 ---------------------------------------------------------------
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<string>("");
    const [otherIssues, setOtherIssues] = useState("");
    const [step2Warning, setStep2Warning] = useState("");
    const [issuesTouched, setIssuesTouched] = useState(false);
    const [budgetTouched, setBudgetTouched] = useState(false);

    // -- Step 3 ---------------------------------------------------------------
    const [activeStep3Budget, setActiveStep3Budget] = useState<string>("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [step3Warning, setStep3Warning] = useState("");
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // -- Derived lists (CMS-only) ----------------------------------------------
    const issuesList: FormOption[] =
        form?.issueOptions && form.issueOptions.length > 0 ? form.issueOptions : [];
    const budgetList: BudgetRange[] =
        form?.budgetRanges && form.budgetRanges.length > 0 ? form.budgetRanges : [];

    // -- Reset (for modal reopen) ----------------------------------------------
    const resetForm = () => {
        setStep(1);
        setHasStore(null);
        setStoreUrl("");
        setStep1Warning("");
        setSelectedIssues([]);
        setSelectedBudget("");
        setOtherIssues("");
        setStep2Warning("");
        setIssuesTouched(false);
        setBudgetTouched(false);
        setActiveStep3Budget("");
        setPhone("");
        setEmail("");
        setStep3Warning("");
        setPhoneTouched(false);
        setIsSubmitted(false);
        setIsSubmitting(false);
    };

    // -- Step 2 handlers -------------------------------------------------------
    const toggleIssue = (label: string) => {
        setSelectedIssues((prev) => {
            const next = prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label];
            if (next.length > 0) {
                setIssuesTouched(false);
                if (selectedBudget) {
                    setStep2Warning("");
                } else if (budgetTouched) {
                    setStep2Warning(form?.budgetWarning || "");
                }
            }
            return next;
        });
    };

    const handleSelectBudget = (value: string) => {
        setSelectedBudget((prev) => {
            const next = prev === value ? "" : value;
            setActiveStep3Budget(next);
            return next;
        });
        setBudgetTouched(false);
        if (selectedIssues.length > 0) {
            setStep2Warning("");
        } else if (issuesTouched) {
            setStep2Warning(form?.issuesWarning || "");
        }
    };

    // -- Step navigation -------------------------------------------------------
    const handleStep1Continue = () => {
        if (hasStore === null) {
            setStep1Warning(form?.storeWarning || "");
            return;
        }
        setStep1Warning("");
        setStep(2);
    };

    const handleStep2Continue = () => {
        const hasNoIssues = selectedIssues.length === 0;
        const hasNoBudget = !selectedBudget;

        if (hasNoIssues && hasNoBudget) {
            setIssuesTouched(true);
            setBudgetTouched(true);
            setStep2Warning(form?.selectionWarning || "");
            return;
        }
        if (hasNoIssues) {
            setIssuesTouched(true);
            setStep2Warning(form?.issuesWarning || "");
            return;
        }
        if (hasNoBudget) {
            setBudgetTouched(true);
            setStep2Warning(form?.budgetWarning || "");
            return;
        }

        setIssuesTouched(false);
        setBudgetTouched(false);
        setStep2Warning("");
        setActiveStep3Budget(selectedBudget);
        setStep(3);
    };

    // -- Step 3 handlers -------------------------------------------------------
    const handlePhoneChange = (val: string) => {
        setPhone(val);
        if (val.trim().replace(/\D/g, "").length >= 7) {
            setStep3Warning("");
            setPhoneTouched(false);
        }
    };

    const handleBookCallSubmit = async (e?: React.MouseEvent | React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isSubmitting) return;

        setPhoneTouched(true);
        const cleanDigits = phone.trim().replace(/\D/g, "");
        if (!phone.trim() || cleanDigits.length < 7) {
            setStep3Warning(form?.phoneWarning || "");
            return;
        }
        setStep3Warning("");
        setIsSubmitting(true);

        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    email,
                    storeUrl,
                    selectedProblems: selectedIssues,
                    selectedBudget: activeStep3Budget || selectedBudget,
                    otherNotes: otherIssues,
                    source: "Hero Quote Form",
                }),
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission failed:", error);
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // -- Currency formatter ----------------------------------------------------
    const formatCurrency = (text?: string): React.ReactNode => {
        if (!text) return "";
        const numbers = text.match(/[\d,]+/g);
        if (numbers && numbers.length >= 2) {
            return (
                <span className="inline-flex items-baseline whitespace-nowrap">
                    <span className="inline-flex items-baseline">
                        <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>₹</span>
                        <span>{numbers[0]}</span>
                    </span>
                    <span className="ml-1 sm:ml-1.5 text-current select-none">-</span>
                    <span className="inline-flex items-baseline">
                        <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>₹</span>
                        <span>{numbers[1]}</span>
                    </span>
                </span>
            );
        }
        if (numbers && numbers.length === 1) {
            return (
                <span className="inline-flex items-baseline whitespace-nowrap">
                    <span className="font-inter font-normal text-[0.92em] mr-[1.5px] select-none" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>₹</span>
                    <span>{numbers[0]}</span>
                </span>
            );
        }
        return text;
    };

    return {
        // State
        step, setStep,
        hasStore, setHasStore,
        storeUrl, setStoreUrl,
        selectedIssues,
        selectedBudget,
        activeStep3Budget, setActiveStep3Budget,
        otherIssues, setOtherIssues,
        phone, email, setEmail,
        isSubmitted, setIsSubmitted,
        isSubmitting,
        // Warnings
        step1Warning, setStep1Warning,
        step2Warning,
        step3Warning,
        issuesTouched,
        budgetTouched,
        phoneTouched,
        // Derived
        issuesList,
        budgetList,
        // Handlers
        resetForm,
        toggleIssue,
        handleSelectBudget,
        handleStep1Continue,
        handleStep2Continue,
        handlePhoneChange,
        handleBookCallSubmit,
        formatCurrency,
    };
}
