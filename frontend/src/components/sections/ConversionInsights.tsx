"use client";

import { getMediaUrl, getMediaDimensions } from "@/lib/strapi";
import Image from "next/image";

type InsightCard = {
    id: number;
    title: string;
    description: string;
    mobileDescription?: string;
    MobileDescription?: string;
    image?: {
        url: string;
        alternativeText?: string | null;
    };
};

type ConversionInsightsData = {
    heading: string;
    description: string;
    MobileHeading?: string;
    mobileHeading?: string;
    MobileDescription?: string;
    mobileDescription?: string;
    cards: InsightCard[];
};

function formatCardTitle(title: string) {
    if (!title) return "";
    const clean = title.replace(/\s+/g, " ").trim();
    if (/full[-–—]?price\s+conversion\s+as\s+the\s+objective/i.test(clean)) {
        return <>Full-price conversion as<br className="hidden sm:inline" /> the objective</>;
    }
    if (/the\s+phone\s+as\s+the\s+primary\s+storefront/i.test(clean)) {
        return <>The phone as the primary<br className="hidden sm:inline" /> storefront</>;
    }
    if (/built\s+for\s+a\s+team\s+that\s+trades\s+through\s+peak/i.test(clean)) {
        return <>Built for a team that trades<br className="hidden sm:inline" /> through peak</>;
    }
    return title;
}

function formatCardDescription(desc: string) {
    if (!desc) return null;
    return desc;
}

