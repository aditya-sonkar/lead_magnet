import { getLandingPage } from "@/lib/strapi";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import dynamic from "next/dynamic";

// Statically import above-the-fold components
import StorefrontProblems from "@/components/sections/StorefrontProblems";

// Dynamically import below-the-fold heavy components to reduce initial JS
const ConversionInsights = dynamic(() => import("@/components/sections/ConversionInsights"));
const WorkShowcase = dynamic(() => import("@/components/sections/WorkShowcase"));
const EngagementFit = dynamic(() => import("@/components/sections/EngagementFit"));
const OurWork = dynamic(() => import("@/components/sections/OurWork"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));
const OurProcess = dynamic(() => import("@/components/sections/OurProcess"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Footer = dynamic(() => import("@/components/layout/Footer"));
const StickyCTA = dynamic(() => import("@/components/ui/StickyCTA"));
const BlockRenderer = dynamic(() => import("@/components/page/BlockRenderer"));

// ISR: revalidate every 60 seconds — allows caching without stale data
export const revalidate = 60;

export default async function Home() {
  const data = await getLandingPage();

  if (!data) {
    return (
      <main className="min-h-screen bg-[#37386B] text-white flex flex-col items-center justify-center gap-4 font-sans px-6">
        <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="font-satoshi text-white/70 text-[15px] text-center max-w-[320px] leading-relaxed">
          Unable to load page content. Please check your CMS connection and try again.
        </p>
      </main>
    );
  }

  // Extract quoteForm from dynamic Hero section or fallback hero
  const heroSection =
    (data.sections && Array.isArray(data.sections)
      ? data.sections.find((s: any) => s?.__component === "sections.hero" || s?.__component === "hero" || s?.__component === "Hero")
      : null) || data.hero;
  const quoteFormData = heroSection?.quoteForm;

  // Extract callbackForm from stickyCTA or dynamic sections
  const callbackFormData =
    (data.sections && Array.isArray(data.sections)
      ? data.sections.find((s: any) => s?.__component?.toLowerCase().includes("callback"))
      : null) || data.stickyCTA?.callbackForm || data.callbackForm;

  return (
    <main>
      <Header data={data.header} footerData={data.footer} />

      {/* Render Dynamic Zone sections (Collection Type) */}
      {data.sections && Array.isArray(data.sections) && data.sections.length > 0 ? (
        <BlockRenderer sections={data.sections} />
      ) : (
        /* Graceful fallback to legacy Single Type fields */
        <>
          {data.hero && <Hero data={data.hero} />}

          {data.storefrontProblems && (
            <StorefrontProblems data={data.storefrontProblems} />
          )}

          {data.conversionInsights && (
            <ConversionInsights data={data.conversionInsights} />
          )}

          {data.workShowcase && (
            <WorkShowcase data={data.workShowcase} />
          )}

          {data.engagementFit && (
            <EngagementFit data={data.engagementFit} />
          )}

          {data.ourWork && (
            <OurWork data={data.ourWork} />
          )}

          {data.finalCTA && (
            <FinalCTA data={data.finalCTA} />
          )}

          {data.ourProcess && (
            <OurProcess data={data.ourProcess} />
          )}

          {data.faq && (
            <FAQ data={data.faq} />
          )}
        </>
      )}

      <Footer data={data.footer} />

      <StickyCTA
        data={data.stickyCTA}
        quoteForm={quoteFormData}
        callbackForm={callbackFormData}
      />
    </main>
  );
}