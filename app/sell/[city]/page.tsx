import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocationBySlug, locations } from "../../../lib/locations";
import { CityCtaLink } from "./CityCtaLink";

type PageProps = {
  params: Promise<{ city: string }>;
};

const disclosure =
  "Proper Home Options is not an appraisal, lender, legal advisor, tax advisor, or financial advisor. Dimitri Kosmidis is a licensed Michigan real estate professional and real estate investor. Dimitri or his investor network may be interested in purchasing some properties, and other options may involve separate professionals. Submitting information creates no agency relationship or obligation to use any option.";

const reviewFocus = [
  "Fixer-uppers",
  "Inherited homes",
  "Tenant-occupied homes",
  "Vacant homes",
  "Homes needing repairs",
  "Tired landlord properties",
  "Off-market opportunities",
  "Rental or flip potential",
];

export function generateStaticParams() {
  return locations.map((location) => ({ city: location.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);

  if (!location) {
    return {
      title: "Michigan Home Options | Proper Home Options",
    };
  }

  return {
    title: `Home Selling Options in ${location.city}, ${location.state} | Proper Home Options`,
    description: `Compare cash-sale, traditional-listing, refinance-conversation, rental, repair, and hold options for a ${location.city} property.`,
    alternates: {
      canonical: `/sell/${location.slug}`,
    },
    openGraph: {
      title: `Home Selling Options in ${location.city}, ${location.state} | Proper Home Options`,
      description: `Start a Proper Review for a ${location.city} property based on condition, timing, and homeowner goals.`,
      type: "website",
      url: `/sell/${location.slug}`,
    },
  };
}

export default async function CityPropertyReviewPage({ params }: PageProps) {
  const { city } = await params;
  const location = getLocationBySlug(city);

  if (!location) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `The Proper Review in ${location.city}, ${location.state}`,
    description: `Practical property-option review for ${location.city} homeowners comparing a sale, refinance conversation, rental, repair, or hold strategy.`,
    about: {
      "@type": "Service",
      name: "The Proper Review",
      areaServed: {
        "@type": "City",
        name: `${location.city}, ${location.state}`,
      },
      provider: {
        "@type": "Person",
        name: "Dimitri Kosmidis",
      },
    },
  };

  return (
    <main className="city-page">
      <style>{`
        .city-page{min-height:100vh;background:#F7F4EE;color:#1D2A25;font-family:'Outfit',sans-serif;overflow:hidden;}
        .city-wrap{max-width:1180px;margin:0 auto;padding:0 24px;position:relative;z-index:1;}
        .city-hero{position:relative;padding:130px 0 82px;border-bottom:1px solid #D9DED8;background:#E7EEE9;}
        .city-back{display:inline-flex;align-items:center;color:#657169;font-size:13px;margin-bottom:30px;transition:color 0.2s ease;}
        .city-back:hover{color:#365347;}
        .city-kicker{display:inline-flex;align-items:center;gap:10px;color:#527264;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:8px 14px;border:1px solid #C5D3CA;border-radius:999px;background:#F7F4EE;margin-bottom:24px;}
        .city-dot{width:7px;height:7px;border-radius:50%;background:#527264;}
        .city-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:54px;align-items:end;}
        h1{font-family:'DM Serif Display',serif;font-size:clamp(42px,6.5vw,76px);line-height:1.02;letter-spacing:0;color:#1D2A25;margin:0 0 22px;max-width:840px;}
        h1 em,.city-title em{font-style:italic;color:#527264;}
        .city-lede{font-size:18px;line-height:1.78;color:#56645D;max-width:740px;margin:0 0 32px;}
        .city-actions{display:flex;gap:12px;flex-wrap:wrap;}
        .city-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.25s ease;}
        .city-btn-primary{background:#365347;color:#fff;}
        .city-btn-primary:hover{background:#2C463B;transform:translateY(-1px);}
        .city-btn-secondary{border:1px solid #BFCAC3;color:#1D2A25;background:transparent;}
        .city-btn-secondary:hover{border-color:#527264;color:#365347;}
        .city-panel{background:#FFFDF9;border:1px solid #D9DED8;border-radius:10px;padding:24px;box-shadow:0 24px 70px rgba(29,42,37,0.08);}
        .city-panel-label{font-size:11px;color:#527264;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;}
        .city-panel p{font-size:14px;line-height:1.7;color:#56645D;margin:0;}
        .city-nearby{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;}
        .city-chip{font-size:12px;color:#34453E;background:#E7EEE9;border:1px solid #D9DED8;border-radius:999px;padding:7px 10px;}
        .city-section{padding:84px 0;border-bottom:1px solid #D9DED8;}
        .city-section.alt{background:#FFFDF9;}
        .city-section .city-wrap{display:grid;grid-template-columns:0.72fr 1.28fr;gap:54px;align-items:start;}
        .city-eyebrow{font-size:11px;color:#527264;text-transform:uppercase;letter-spacing:0.14em;font-weight:700;margin-bottom:13px;}
        .city-title{font-family:'DM Serif Display',serif;font-size:clamp(32px,4.6vw,52px);line-height:1.1;color:#1D2A25;margin:0;}
        .city-copy{font-size:16px;line-height:1.8;color:#657169;margin:0 0 22px;}
        .city-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none;}
        .city-card{background:#FFFDF9;border:1px solid #D9DED8;border-radius:8px;padding:16px 16px;color:#56645D;font-size:14px;line-height:1.55;}
        .city-card strong{display:block;color:#1D2A25;font-size:15px;margin-bottom:5px;}
        .city-note{background:#E7EEE9;border:1px solid #CAD7CF;border-radius:10px;padding:30px;}
        .city-note p{font-size:15px;line-height:1.75;color:#34453E;margin:0;}
        .city-disclosure{font-size:12px;line-height:1.8;color:#657169;margin:22px 0 0;}
        .city-final{padding:76px 0 92px;text-align:center;}
        .city-final .city-title{max-width:760px;margin:0 auto 16px;}
        .city-final p{max-width:660px;margin:0 auto 26px;}
        @media(max-width:860px){.city-wrap{padding:0 18px}.city-hero{padding:118px 0 62px}.city-hero-grid,.city-section .city-wrap{grid-template-columns:1fr;gap:32px}.city-panel{max-width:520px}.city-list{grid-template-columns:1fr}.city-actions{flex-direction:column}.city-btn{width:100%}}
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="city-hero">
        <div className="city-wrap">
          <Link className="city-back" href="/">
            Back to Proper Home Options
          </Link>
          <div className="city-hero-grid">
            <div>
              <div className="city-kicker">
                <span className="city-dot" />
                {location.city}, {location.state} home options
              </div>
              <h1>
                Compare Your Property Options in {location.city}
              </h1>
              <p className="city-lede">
                If you own a property in {location.city}, you may have more than
                one practical path. Compare a possible cash sale, traditional
                listing, refinance conversation, rental, repair, or hold
                strategy based on the property and your goals.
              </p>
              <div className="city-actions">
                <CityCtaLink
                  className="city-btn city-btn-primary"
                  href="/#report"
                  citySlug={location.slug}
                  ctaLabel="Start My Proper Review"
                >
                  Start My Proper Review
                </CityCtaLink>
                <CityCtaLink
                  className="city-btn city-btn-secondary"
                  href="/#options"
                  citySlug={location.slug}
                  ctaLabel="Compare My Options"
                >
                  Compare My Options
                </CityCtaLink>
              </div>
            </div>
            <aside className="city-panel">
              <div className="city-panel-label">Local property context</div>
              <p>{location.shortIntro}</p>
              <div className="city-nearby">
                {location.nearbyAreas.map((area) => (
                  <span className="city-chip" key={area}>
                    {area}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="city-section">
        <div className="city-wrap">
          <div>
            <div className="city-eyebrow">Options Worth Comparing</div>
            <h2 className="city-title">
              A Practical Review in <em>{location.city}</em>
            </h2>
          </div>
          <div>
            <p className="city-copy">
              The goal is not to force every property into the same answer.
              Condition, occupancy, repair scope, location, equity, timing, and
              homeowner priorities can make different paths worth considering.
            </p>
            <ul className="city-list">
              {reviewFocus.map((item) => (
                <li className="city-card" key={item}>
                  <strong>{item}</strong>
                  Considered alongside listing, financing, rental, repair, and
                  direct-sale tradeoffs.
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="city-section alt">
        <div className="city-wrap">
          <div>
            <div className="city-eyebrow">Property Types</div>
            <h2 className="city-title">
              Properties Worth <em>Submitting</em>
            </h2>
          </div>
          <div>
            <p className="city-copy">{location.propertyTypes}</p>
            <ul className="city-list">
              {location.targetSituations.map((situation) => (
                <li className="city-card" key={situation}>
                  {situation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="city-section">
        <div className="city-wrap">
          <div>
            <div className="city-eyebrow">Case-by-Case Review</div>
            <h2 className="city-title">
              No Single Path Fits <em>Every Homeowner</em>
            </h2>
          </div>
          <div className="city-note">
            <p>
              Requesting a report starts a review, not an obligation or offer
              promise. A direct purchase may fit some properties. Other
              homeowners may benefit from comparing a traditional listing,
              refinance conversation, rental, repair, hold strategy, or another
              provider before making a decision.
            </p>
            <p className="city-disclosure">{disclosure}</p>
          </div>
        </div>
      </section>

      <section className="city-final">
        <div className="city-wrap">
          <h2 className="city-title">
            Ready to Compare Your {location.city} <em>Property Options?</em>
          </h2>
          <p className="city-copy">
            Share the basics about condition, timing, and what matters most.
            Dimitri will review the details and follow up with practical paths
            that may deserve a closer look.
          </p>
          <div className="city-actions" style={{ justifyContent: "center" }}>
            <CityCtaLink
              className="city-btn city-btn-primary"
              href="/#report"
              citySlug={location.slug}
              ctaLabel="Start My Proper Review"
            >
              Start My Proper Review
            </CityCtaLink>
            <Link className="city-btn city-btn-secondary" href="/">
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
