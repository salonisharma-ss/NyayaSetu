export default {
  providers: [
    {
      // Convex Auth issues tokens for this deployment; CONVEX_SITE_URL is set automatically.
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
