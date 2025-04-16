/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i0.wp.com",
      "secure.gravatar.com",
      "nardis.bg",
      "nardis.rosset.website",
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Оптимизации за производителност
    optimizeCss: true, // Оптимизира CSS файловете
    optimizePackageImports: ["@headlessui/react", "@heroicons/react"],

    // Кеширане на ресурси
    incrementalCacheHandlerPath: require.resolve("./cache-handler.js"),
  },
  // Конфигурация за кеширане на страниците
  staticPageGenerationTimeout: 90,
  reactStrictMode: false,
  // Прелинкване (prefetching) на страници - ключово за категории
  onDemandEntries: {
    // Сървърно кеширане, секунди
    maxInactiveAge: 120,
    // Максимален брой страници в паметта едновременно
    pagesBufferLength: 12,
  },
};

module.exports = nextConfig;
