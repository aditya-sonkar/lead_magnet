const { createStrapi } = require('@strapi/strapi');
const path = require('path');

async function seedData() {
  console.log("Starting Strapi instance from dist...");
  const app = await createStrapi({ distDir: path.join(__dirname, '..', 'dist') }).load();

  try {
    const pages = await app.documents('api::page.page').findMany({
      filters: { slug: 'shopify-lead-magnet' },
      populate: ['seo', 'sections', 'stickyCTA']
    });

    console.log(`Found ${pages.length} pages for 'shopify-lead-magnet'`);

    const seoData = {
      metaTitle: "Thumbstack - High-Converting Shopify & Digital Experience Studio",
      metaDescription: "Design-first tech studio building high-converting Shopify stores, mobile apps, and digital experiences. Book a free strategy call today.",
      canonicalUrl: "https://leadmagnet-live.vercel.app",
      noIndex: false
    };

    if (pages.length > 0) {
      const page = pages[0];
      console.log("Updating existing page ID:", page.id, "DocumentId:", page.documentId);
      
      const updated = await app.documents('api::page.page').update({
        documentId: page.documentId,
        data: {
          seo: {
            ...page.seo,
            ...seoData
          }
        },
        status: 'published'
      });
      console.log("Successfully updated page SEO data!", updated.seo);
    } else {
      console.log("Creating new page with SEO data...");
      const created = await app.documents('api::page.page').create({
        data: {
          title: "Shopify Lead Magnet",
          slug: "shopify-lead-magnet",
          seo: seoData
        },
        status: 'published'
      });
      console.log("Successfully created page!", created);
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    process.exit(0);
  }
}

seedData();
