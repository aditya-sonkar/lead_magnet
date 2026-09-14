import { getLandingPage } from "@/lib/strapi";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLandingPage(slug);

  if (!data) {
    return {
      title: `Not Found - ${siteConfig.name}`,
    };
  }

  const title = data.title || data.hero?.heading || siteConfig.title;
  const description = data.hero?.description || siteConfig.description;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${slug}`,
      siteName: siteConfig.name,
    },
  };
}

export default async function DynamicSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getLandingPage(slug);

  if (!data) {
    notFound();
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