export default function ConversionInsights({
    data,
}: {
    data: ConversionInsightsData;
}) {
    if (!data) return null;
    const mobileHeading = data.MobileHeading || data.mobileHeading;
    const mobileDesc = data.MobileDescription || data.mobileDescription;
    const cards = data.cards || [];

    return (
        <section className="w-full bg-white px-5 sm:px-6 pt-10 pb-20 lg:px-[60px] xl:px-[80px] lg:pt-[55px] xl:pt-[60px] lg:pb-[100px] xl:pb-[110px]">
            <div className="mx-auto max-w-[1720px] w-full">
                <div className="w-full max-w-[1200px]">
                    {mobileHeading ? (
                        <>
                            <h2 className="block md:hidden font-delight text-[clamp(26px,7.5vw,40px)] font-medium leading-[1.2] tracking-[-0.01em] text-[#0F1D07]">
                                {mobileHeading}
                            </h2>
                            <h2 className="hidden md:block font-delight text-[clamp(36px,4.2vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] text-[#0F1D07]">
                                {data.heading}
                            </h2>
                        </>
                    ) : (
                        <h2 className="font-delight text-[clamp(26px,7.5vw,40px)] md:text-[clamp(36px,4.2vw,65px)] font-medium leading-[1.15] tracking-[-0.015em] text-[#0F1D07]">
                            {data.heading}
                        </h2>
                    )}

                    {mobileDesc ? (
                        <>
                            <p className="block md:hidden font-satoshi font-medium mt-5 w-full whitespace-pre-line text-pretty text-[clamp(13px,3.6vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {mobileDesc}
                            </p>
                            <p className="hidden md:block font-satoshi font-medium mt-5 w-full max-w-[1165px] whitespace-pre-line text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                                {data.description}
                            </p>
                        </>
                    ) : (
                        <p className="font-satoshi font-medium mt-5 w-full max-w-[1165px] whitespace-pre-line text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#0F1D07]">
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-[72px] xl:mt-[80px] grid grid-cols-1 gap-5 sm:gap-6 md:gap-6 lg:grid-cols-3 lg:gap-10 xl:gap-11 2xl:gap-12 w-full">
                    {cards.map((card, index) => {
                        const imageUrl = getMediaUrl(card.image);
                        const dims = getMediaDimensions(card.image) || { width: 800, height: 600 };
                        const isDark = index === 0;
                        const bgColors = ["bg-[#014051]", "bg-[#B4BCFE]", "bg-[#D1E6D1]"];
                        const bgColor = bgColors[index % bgColors.length];
                        const textColor = isDark ? "text-white" : "text-[#0F1D07]";
                        const descriptionColor = isDark ? "text-[#FFFFFFC7]" : "text-black";
                        const descriptionWeight = index === 0 ? "font-normal" : "font-medium";
                        const cardMobileDesc = card.mobileDescription || card.MobileDescription;

                        const getImageClass = (idx: number) => {
                            if (idx === 0) {
                                return "h-full max-h-[90px] min-[460px]:max-h-[104px] sm:max-h-[114px] lg:max-h-[142px] min-[1750px]:max-h-[170px] w-auto max-w-full object-contain object-left-top translate-y-1 sm:translate-y-1 lg:translate-y-1.5";
                            }
                            if (idx === 1) {
                                return "h-full max-h-[92px] min-[460px]:max-h-[105px] sm:max-h-[116px] lg:max-h-[148px] min-[1750px]:max-h-[178px] w-auto max-w-full object-contain object-left-top";
                            }
                            return "h-full max-h-[94px] min-[460px]:max-h-[108px] sm:max-h-[120px] lg:max-h-[156px] max-w-[152px] min-[1750px]:max-w-none min-[1750px]:max-h-[186px] w-auto object-contain object-left-top";
                        };

                        const getContainerPadding = (idx: number) => {
                            if (idx === 0 || idx === 1) {
                                return "p-[22px_20px_0] min-[460px]:p-[24px_24px_0] sm:p-[26px_28px_0] md:p-[28px_32px_0] lg:px-8 lg:pt-11 lg:pb-0 min-[1750px]:px-10 min-[1750px]:pt-12";
                            }
                            return "p-[18px_20px_0] min-[460px]:p-[20px_24px_0] sm:p-[22px_28px_0] md:p-[24px_32px_0] lg:px-8 lg:pt-8 lg:pb-0 min-[1750px]:px-10 min-[1750px]:pt-10";
                        };

                        const descMaxWidth = index === 2
                            ? "max-w-none lg:max-w-[345px] min-[1750px]:max-w-[375px] min-[2000px]:max-w-none"
                            : "max-w-none lg:max-w-[330px] min-[1750px]:max-w-[360px] min-[2000px]:max-w-none";

                        return (
                            <article
                                key={card.id}
                                className={`overflow-hidden rounded-[16px] md:rounded-[20px] lg:rounded-[24px] ${bgColor} ${textColor} flex flex-col justify-start w-full min-h-0 lg:min-h-[425px] min-[1750px]:min-h-[475px]`}
                            >
                                {imageUrl && (
                                    <div className={`w-full flex justify-start items-start ${getContainerPadding(index)} h-[125px] min-[460px]:h-[138px] sm:h-[148px] lg:h-[196px] min-[1750px]:h-[235px] shrink-0`}>
                                        <Image
                                            src={imageUrl}
                                            alt={card.image?.alternativeText || ""}
                                            width={dims.width}
                                            height={dims.height}
                                            className={getImageClass(index)}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col justify-start flex-grow p-[14px_20px_20px] min-[460px]:p-[16px_24px_22px] sm:p-[18px_28px_22px] md:p-[18px_32px_24px] lg:px-8 lg:pt-5 lg:pb-9 min-[1750px]:px-10 min-[1750px]:pt-7 min-[1750px]:pb-11">
                                    <h3 className={`font-nohemi font-normal whitespace-pre-line ${textColor} text-[clamp(19px,2.4vw,23.5px)] lg:text-[26.5px] leading-[1.22] tracking-[-0.02em] mb-2 sm:mb-2.5 lg:mb-3.5 min-[1750px]:mb-3.5 min-h-[auto] lg:min-h-[66px] min-[1750px]:min-h-[66px] w-full flex items-start`}>
                                        {formatCardTitle(card.title)}
                                    </h3>

                                    {cardMobileDesc ? (
                                        <>
                                            <p className={`block md:hidden font-satoshi text-[clamp(12.5px,1.7vw,14.2px)] leading-[1.55] whitespace-pre-line text-pretty w-full ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {cardMobileDesc}
                                            </p>
                                            <p className={`hidden md:block font-satoshi insight-card-desc text-[clamp(12.5px,0.85vw,14.3px)] min-[1750px]:text-[14.8px] leading-[1.55] whitespace-pre-line text-pretty w-full ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                                {formatCardDescription(card.description)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className={`font-satoshi insight-card-desc text-[clamp(12.5px,0.85vw,14.3px)] min-[1750px]:text-[14.8px] leading-[1.55] whitespace-pre-line text-pretty w-full ${descMaxWidth} ${descriptionWeight} ${descriptionColor}`}>
                                            {formatCardDescription(card.description)}
                                        </p>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}