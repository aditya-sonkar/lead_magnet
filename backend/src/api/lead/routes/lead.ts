export default {
  routes: [
    {
      method: "POST",
      path: "/leads",
      handler: "api::lead.lead.create",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/leads",
      handler: "api::lead.lead.find",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/leads/:id",
      handler: "api::lead.lead.findOne",
      config: {
        auth: false,
      },
    },
  ],
};
