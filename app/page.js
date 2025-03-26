import dynamic from "next/dynamic";
import StructuredData from "@/components/StructuredData";
import { generateOrganizationSchema } from "@/utils/structuredData";

// Компоненти, които не са критични за първоначалното зареждане, но поддържат SSR
const NewProducts = dynamic(() => import("@/components/newProducts"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const CtaBullets = dynamic(() => import("@/components/ctaBullets"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const ShopingByCategory = dynamic(
  () => import("@/components/shopingByCategory"),
  {
    ssr: true,
    loading: () => <p>Зареждане...</p>,
  }
);

const CtaQuality = dynamic(() => import("@/components/ctaQuality"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const PromoProduts = dynamic(() => import("@/components/promoProducts"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const CtaImage = dynamic(() => import("@/components/ctaImage"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const CtaMissOops = dynamic(() => import("@/components/ctaMissOops"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const NewsLetter = dynamic(() => import("@/components/newsLetter"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const TestimonialsSection = dynamic(() => import("@/components/testimonials"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

import FeatureList from "@/components/featureList";
import PromoSection from "@/components/promoSection";

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
