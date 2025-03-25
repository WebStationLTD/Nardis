import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/productService";

export default async function sitemap() {
  const baseUrl = "https://nardis.vercel.app";

  // Вземане на всички продукти
  const productsResponse = await getProducts({ perPage: 100 });
  const products = productsResponse.products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Вземане на всички категории
  const categories = await getCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Статични страници
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticPages, ...products, ...categoryUrls];
}
