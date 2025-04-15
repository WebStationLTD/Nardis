import "@/styles/globals.css";
import StoreNavigation from "@/components/storeNavigation";
import FooterSection from "@/components/footer";
import CookieConsentBanner from "@/components/cookieConsentBanner";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { CartProvider } from "@/app/context/CartContext";
import { Inter } from "next/font/google";
import { getNavigationData } from "@/services/navigationService";
import { Analytics } from '@vercel/analytics/next';

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
  // Fetch navigation data for the store
  const navigationData = await getNavigationData();

  return (
    <html lang="bg" className={inter.variable}>
      <body>
        <WishlistProvider>
          <CartProvider>
            <StoreNavigation navigationData={navigationData} />
            {children}
            <Analytics />
            <CookieConsentBanner />
            <FooterSection />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
