import dynamic from "next/dynamic";
import StructuredData from "@/components/StructuredData";
import { generateOrganizationSchema } from "@/utils/structuredData";

// Компоненти, които не са критични за първоначалното зареждане
const NewProducts = dynamic(() => import("@/components/newProducts"), {
  loading: () => <p>Зареждане...</p>,
});

const CtaBullets = dynamic(() => import("@/components/ctaBullets"), {
  loading: () => <p>Зареждане...</p>,
});

const ShopingByCategory = dynamic(
  () => import("@/components/shopingByCategory"),
  {
    loading: () => <p>Зареждане...</p>,
  }
);

const CtaQuality = dynamic(() => import("@/components/ctaQuality"), {
  loading: () => <p>Зареждане...</p>,
});

const PromoProduts = dynamic(() => import("@/components/promoProducts"), {
  loading: () => <p>Зареждане...</p>,
});

const CtaImage = dynamic(() => import("@/components/ctaImage"), {
  loading: () => <p>Зареждане...</p>,
});

const CtaMissOops = dynamic(() => import("@/components/ctaMissOops"), {
  loading: () => <p>Зареждане...</p>,
});

const NewsLetter = dynamic(() => import("@/components/newsLetter"), {
  loading: () => <p>Зареждане...</p>,
});

const TestimonialsSection = dynamic(() => import("@/components/testimonials"), {
  loading: () => <p>Зареждане...</p>,
});

import FeatureList from "@/components/featureList";
import PromoSection from "@/components/promoSection";

// import NewProducts from "@/components/newProducts";
// import CtaBullets from "@/components/ctaBullets";
// import ShopingByCategory from "@/components/shopingByCategory";
// import CtaQuality from "@/components/ctaQuality";
// import PromoProduts from "@/components/promoProducts";
// import CtaImage from "@/components/ctaImage";
// import CtaMissOops from "@/components/ctaMissOops";
// import NewsLetter from "@/components/newsLetter";
// import TestimonialsSection from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <StructuredData data={generateOrganizationSchema()} />
      <FeatureList />
      <PromoSection />
      <NewProducts />
      <CtaBullets />
      <ShopingByCategory />
      <CtaQuality />
      <PromoProduts />
      <CtaImage />
      <CtaMissOops />
      <NewsLetter />
      <TestimonialsSection />
    </>
  );
}
