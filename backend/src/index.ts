/**
 * Strapi application lifecycle callbacks.
 */
export default {
  /** Runs before application initialization */
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        const apis = ["page", "header", "footer", "brand", "form", "lead"];
        const actions = ["find", "findOne", "create"];

        for (const api of apis) {
          for (const action of actions) {
            // For lead, only 'create' action is public; for others, 'find' and 'findOne'
            if (api === "lead" && action !== "create") continue;
            if (api !== "lead" && action === "create") continue;

            const actionId = `api::${api}.${api}.${action}`;
            const existing = await strapi
              .query("plugin::users-permissions.permission")
              .findOne({
                where: {
                  action: actionId,
                  role: publicRole.id,
                },
              });

            if (!existing) {
              await strapi
                .query("plugin::users-permissions.permission")
                .create({
                  data: {
                    action: actionId,
                    role: publicRole.id,
                  },
                });
            }
          }
        }
        console.log("[Bootstrap] Verified public permissions for page, header, footer, brand, form, lead");
      }
    } catch (err) {
      console.warn("[Bootstrap] Could not auto-set permissions:", err);
    }

    try {
      const knex = strapi.db.connection;
      const tableName = "components_sections_quote_forms";
      const hasTable = await knex.schema.hasTable(tableName);
      if (hasTable) {
        const colInfo = await knex(tableName).columnInfo();
        const cols = Object.keys(colInfo);

        const findCol = (camel: string, snake: string) => {
          if (cols.includes(camel)) return camel;
          if (cols.includes(snake)) return snake;
          return null;
        };

        const issuesCol = findCol("issuesWarning", "issues_warning");
        const budgetCol = findCol("budgetWarning", "budget_warning");
        const selectionCol = findCol("selectionWarning", "selection_warning");
        const phoneCol = findCol("phoneWarning", "phone_warning");
        const estimateCol = findCol("estimateButtonLabel", "estimate_button_label");

        const defaults: Record<string, string> = {};
        if (issuesCol) defaults[issuesCol] = "Please select at least one issue that needs improvement";
        if (budgetCol) defaults[budgetCol] = "Please select your preferred budget range";
        if (selectionCol) defaults[selectionCol] = "Please select what needs improvement and your budget range";
        if (phoneCol) defaults[phoneCol] = "Please enter a valid phone number";
        if (estimateCol) defaults[estimateCol] = "Get My Estimate";

        const rows = await knex(tableName).select("*");
        for (const row of rows) {
          const rowUpdates: Record<string, any> = {};
          for (const [col, val] of Object.entries(defaults)) {
            if (!row[col] || typeof row[col] !== "string" || row[col].trim() === "") {
              rowUpdates[col] = val;
            }
          }
          if (Object.keys(rowUpdates).length > 0) {
            await knex(tableName).where({ id: row.id }).update(rowUpdates);
            console.log(`[Bootstrap] Auto-populated quote form id=${row.id}:`, rowUpdates);
          }
        }
      }
    } catch (dbErr) {
      console.warn("[Bootstrap] Could not populate quote form warnings:", dbErr);
    }
    try {
      const approvedBrandNames = [
        "PALOMA", "figo", "SIORAI", "WESTSIDE", "STIFF COLLAR", "EatSure",
        "BFT", "JVice", "Juicebro", "Trainers Locker", "Sica", "Stackables"
      ];
      const existingBrands = await strapi.documents("api::brand.brand").findMany({});
      
      // Remove any random / unapproved brands
      if (existingBrands && existingBrands.length > 0) {
        for (const b of existingBrands) {
          if (!approvedBrandNames.map(n => n.toLowerCase()).includes(b.name.toLowerCase())) {
            await strapi.documents("api::brand.brand").delete({ documentId: b.documentId });
            console.log(`[Bootstrap] Removed unwanted brand: ${b.name}`);
          }
        }
      }

      const currentBrands = await strapi.documents("api::brand.brand").findMany({});
      if (!currentBrands || currentBrands.length === 0) {
        const defaultBrands = approvedBrandNames.map(name => ({
          name,
          publishedAt: new Date(),
        }));
        for (const brandData of defaultBrands) {
          await strapi.documents("api::brand.brand").create({ data: brandData });
        }
        console.log("[Bootstrap] Auto-seeded user-approved Brand records");
      }
    } catch (brandSeedErr) {
      console.warn("[Bootstrap] Could not seed Brand records:", brandSeedErr);
    }

    // Auto-seed Form records if none exist
    try {
      const existingForms = await strapi.documents("api::form.form").findMany({});
      if (!existingForms || existingForms.length === 0) {
        const defaultForms = [
          {
            formName: "Hero Instant Quote Form",
            formType: "quote",
            title: "Get an instant quote",
            description: "Book a free consultation with us. We'll discuss materials, your vision, and provide an estimate.",
            stepLabel: "Store Info",
            shopifyQuestion: "Do you own a Shopify website ?",
            shopifyQuestionHint: "(choose one)",
            yesLabel: "Yes, I do",
            noLabel: "No, But I want to build one",
            shopifyLinkLabel: "Add your Shopify link (optional)",
            shopifyLinkPlaceholder: "We'll personalize your quote based on your current setup.",
            continueLabel: "Continue",
            storeWarning: "Please select whether you own a Shopify website",
            step2Title: "Choose your budget range",
            step2Description: "Select what’s not working and your preferred budget.",
            step2Label: "Budget range",
            issuesLabel: "What needs Improvement ?",
            issuesHint: "(multiple options)",
            budgetLabel: "Select your budget range",
            budgetHint: "(choose one)",
            otherIssuesLabel: "Other issues (optional)",
            otherIssuesPlaceholder: "Any other issues your shopify store is facing",
            issuesWarning: "Please select at least one issue that needs improvement",
            budgetWarning: "Please select your preferred budget range",
            selectionWarning: "Please select what needs improvement and your budget range",
            estimateButtonLabel: "Get My Estimate",
            resultTitle: "Your Instant Quote Is Ready!",
            resultDescription: "Based on your selections:",
            step3Label: "Your Estimate",
            estimateLabel: "Your Estimated Budget",
            basedOnLabel: "Based on your selections:",
            phoneLabel: "Phone Number",
            phonePlaceholder: "Enter Phone Number",
            phoneWarning: "Please enter a valid phone number",
            emailLabel: "Email (Optional)",
            emailPlaceholder: "Enter Email",
            bookCallButtonLabel: "Book My Free Call",
            submittingButtonLabel: "Submitting...",
            successTitle: "We've received your details! We'll call you shortly.",
            successDescription: "Our team is reviewing your requirements and will reach out to you shortly.",
            disclaimer: "We'll review your store and send insights - no commitments.",
            closeButtonLabel: "Done",
            publishedAt: new Date(),
          },
          {
            formName: "Get a Callback Form",
            formType: "callback",
            title: "Get a callback",
            description: "Let’s make something amazing together.\nBook a call - we’ve got coffee (or tea) ready and are always up for a good conversation.",
            phoneLabel: "Phone Number",
            phonePlaceholder: "Enter Phone Number",
            emailLabel: "Email",
            emailPlaceholder: "Enter Email",
            shopifyLinkLabel: "Shopify Link (Optional)",
            shopifyLinkPlaceholder: "Enter Shopify link",
            bookCallButtonLabel: "Book My Free Call",
            submittingButtonLabel: "Submitting...",
            successTitle: "Thank you! We've received your request.",
            successDescription: "We'll reach out within 24 hours — no spam, just expert guidance.",
            disclaimer: "We'll reach out within 24 hours — no spam, just expert guidance.",
            closeButtonLabel: "Close",
            publishedAt: new Date(),
          },
        ];
        for (const formData of defaultForms) {
          await strapi.documents("api::form.form").create({ data: formData });
        }
        console.log("[Bootstrap] Auto-seeded default Form records");
      }
    } catch (formSeedErr) {
      console.warn("[Bootstrap] Could not seed Form records:", formSeedErr);
    }
  },
};
