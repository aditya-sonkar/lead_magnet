import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCallbackForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_callback_forms';
  info: {
    description: 'Content for the Book a Free Call / Get a callback modal';
    displayName: 'CallbackForm';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Book My Free Call'>;
    closeButtonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Let\u2019s make something amazing together.\nBook a call - we\u2019ve got coffee (or tea) ready and are always up for a good conversation.'>;
    disclaimer: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"We'll reach out within 24 hours \u2014 no spam, just expert guidance.">;
    emailLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Email'>;
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Enter Email'>;
    phoneLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Phone Number'>;
    phonePlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Enter Phone Number'>;
    shopifyLinkLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Shopify Link (Optional)'>;
    shopifyLinkPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Enter Shopify link'>;
    submittingButtonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Submitting...'>;
    successDescription: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"We'll reach out within 24 hours \u2014 no spam, just expert guidance.">;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Thank you! We've received your request.">;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get a callback'>;
  };
}

export interface SectionsConversionInsights extends Struct.ComponentSchema {
  collectionName: 'components_sections_conversion_insights';
  info: {
    displayName: 'ConversionInsights';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.insight-card', true>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    mobileDescription: Schema.Attribute.Text;
    mobileHeading: Schema.Attribute.String;
  };
}

export interface SectionsEngagementFit extends Struct.ComponentSchema {
  collectionName: 'components_sections_engagement_fits';
  info: {
    displayName: 'engagement-fit';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    notSuitableHeading: Schema.Attribute.String;
    notSuitablePoints: Schema.Attribute.Component<'shared.fit-point', true>;
    suitableHeading: Schema.Attribute.String;
    suitablePoints: Schema.Attribute.Component<'shared.fit-point', true>;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.faq-item', true>;
  };
}

export interface SectionsFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_final_ctas';
  info: {
    displayName: 'FinalCTA';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    logos: Schema.Attribute.Component<'shared.final-cta-logo', true>;
    mobileHeading: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
  };
}

export interface SectionsFooter extends Struct.ComponentSchema {
  collectionName: 'components_sections_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    contactHeading: Schema.Attribute.String;
    contacts: Schema.Attribute.Component<'shared.footer-contact', true>;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    marqueeText: Schema.Attribute.String;
    Newsletter: Schema.Attribute.Component<'shared.footer-link', false>;
    privacyLink: Schema.Attribute.Component<'shared.footer-link', false>;
    quickLinks: Schema.Attribute.Component<'shared.footer-link', true>;
    quickLinksHeading: Schema.Attribute.String;
    sayHi: Schema.Attribute.String;
    socialLinks: Schema.Attribute.Component<'shared.social-link', true>;
    termsLink: Schema.Attribute.Component<'shared.footer-link', false>;
  };
}

export interface SectionsHeader extends Struct.ComponentSchema {
  collectionName: 'components_sections_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    logoText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Thumbstack.'>;
    quickLinks: Schema.Attribute.Component<'shared.footer-link', true>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    brands: Schema.Attribute.Component<'shared.brand', true>;
    brandsHeading: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.Text;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    quoteForm: Schema.Attribute.Component<'sections.quote-form', true>;
  };
}

