import "@/styles/globals.css";
import StoreNavigation from "@/components/storeNavigation";
import FooterSection from "@/components/footer";
import CookieConsentBanner from "@/components/cookieConsentBanner";
import InfoTopBar from "@/components/infoTopBar";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { CartProvider } from "@/app/context/CartContext";
import { Inter } from "next/font/google";
import { getNavigationData } from "@/services/navigationService";
import StylesPreloader from "@/components/StylesPreloader";

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
  other: {
    "link:preconnect": [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
  },
};

export default async function RootLayout({ children }) {
  // Fetch navigation data for the store
  const navigationData = await getNavigationData();

  return (
    <html lang="bg" className={inter.variable}>
      <body suppressHydrationWarning={true}>
        <StylesPreloader />
        <WishlistProvider>
          <CartProvider>
            <div>
              <InfoTopBar />
              <StoreNavigation navigationData={navigationData} />
              {children}
            </div>
            <CookieConsentBanner />
            <FooterSection navigationData={navigationData} />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
