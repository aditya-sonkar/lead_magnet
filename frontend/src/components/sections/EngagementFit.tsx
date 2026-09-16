type FitPoint = {
    id: number;
    text: string;
};

type EngagementFitData = {
    heading: string;
    description: string;
    suitableHeading: string;
    suitablePoints: FitPoint[];
    notSuitableHeading: string;
    notSuitablePoints: FitPoint[];
};

function formatHeading(heading: string) {
    if (!heading) return null;
    const text = heading.replace(/\\n/g, "\n").trim();

    // 1. If CMS explicitly provides line breaks, honor them
    if (text.includes("\n")) {
        const lines = text.split("\n");
        return (
            <>
                {lines.map((line, idx) => (
                    <span key={idx} className={`block whitespace-normal sm:whitespace-nowrap ${idx < lines.length - 1 ? "mb-1 sm:mb-1.5" : ""}`}>
                        {line}
                    </span>
                ))}
            </>
        );
    }

    // 2. Split compound heading at natural clause boundary for balanced typography
    const commaIndex = text.indexOf(",");
    if (commaIndex !== -1) {
        const firstClause = text.slice(0, commaIndex + 1).trim();
        const secondClause = text.slice(commaIndex + 1).trim();
        const words = firstClause.split(/\s+/);

        if (words.length >= 3) {
            const line1 = words.slice(0, 2).join(" ");
            const line2 = words.slice(2).join(" ");
            return (
                <>
                    <span className="block sm:inline min-[1140px]:block mb-1 sm:mb-0 min-[1140px]:mb-1.5">{line1} </span>
                    <span className="block sm:inline min-[1140px]:block mb-1 sm:mb-0 min-[1140px]:mb-1.5">{line2}</span>
                    <br className="hidden sm:block min-[1140px]:hidden" />
                    <span className="block min-[360px]:whitespace-nowrap whitespace-normal">{secondClause}</span>
                </>
            );
        }

        return (
            <>
                <span className="block mb-1 sm:mb-1.5">{firstClause}</span>
                <span className="block min-[360px]:whitespace-nowrap whitespace-normal">{secondClause}</span>
            </>
        );
    }

    return <span className="block text-pretty">{text}</span>;
}

function formatDescription(description: string) {
    if (!description) return null;
    const text = description.replace(/\\n/g, "\n").trim();

    // 1. If CMS explicitly provides line breaks, honor them
    if (text.includes("\n")) {
        return (
            <>
                {text.split("\n").map((line, idx) => (
                    <span key={idx} className="block whitespace-normal">
                        {line}
                    </span>
                ))}
            </>
        );
    }

    // 2. Dynamic typographic line balancing for desktop
    // Dynamically balances paragraph lines for editorial presentation across viewports
    const words = text.split(/\s+/);
    if (words.length <= 15) {
        return <span className="block text-pretty">{text}</span>;
    }

    const lines: string[] = [];
    const remainingWords = [...words];
    const totalLinesNeeded = 4;

    for (let lineIndex = 0; lineIndex < totalLinesNeeded - 1; lineIndex++) {
        const remainingChars = remainingWords.join(" ").length;
        const remainingLines = totalLinesNeeded - lineIndex;
        // Balance leading lines up to ~73 chars, then balance trailing lines
        const targetLen = remainingLines > 2 ? 72 : Math.round(remainingChars / remainingLines);

        let currentWords: string[] = [];
        let currentLen = 0;

        while (remainingWords.length > (remainingLines - 1)) {
            const nextWord = remainingWords[0];
            const candidateLen = currentLen + (currentLen > 0 ? 1 : 0) + nextWord.length;

            if (currentWords.length > 0) {
                if (remainingLines > 2) {
                    if (candidateLen > 73) {
                        break;
                    }
                } else {
                    if (candidateLen > 66) {
                        break;
                    }
                }
            }

            currentWords.push(remainingWords.shift()!);
            currentLen = candidateLen;

            // Natural pause boundary (e.g. em-dash clause)
            if (nextWord.endsWith("—") && currentLen >= 50) {
                break;
            }
        }

        if (currentWords.length > 0) {
            lines.push(currentWords.join(" "));
        }
    }

    if (remainingWords.length > 0) {
        lines.push(remainingWords.join(" "));
    }

    return (
        <>
            {lines.map((line, idx) => (
                <span key={idx} className="inline min-[1140px]:block min-[1140px]:whitespace-nowrap">
                    {line}{" "}
                </span>
            ))}
        </>
    );
}

function formatPointText(text: string) {
    if (!text) return null;
    return text.replace(/\\n/g, "\n");
}

function TickIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 26 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M0.75 13.5625L6.72917 19.5417L24.6667 0.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function EngagementFit({
    data,
}: {
    data: EngagementFitData;
}) {
    if (!data) return null;
    const suitableCount = data.suitablePoints?.length || 0;
    const notSuitableCount = data.notSuitablePoints?.length || 0;
    const totalPointRows = Math.max(suitableCount, notSuitableCount, 5);

    return (
        <section className="px-6 py-14 sm:py-16 lg:py-[200px] xl:py-[220px] bg-white lg:px-[60px] xl:px-[80px]">
            <div className="mx-auto w-full max-w-[1720px]">
                <div className="flex flex-col min-[1140px]:flex-row items-start justify-between gap-8 min-[1140px]:gap-[clamp(50px,5vw,120px)] w-full">
                    {/* Left Column: Heading & Description (anchored to left corner) */}
                    <div className="flex flex-col w-full min-[1140px]:w-[clamp(370px,33vw,540px)] shrink-0">
                        <h2 className="heading-engagement-fit font-delight font-medium tracking-[-0.015em] text-[#0f1d07] mb-4 lg:mb-5 xl:mb-6 max-w-full">
                            {formatHeading(data.heading)}
                        </h2>
                        <p
                            className="font-satoshi font-medium text-black text-[clamp(13.5px,1.06vw,16.2px)] leading-[1.62] xl:leading-[1.68] w-full"
                            style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 500, color: "#000000" }}
                        >
                            {formatDescription(data.description)}
                        </p>
                    </div>

                    {/* Right Column: 2 Cards */}
                    <div
                        className="sync-engagement-cards grid grid-cols-1 sm:grid-cols-[1fr_1.03fr] gap-5 sm:gap-x-6 lg:gap-x-[30px] xl:gap-x-[34px] gap-y-4 sm:gap-y-[17.5px] xl:gap-y-[18.5px] items-stretch w-full min-[1140px]:max-w-[660px] xl:max-w-[690px] 2xl:max-w-[710px] -mt-2 sm:-mt-2.5 lg:-mt-3 xl:-mt-3.5 2xl:-mt-4"
                        style={{ '--point-rows': totalPointRows } as React.CSSProperties}
                    >
                        {/* Card 1: Suitable */}
                        <div className="sync-engagement-card rounded-[10px] bg-[#EEF1FA] border border-[#C8C8C8] px-3.5 sm:px-4 lg:px-4 xl:px-4.5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-5 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 lg:bg-[#EFF0FC] flex flex-col h-full overflow-hidden">
                            <h3 className="font-delight text-[clamp(19.5px,5.4vw,22.5px)] sm:text-[clamp(15px,1.4vw,23px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-1 tracking-[-0.01em] xl:whitespace-nowrap flex items-start translate-x-0 sm:-translate-x-1">
                                {data.suitableHeading}
                            </h3>
                            <ul className="space-y-5 sm:space-y-0 sm:contents">
                                {(data.suitablePoints || []).map((point) => (
                                     <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                         <TickIcon
                                             className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-4 text-black sm:text-[#0F1D07]"
                                         />
                                         <span
                                             className="block flex-1 font-satoshi font-normal text-[14.8px] sm:text-[clamp(13.5px,1.0vw,15px)] text-black leading-[1.42] sm:leading-[1.4] whitespace-pre-line min-[1140px]:max-w-[255px] xl:max-w-[262px]"
                                             style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400, color: "#000000" }}
                                         >
                                             {formatPointText(point.text)}
                                         </span>
                                     </li>
                                 ))}
                            </ul>
                        </div>

                        {/* Card 2: Not Suitable */}
                        <div className="sync-engagement-card rounded-[10px] bg-white border border-[#C8C8C8] px-3.5 sm:px-4 lg:px-4 xl:px-5 pt-3 sm:pt-3.5 lg:pt-3 xl:pt-3.5 2xl:pt-4 pb-5 sm:pb-4.5 lg:pb-4 xl:pb-4.5 2xl:pb-5 flex flex-col h-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
                            <h3 className="font-delight text-[clamp(18.5px,5.15vw,21.5px)] sm:text-[clamp(15px,1.4vw,23px)] font-medium text-black lg:text-[#1A1A1A] leading-[1.25] mb-4.5 sm:mb-1 tracking-[-0.01em] xl:whitespace-nowrap flex items-start translate-x-0 sm:-translate-x-1">
                                {data.notSuitableHeading}
                            </h3>
                            <ul className="space-y-5 sm:space-y-0 sm:contents">
                                {(data.notSuitablePoints || []).map((point) => (
                                     <li key={point.id} className="flex items-start gap-2.5 sm:gap-3">
                                         <TickIcon
                                             className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] shrink-0 mt-4 text-black sm:text-[#0F1D07]"
                                         />
                                         <span
                                             className="block flex-1 font-satoshi font-normal text-[14.8px] sm:text-[clamp(13.5px,1.0vw,15px)] text-black leading-[1.42] sm:leading-[1.4] whitespace-pre-line min-[1140px]:max-w-[244px] xl:max-w-[250px]"
                                             style={{ fontFamily: "var(--font-satoshi), Satoshi, sans-serif", fontWeight: 400, color: "#000000" }}
                                         >
                                             {formatPointText(point.text)}
                                         </span>
                                     </li>
                                 ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}