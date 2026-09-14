"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import StorefrontProblems from "@/components/StorefrontProblems";

const ConversionInsights = dynamic(() => import("@/components/ConversionInsights"));
const WorkShowcase = dynamic(() => import("@/components/WorkShowcase"));
const EngagementFit = dynamic(() => import("@/components/EngagementFit"));
const OurWork = dynamic(() => import("@/components/OurWork"));
const FinalCTA = dynamic(() => import("@/components/FinalCTA"));
const OurProcess = dynamic(() => import("@/components/OurProcess"));
const FAQ = dynamic(() => import("@/components/FAQ"));

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Hero
  "sections.hero": Hero,
  "hero": Hero,
  "Hero": Hero,
  // Storefront Problems
  "sections.storefront-problems": StorefrontProblems,
  "sections.storefront_problems": StorefrontProblems,
  "storefront-problems": StorefrontProblems,
  "storefrontProblems": StorefrontProblems,
  "StorefrontProblems": StorefrontProblems,
  // Conversion Insights
  "sections.conversion-insights": ConversionInsights,
  "sections.conversion_insights": ConversionInsights,
  "conversion-insights": ConversionInsights,
  "conversionInsights": ConversionInsights,
  "ConversionInsights": ConversionInsights,
  // Work Showcase
  "sections.work-showcase": WorkShowcase,
  "sections.work_showcase": WorkShowcase,
  "work-showcase": WorkShowcase,
  "workShowcase": WorkShowcase,
  "WorkShowcase": WorkShowcase,
  // Engagement Fit
  "sections.engagement-fit": EngagementFit,
  "sections.engagement_fit": EngagementFit,
  "engagement-fit": EngagementFit,
  "engagementFit": EngagementFit,
  "EngagementFit": EngagementFit,
  // Our Work
  "sections.our-work": OurWork,
  "sections.our_work": OurWork,
  "our-work": OurWork,
  "ourWork": OurWork,
  "OurWork": OurWork,
  // Final CTA
  "sections.final-cta": FinalCTA,
  "sections.final_cta": FinalCTA,
  "final-cta": FinalCTA,
  "finalCTA": FinalCTA,
  "FinalCTA": FinalCTA,
  // Our Process
  "sections.our-process": OurProcess,
  "sections.our_process": OurProcess,
  "our-process": OurProcess,
  "ourProcess": OurProcess,
  "OurProcess": OurProcess,
  // FAQ
  "sections.faq": FAQ,
  "faq": FAQ,
  "FAQ": FAQ,
};

export default function BlockRenderer({ sections }: { sections?: any[] }) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section, idx) => {
        if (!section || !section.__component) return null;

        // Skip header/footer/callback if included in dynamic zone
        const compLower = section.__component.toLowerCase();
        if (compLower.includes("header") || compLower.includes("footer") || compLower.includes("callback")) {
          return null;
        }

        const Component = COMPONENT_MAP[section.__component] || COMPONENT_MAP[compLower];
        if (!Component) {
          console.warn(`[BlockRenderer] No matching component found for: ${section.__component}`);
          return null;
        }
        return <Component key={`${section.__component}-${section.id || idx}`} data={section} />;
      })}
    </>
  );
}
