"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application runtime error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-[#37386B] text-white flex flex-col items-center justify-center text-center px-6 selection:bg-white/20">
            <span className="font-satoshi text-white/50 text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">
                Something went wrong
            </span>
            <h1 className="font-nohemi text-white text-[clamp(28px,5vw,48px)] font-normal tracking-[-0.01em] leading-tight mb-4 max-w-[540px]">
                An unexpected error occurred
            </h1>
            <p className="font-satoshi font-light text-white/70 text-sm sm:text-base max-w-[420px] mb-8 leading-relaxed">
                We’re sorry for the inconvenience. You can try refreshing the view or return to the homepage.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full font-satoshi font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-full font-satoshi font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer border border-white/15"
                >
                    Return Home
                </Link>
            </div>
        </main>
    );
}
