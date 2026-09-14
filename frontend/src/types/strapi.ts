import type { HeroSectionData, StorefrontProblemsData, FAQData } from "./sections";
import type { QuoteFormData } from "./quote";

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

export type LandingPageData = {
    header?: HeaderData;
    footer?: FooterData;
    hero?: HeroSectionData;
    storefrontProblems?: StorefrontProblemsData;
    conversionInsights?: any;
    workShowcase?: any;
    engagementFit?: any;
    ourWork?: any;
    ourProcess?: any;
    faq?: FAQData;
    finalCTA?: any;
    stickyCTA?: {
        text?: string;
        callbackForm?: any;
    };
    callbackForm?: any;
    sections?: any[];
};
