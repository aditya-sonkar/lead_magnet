import type { QuoteFormData } from "./quote";
import type { MediaItem, Brand, CTALink } from "./common";

export type HeroSectionData = {
    heading: string;
    description: string;
    primaryCta: CTALink;
    brandsHeading?: string;
    brands: Brand[];
    quoteForm?: QuoteFormData | QuoteFormData[];
};

export type PainPoint = {
    id: number;
    title: string;
    description: string;
};

export type StorefrontProblemsData = {
    heading: string;
    description: string;
    items: PainPoint[];
    summary: string | any[];
    submitLabel: string;
    submitHref: string;
};

export type FAQItem = {
    id: number;
    question: string;
    answer: string;
};

export type FAQData = {
    heading: string;
    description?: string;
    items: FAQItem[];
};