export interface SectionsOurProcess extends Struct.ComponentSchema {
  collectionName: 'components_sections_our_processes';
  info: {
    displayName: 'OurProcess';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.process-card', true>;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    marqueeItems: Schema.Attribute.Component<'shared.marquee-item', true>;
    video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SectionsOurWork extends Struct.ComponentSchema {
  collectionName: 'components_sections_our_works';
  info: {
    displayName: 'OurWork';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    projects: Schema.Attribute.Component<'sections.our-work-project', true>;
  };
}

export interface SectionsOurWorkProject extends Struct.ComponentSchema {
  collectionName: 'components_sections_our_work_projects';
  info: {
    displayName: 'OurWorkProject';
  };
  attributes: {
    images: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    mobileImages: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface SectionsQuoteForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_quote_forms';
  info: {
    displayName: 'QuoteForm';
  };
  attributes: {
    basedOnLabel: Schema.Attribute.String;
    bookCallButtonLabel: Schema.Attribute.String;
    budgetHint: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'(choose one)'>;
    budgetLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Select your budget range'>;
    budgetRanges: Schema.Attribute.Component<'shared.budget-range', true>;
    budgetWarning: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please select your preferred budget range'>;
    closeButtonLabel: Schema.Attribute.String;
    continueLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    disclaimer: Schema.Attribute.Text;
    emailLabel: Schema.Attribute.String;
    emailPlaceholder: Schema.Attribute.String;
    estimateButtonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get My Estimate'>;
    estimateLabel: Schema.Attribute.String;
    issueOptions: Schema.Attribute.Component<'shared.form-option', true>;
    issuesHint: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'(multiple options)'>;
    issuesLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'What needs Improvement ?'>;
    issuesWarning: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please select at least one issue that needs improvement'>;
    noLabel: Schema.Attribute.String;
    otherIssuesLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Other issues (optional)'>;
    otherIssuesPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Any other issues your shopify store is facing'>;
    phoneLabel: Schema.Attribute.String;
    phonePlaceholder: Schema.Attribute.String;
    phoneWarning: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please enter a valid phone number'>;
    resultDescription: Schema.Attribute.Text;
    resultTitle: Schema.Attribute.String;
    selectionWarning: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please select what needs improvement and your budget range'>;
    shopifyLinkLabel: Schema.Attribute.String;
    shopifyLinkPlaceholder: Schema.Attribute.String;
    shopifyQuestion: Schema.Attribute.String;
    shopifyQuestionHint: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'(choose one)'>;
    step2Description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Select what\u2019s not working and your preferred budget.'>;
    step2Label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Budget range'>;
    step2Title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Choose your budget range'>;
    step3Label: Schema.Attribute.String;
    stepLabel: Schema.Attribute.String;
    storeWarning: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Please select whether you own a Shopify website'>;
    submittingButtonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Submitting...'>;
    successDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'We will review your store setup and get back to you shortly.'>;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Thank you! We've received your request.">;
    title: Schema.Attribute.String;
    yesLabel: Schema.Attribute.String;
  };
}

export interface SectionsStickyCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_sticky_ctas';
  info: {
    displayName: 'StickyCTA';
  };
  attributes: {
    callbackForm: Schema.Attribute.Component<'sections.callback-form', false>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    text: Schema.Attribute.String;
  };
}

export interface SectionsStorefrontProblems extends Struct.ComponentSchema {
  collectionName: 'components_sections_storefront_problems';
  info: {
    displayName: 'StorefrontProblems';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.pain-point', true>;
    submitHref: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String;
    summary: Schema.Attribute.Component<'sections.summary', true>;
    warningMessage: Schema.Attribute.String;
  };
}

export interface SectionsSummary extends Struct.ComponentSchema {
  collectionName: 'components_sections_summaries';
  info: {
    displayName: 'Summary';
  };
  attributes: {
    state: Schema.Attribute.Enumeration<
      ['default', 'one', 'two', 'three', 'multiple']
    > &
      Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsWorkShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_work_showcases';
  info: {
    displayName: 'WorkShowcase';
  };
  attributes: {
    Before: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.showcase-item', true>;
    mobileDescription: Schema.Attribute.Text;
  };
}

export interface SharedBrand extends Struct.ComponentSchema {
  collectionName: 'components_shared_brands';
  info: {
    displayName: 'Brand';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface SharedBudgetRange extends Struct.ComponentSchema {
  collectionName: 'components_shared_budget_ranges';
  info: {
    description: 'Budget range option with label, price range, and value';
    displayName: 'BudgetRange';
  };
  attributes: {
    label: Schema.Attribute.String;
    range: Schema.Attribute.String;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'CTA';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'FaqItem';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface SharedFinalCtaLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_final_cta_logos';
  info: {
    displayName: 'FinalCTALogo';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedFitPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_fit_points';
  info: {
    displayName: 'fit-point';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedFooterContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_contacts';
  info: {
    displayName: 'FooterContact';
  };
  attributes: {
    Address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    location: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface SharedFormOption extends Struct.ComponentSchema {
  collectionName: 'components_shared_form_options';
  info: {
    description: 'Form option with label and value';
    displayName: 'FormOption';
  };
  attributes: {
    label: Schema.Attribute.String;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedInsightCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_insight_cards';
  info: {
    displayName: 'InsightCard';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedMarqueeItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_marquee_items';
  info: {
    displayName: 'MarqueeItem';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedPainPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_pain_points';
  info: {
    displayName: 'PainPoint';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedProcessCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_cards';
  info: {
    displayName: 'ProcessCard';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    services: Schema.Attribute.Component<'shared.process-service', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedProcessService extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_services';
  info: {
    displayName: 'ProcessService';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search Engine Optimization metadata';
    displayName: 'SEO';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedServices extends Struct.ComponentSchema {
  collectionName: 'components_shared_services';
  info: {
    displayName: 'services';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedShowcaseItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_showcase_items';
  info: {
    displayName: 'ShowcaseItem';
  };
  attributes: {
    afterImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    beforeImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    mobileAfterImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    mobileBeforeImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    name: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'SocialLink';
  };
  attributes: {
    href: Schema.Attribute.String;
    platform: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.callback-form': SectionsCallbackForm;
      'sections.conversion-insights': SectionsConversionInsights;
      'sections.engagement-fit': SectionsEngagementFit;
      'sections.faq': SectionsFaq;
      'sections.final-cta': SectionsFinalCta;
      'sections.footer': SectionsFooter;
      'sections.header': SectionsHeader;
      'sections.hero': SectionsHero;
      'sections.our-process': SectionsOurProcess;
      'sections.our-work': SectionsOurWork;
      'sections.our-work-project': SectionsOurWorkProject;
      'sections.quote-form': SectionsQuoteForm;
      'sections.sticky-cta': SectionsStickyCta;
      'sections.storefront-problems': SectionsStorefrontProblems;
      'sections.summary': SectionsSummary;
      'sections.work-showcase': SectionsWorkShowcase;
      'shared.brand': SharedBrand;
      'shared.budget-range': SharedBudgetRange;
      'shared.cta': SharedCta;
      'shared.faq-item': SharedFaqItem;
      'shared.final-cta-logo': SharedFinalCtaLogo;
      'shared.fit-point': SharedFitPoint;
      'shared.footer-contact': SharedFooterContact;
      'shared.footer-link': SharedFooterLink;
      'shared.form-option': SharedFormOption;
      'shared.insight-card': SharedInsightCard;
      'shared.marquee-item': SharedMarqueeItem;
      'shared.pain-point': SharedPainPoint;
      'shared.process-card': SharedProcessCard;
      'shared.process-service': SharedProcessService;
      'shared.seo': SharedSeo;
      'shared.services': SharedServices;
      'shared.showcase-item': SharedShowcaseItem;
      'shared.social-link': SharedSocialLink;
    }
  }
}
