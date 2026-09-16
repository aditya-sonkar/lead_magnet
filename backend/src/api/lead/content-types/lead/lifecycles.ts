export default {
  async afterCreate(event: any) {
    const { result } = event;
    console.log("[Strapi Lifecycle] New Lead submitted successfully:", {
      id: result.id,
      phone: result.phone,
      email: result.email,
      storeUrl: result.storeUrl,
      source: result.source,
      createdAt: result.createdAt,
    });

    try {
      if (strapi.plugin('email') && typeof strapi.plugin('email').service('email').send === 'function') {
        const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.STRAPI_ADMIN_EMAIL || result.email;
        if (recipientEmail) {
          await strapi.plugin('email').service('email').send({
            to: recipientEmail,
            from: process.env.SMTP_FROM || 'noreply@leadmagnet.com',
            subject: `[New Lead Alert] Lead #${result.id} from ${result.source || 'Website'}`,
            text: `A new lead has been submitted!\n\nPhone: ${result.phone || 'N/A'}\nEmail: ${result.email || 'N/A'}\nStore URL: ${result.storeUrl || 'N/A'}\nSelected Problems: ${result.selectedProblems || 'N/A'}\nSelected Budget: ${result.selectedBudget || 'N/A'}\nOther Notes: ${result.otherNotes || 'N/A'}\nSource: ${result.source || 'N/A'}`,
          });
          console.log(`[Strapi Lifecycle] Lead notification email triggered for lead #${result.id}`);
        }
      }
    } catch (emailErr) {
      console.warn("[Strapi Lifecycle] Could not send lead notification email:", emailErr);
    }
  },
};
