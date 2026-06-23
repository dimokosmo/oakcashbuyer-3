import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Submit Your Property for Local Investor Review | OaklandCash",
  description:
    "Submit an Oakland County property for local investor review by Dimitrios Kosmidis, a licensed Michigan real estate professional and investor.",
  openGraph: {
    title: "Submit Your Property for Local Investor Review | OaklandCash",
    description:
      "A local review path for properties that may fit rentals, renovations, off-market purchases, or direct sale conversations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
              "@type": "RealEstateAgent",
              name: "Dimitrios Kosmidis",
              description:
                "Licensed Michigan real estate professional and real estate investor reviewing Oakland County properties for possible direct purchase, renovation, rental, or off-market investment opportunities.",
              url: "https://oaklandcash.com",
              telephone: "+12485550100",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Rochester Hills",
                addressRegion: "MI",
                postalCode: "48309",
                addressCountry: "US",
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
