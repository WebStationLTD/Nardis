import "@/styles/globals.css";
import StoreNavigation from "@/components/storeNavigation";
import FooterSection from "@/components/footer";
import CookieConsentBanner from "@/components/cookieConsentBanner";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { getNavigationData } from "@/services/navigationService";

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
        <AuthProvider>
          <StoreNavigation navigationData={navigationData} />
          {children}
          <CookieConsentBanner />
          <FooterSection />
        </AuthProvider>
      </body>
    </html>
  );
}
