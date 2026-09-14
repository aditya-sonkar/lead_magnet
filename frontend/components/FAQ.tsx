"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = {
    id: number;
    question: string;
    answer: string;
};

type FaqData = {
    heading: string;
    items: FaqItem[];
    mobileItems?: FaqItem[];
};

export default function FAQ({
    data,
}: {
    data: FaqData;
}) {
    if (!data) return null;
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);

    const hasMobileItems = Boolean(data?.mobileItems && data.mobileItems.length > 0);
    const desktopItems = data?.items || [];
    const mobileItems = hasMobileItems ? data.mobileItems! : desktopItems;

    return (
        <section className="px-6 pt-14 pb-20 sm:pb-24 lg:py-24 lg:px-[60px] xl:px-[80px]">
            <div className="w-full mx-auto max-w-[1720px]">
                <div>
                    <h2 className="font-nohemi font-normal text-[clamp(32px,4.2vw,52px)] leading-tight">
                        {data.heading}
                    </h2>
                </div>

                {/* Desktop FAQ Items */}
                <div className={`mt-1 sm:mt-3 ${hasMobileItems ? "hidden md:block" : "block"}`}>
                    {desktopItems.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={item.id}
                                className="border-b border-[#000000]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="flex w-full items-center justify-between py-3.5 sm:py-5 md:py-6 text-left cursor-pointer"
                                >
                                    <span className="font-nohemi text-[clamp(15.5px,3.8vw,18px)] sm:text-[clamp(18px,2.2vw,21px)] md:text-[clamp(21px,1.8vw,25px)] font-medium text-[#000000] pr-4 leading-[1.32] tracking-[-0.01em]">
                                        {item.question}
                                    </span>

                                    <span
                                        className={`inline-block text-[28px] sm:text-[34px] md:text-[42px] leading-none select-none transition-transform duration-300 ease-in-out text-black font-light shrink-0 ${isOpen ? "rotate-45" : "rotate-0"
                                            }`}
                                    >
                                        +
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-6 pr-12">
                                                <p className="max-w-[700px] font-satoshi text-[clamp(15.5px,1.2vw,18px)] text-[#000000] leading-[1.6]">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile FAQ Items (displayed on small screens) */}
                {hasMobileItems && (
                    <div className="mt-1 sm:mt-3 block md:hidden">
                        {mobileItems.map((item, index) => {
                            const isOpen = openMobileIndex === index;

                            return (
                                <div
                                    key={item.id}
                                    className="border-b border-[#000000]"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenMobileIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between py-3.5 sm:py-5 text-left cursor-pointer"
                                    >
                                        <span className="font-satoshi text-[clamp(15px,3.6vw,17.5px)] font-medium text-[#000000] pr-4 leading-[1.32]">
                                            {item.question}
                                        </span>

                                        <span
                                            className={`inline-block text-[28px] sm:text-[34px] leading-none select-none transition-transform duration-300 ease-in-out text-black font-light shrink-0 ${isOpen ? "rotate-45" : "rotate-0"
                                                }`}
                                        >
                                            +
                                        </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-5 pr-6">
                                                    <p className="font-satoshi text-[clamp(13.5px,1.05vw,15px)] text-[#000000] leading-[1.6]">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
