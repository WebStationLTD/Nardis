export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-account/", "/login/", "/register/"],
    },
    sitemap: "https://nardis.vercel.app/sitemap.xml",
  };
}
