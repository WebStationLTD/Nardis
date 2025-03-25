import "@/styles/globals.css";
import StoreNavigation from "@/components/storeNavigation";
import FooterSection from "@/components/footer";
import CookieConsentBanner from "@/components/cookieConsentBanner";
import { Inter } from "next/font/google";
// import { getCategories } from "@/services/productService";
import AuthProvider from "@/context/AuthProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: "Nardis - Козметика от Германия",
  description: "Официален вносител на немска козметика в България",
};

export default async function RootLayout({ children }) {
  const res = await fetch(
    "https://nardis.rosset.website/wp-json/wc/v3/products/categories?per_page=100",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
          ).toString("base64"),
      },
      next: { revalidate: 60 },
    }
  );

  const allCategories = await res.json();

  // Масив с желаните категории в мега менюто
  const megaMenuCategoryIds = [17, 26]; // ID за Artdeco ASIAN SPA и Грим

  // Рекурсивно строим дървовидна структура
  function buildCategoryTree(categories, parentId = 0) {
    return categories
      .filter((cat) => cat.parent === parentId)
      .map((cat) => ({
        ...cat,
        subcategories: buildCategoryTree(categories, cat.id),
      }));
  }

  // Взима всички подкатегории рекурсивно (flatten)
  function flattenSubcategories(category) {
    const result = [];

    function traverse(cat) {
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach((subcat) => {
          result.push(subcat);
          traverse(subcat);
        });
      }
    }

    traverse(category);
    return result;
  }

  const categoryTree = buildCategoryTree(allCategories);

  // Вземаме само избраните top-level категории + всичките им подкатегории (flatten)
  const categoriesWithChildren = categoryTree
    .filter((cat) => megaMenuCategoryIds.includes(cat.id))
    .map((cat) => ({
      ...cat,
      subcategories: flattenSubcategories(cat),
    }));

  // Групиране на категории по parent-child
  // const parentCategories = allCategories.filter((cat) => cat.parent === 0);

  return (
    <html lang="bg" className={inter.variable}>
      <body>
        <AuthProvider>
          <StoreNavigation categories={categoriesWithChildren} />
          {children}
          <CookieConsentBanner />
          <FooterSection />
        </AuthProvider>
      </body>
    </html>
  );
}
