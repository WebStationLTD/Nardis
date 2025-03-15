import StoreNavigation from "../components/storeNavigation";
import CtaHero from "../components/ctaHero";
import CtaQuality from "../components/ctaQuality";
import CtaMissOops from "../components/ctaMissOops";
import CtaImage from "../components/ctaImage";
import FeatureList from "../components/featureList";
import FooterSection from "../components/footer";
import TestimonialsSection from "../components/testimonials";
import ShopingByCategory from "../components/shopingByCategory";
import CtaBullets from "../components/ctaBullets";
import TrendingProduts from "../components/trendingProduts";
import NewsLetter from "../components/newsLetter";
import PromoProduts from "../components/promoProducts";

export default function Home() {
  return (
    <>
      <StoreNavigation />
      <FeatureList />
      <CtaHero />
      <TrendingProduts />
      <CtaImage />
      <ShopingByCategory />
      <CtaBullets />
      <PromoProduts />
      <CtaQuality />
      <CtaMissOops />
      <NewsLetter />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
}
