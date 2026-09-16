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
  },
};
