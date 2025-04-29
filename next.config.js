/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i0.wp.com",
      "secure.gravatar.com",
      "nardis.bg",
      "nextlevel-shop.admin-panels.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Оптимизации за производителност
    optimizeCss: true, // Оптимизира CSS файловете
    optimizePackageImports: ["@headlessui/react", "@heroicons/react"],
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
  // Изключване на предупреждения за липсващи страници или API маршрути
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Предупреждения от ESLint няма да спират билда
    ignoreDuringBuilds: true,
  },
  // Пропускане на проверки за типове и други технически грешки
  distDir: ".next",
  poweredByHeader: false,
  output: "standalone", // За по-добра поддръжка с Vercel
};

module.exports = nextConfig;
