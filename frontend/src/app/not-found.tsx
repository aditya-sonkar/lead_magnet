import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#37386B] text-white flex flex-col items-center justify-center text-center px-6 selection:bg-white/20">
            <span className="font-satoshi text-white/50 text-xs sm:text-sm uppercase tracking-[0.2em] mb-4">
                404 — Page Not Found
            </span>
            <h1 className="font-nohemi text-white text-[clamp(32px,6vw,56px)] font-normal tracking-[-0.01em] leading-tight mb-4 max-w-[580px]">
                Looks like this page doesn’t exist
            </h1>
            <p className="font-satoshi font-light text-white/70 text-sm sm:text-base max-w-[420px] mb-8 leading-relaxed">
                The link you followed may be broken, or the page has been moved. Let’s get you back on track.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full font-satoshi font-medium text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
                Return to Homepage
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>
        </main>
    );
}
