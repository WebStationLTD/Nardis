"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const CookieConsent = dynamic(() => import("react-cookie-consent"), {
  ssr: false,
});

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      cookieName="nardisCookieConsent"
      expires={365}
      buttonText="Приемам"
      declineButtonText="Отказвам"
      enableDeclineButton
      style={{
        background: "#2B373B",
        color: "#FFF",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
      buttonWrapperClasses="flex gap-4 mt-3 md:mt-0"
      buttonStyle={{
        backgroundColor: "#4CAF50",
        color: "#FFF",
        fontSize: "14px",
        padding: "8px 16px",
        borderRadius: "6px",
      }}
      declineButtonStyle={{
        backgroundColor: "#f44336",
        color: "#FFF",
        fontSize: "14px",
        padding: "8px 16px",
        borderRadius: "6px",
      }}
      onAccept={() => {
        console.log("Потребителят е приел бисквитките");
      }}
      onDecline={() => {
        console.log("Потребителят е отказал бисквитките");
      }}
    >
      <p className="text-sm md:text-base">
        Използваме бисквитки за подобряване на услугите.{" "}
        <Link href="/privacy-policy" className="underline">
          Научете повече
        </Link>
        .
      </p>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
