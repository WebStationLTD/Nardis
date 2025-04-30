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
    // Минимизира CSS и го разделя на критичен и некритичен
    optimizeFonts: true,
    largePageDataBytes: 128 * 1000, // Увеличаваме размера на данните за страница
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

  // Допълнителни настройки за оптимизация на CSS
  webpack: (config, { dev, isServer }) => {
    // Оптимизации само за продукционна среда
    if (!dev && !isServer) {
      // Използваме CSS Optimizer за по-добро разделяне и минимизиране
      config.optimization.splitChunks.cacheGroups.styles = {
        name: "styles",
        test: /\.(css|scss)$/,
        chunks: "all",
        enforce: true,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
