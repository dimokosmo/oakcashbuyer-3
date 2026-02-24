import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sell Your Home for Cash | OaklandCash",
  description:
    "Get a fair cash offer on your Oakland County home. No repairs, no agents, close in as few as 14 days.",
  openGraph: {
    title: "Sell Your Home for Cash | OaklandCash",
    description:
      "Get a fair cash offer on your Oakland County home within 24 hours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "OaklandCash",
              description:
                "Oakland County's trusted cash home buyers. We purchase homes in any condition for a fair cash price with fast closing.",
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
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 4.9,
                reviewCount: 127,
                bestRating: 5,
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
