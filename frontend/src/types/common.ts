export type CTALink = {
    label: string;
    href: string;
};

export type MediaItem = {
    id?: number;
    url: string;
    alternativeText?: string;
};

export type Brand = {
    id: number;
    name: string;
    logo: {
        url: string;
    };
};

export type FormOption = {
    id?: number;
    label: string;
    sublabel?: string;
    value: string;
};
