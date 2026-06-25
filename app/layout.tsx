import type { Metadata } from "next";
import Script from "next/script";
import { AttributionCapture } from "./AttributionCapture";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compare Your Home Options in Michigan | Proper Home Options",
  description:
    "Compare a cash offer, traditional sale, refinance conversation, rental, repair, or hold strategy with The Proper Review.",
  openGraph: {
    title: "Compare Your Home Options | Proper Home Options",
    description:
      "Understand practical property paths before deciding whether to sell, refinance, rent, repair, or hold.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const googleSiteVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {googleSiteVerification ? (
          <meta
            name="google-site-verification"
            content={googleSiteVerification}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Proper Home Options",
              description:
                "A Michigan homeowner decision platform for comparing cash-sale, traditional-sale, refinance-conversation, rental, repair, and hold options.",
              ...(siteUrl ? { url: siteUrl } : {}),
              founder: {
                "@type": "Person",
                name: "Dimitri Kosmidis",
                jobTitle:
                  "Licensed Michigan real estate professional and real estate investor",
              },
              areaServed: [
                "Rochester Hills",
                "Troy",
                "Birmingham",
                "Bloomfield Hills",
                "Auburn Hills",
                "Royal Oak",
                "Southfield",
                "Pontiac",
                "Waterford",
              ].map((c) => ({ "@type": "City", name: `${c}, MI` })),
            }),
          }}
        />
      </head>
      <body>
        <AttributionCapture />
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', { send_page_view: true });
                `,
              }}
            />
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
