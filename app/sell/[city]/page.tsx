import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocationBySlug, locations } from "../../../lib/locations";
import { CityCtaLink } from "./CityCtaLink";

type PageProps = {
  params: Promise<{ city: string }>;
};

const disclosure =
  "Dimitrios Kosmidis is a licensed Michigan real estate professional and real estate investor. This site is intended for homeowners interested in a possible direct sale, investor purchase, or off-market property review. Not every property will receive an offer. Submitting a property does not create an agency relationship or obligation to sell. If a traditional listing appears to be a better fit, that option may be discussed separately.";

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
      title: "Investor Property Review | OaklandCash",
    };
  }

  return {
    title: `Investor Property Review in ${location.city}, ${location.state} | OaklandCash`,
    description: `Submit a ${location.city} property for local investor review. Good fit for fixer-uppers, inherited homes, tenant-occupied properties, vacant homes, and homes needing repairs.`,
    alternates: {
      canonical: `/sell/${location.slug}`,
    },
    openGraph: {
      title: `Investor Property Review in ${location.city}, ${location.state} | OaklandCash`,
      description: `Submit a ${location.city} property for local investor review focused on repairs, occupancy, timing, rental potential, and renovation fit.`,
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
    name: `Investor Property Review in ${location.city}, ${location.state}`,
    description: `Local investor property review for ${location.city} homes that may need repairs, have tenants, be vacant, inherited, or better suited for an off-market conversation.`,
    url: `https://oaklandcash.com/sell/${location.slug}`,
    about: {
      "@type": "Service",
      name: "Local investor property review",
      areaServed: {
        "@type": "City",
        name: `${location.city}, ${location.state}`,
      },
      provider: {
        "@type": "RealEstateAgent",
        name: "Dimitrios Kosmidis",
      },
    },
  };

  return (
    <main className="city-page">
      <style>{`
        .city-page{min-height:100vh;background:#0C0C0C;color:#E8E4DC;font-family:'Outfit',sans-serif;overflow:hidden;}
        .city-wrap{max-width:1180px;margin:0 auto;padding:0 24px;position:relative;z-index:1;}
        .city-hero{position:relative;padding:150px 0 82px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .city-hero::before{content:'';position:absolute;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(232,168,76,0.12),transparent 70%);filter:blur(90px);top:-190px;right:-170px;}
        .city-hero::after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(245,240,232,0.04),transparent 70%);filter:blur(90px);bottom:0;left:-160px;}
        .city-back{display:inline-flex;align-items:center;color:#9A948A;font-size:13px;margin-bottom:30px;transition:color 0.2s ease;}
        .city-back:hover{color:#E8A84C;}
        .city-kicker{display:inline-flex;align-items:center;gap:10px;color:#E8A84C;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:8px 14px;border:1px solid rgba(232,168,76,0.18);border-radius:999px;background:rgba(232,168,76,0.05);margin-bottom:24px;}
        .city-dot{width:7px;height:7px;border-radius:50%;background:#E8A84C;}
        .city-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:54px;align-items:end;}
        h1{font-family:'DM Serif Display',serif;font-size:clamp(42px,6.5vw,76px);line-height:1.02;letter-spacing:0;color:#F5F0E8;margin:0 0 22px;max-width:840px;}
        h1 em,.city-title em{font-style:italic;color:#E8A84C;}
        .city-lede{font-size:18px;line-height:1.78;color:#9A948A;max-width:740px;margin:0 0 32px;}
        .city-actions{display:flex;gap:12px;flex-wrap:wrap;}
        .city-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.25s ease;}
        .city-btn-primary{background:#E8A84C;color:#0C0C0C;}
        .city-btn-primary:hover{background:#F2C97E;transform:translateY(-1px);}
        .city-btn-secondary{border:1px solid rgba(255,255,255,0.12);color:#F5F0E8;background:transparent;}
        .city-btn-secondary:hover{border-color:#E8A84C;color:#E8A84C;}
        .city-panel{background:#151515;border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,0.25);}
        .city-panel-label{font-size:11px;color:#E8A84C;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;}
        .city-panel p{font-size:14px;line-height:1.7;color:#D4CCBC;margin:0;}
        .city-nearby{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;}
        .city-chip{font-size:12px;color:#D4CCBC;background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:999px;padding:7px 10px;}
        .city-section{padding:84px 0;border-bottom:1px solid rgba(255,255,255,0.06);}
        .city-section.alt{background:#111111;}
        .city-section .city-wrap{display:grid;grid-template-columns:0.72fr 1.28fr;gap:54px;align-items:start;}
        .city-eyebrow{font-size:11px;color:#E8A84C;text-transform:uppercase;letter-spacing:0.14em;font-weight:700;margin-bottom:13px;}
        .city-title{font-family:'DM Serif Display',serif;font-size:clamp(32px,4.6vw,52px);line-height:1.1;color:#F5F0E8;margin:0;}
        .city-copy{font-size:16px;line-height:1.8;color:#9A948A;margin:0 0 22px;}
        .city-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none;}
        .city-card{background:#151515;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 16px;color:#D4CCBC;font-size:14px;line-height:1.55;}
        .city-card strong{display:block;color:#F5F0E8;font-size:15px;margin-bottom:5px;}
        .city-note{background:linear-gradient(135deg,rgba(232,168,76,0.08),rgba(21,21,21,0.92));border:1px solid rgba(232,168,76,0.16);border-radius:18px;padding:30px;}
        .city-note p{font-size:15px;line-height:1.75;color:#D4CCBC;margin:0;}
        .city-disclosure{font-size:12px;line-height:1.8;color:#6B665E;margin:22px 0 0;}
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
            Back to OaklandCash
          </Link>
          <div className="city-hero-grid">
            <div>
              <div className="city-kicker">
                <span className="city-dot" />
                {location.city}, {location.state} property review
              </div>
              <h1>
                Submit a {location.city} Property for Local Investor Review
              </h1>
              <p className="city-lede">
                If you own a property in {location.city} that needs repairs,
                has tenants, is vacant, was inherited, or may be better suited
                for an off-market investor conversation, you can submit it for
                local review. I evaluate properties for rental, renovation, and
                investment potential across {location.city} and the surrounding
                area.
              </p>
              <div className="city-actions">
                <CityCtaLink
                  className="city-btn city-btn-primary"
                  href="/#offer"
                  citySlug={location.slug}
                  ctaLabel="Submit My Property"
                >
                  Submit My Property
                </CityCtaLink>
                <CityCtaLink
                  className="city-btn city-btn-secondary"
                  href="/#features"
                  citySlug={location.slug}
                  ctaLabel="See What I Look For"
                >
                  See What I Look For
                </CityCtaLink>
              </div>
            </div>
            <aside className="city-panel">
              <div className="city-panel-label">Local review context</div>
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
            <div className="city-eyebrow">What I Look For</div>
            <h2 className="city-title">
              Investor Review in <em>{location.city}</em>
            </h2>
          </div>
          <div>
            <p className="city-copy">
              The goal is not to force every property into the same answer. I
              look at condition, occupancy, repair scope, location, rental
              potential, resale potential, timing, and whether a direct
              investor conversation solves a real problem for the owner.
            </p>
            <ul className="city-list">
              {reviewFocus.map((item) => (
                <li className="city-card" key={item}>
                  <strong>{item}</strong>
                  Reviewed case by case based on condition, timing, and
                  investment fit.
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
              Not Every Property Is a <em>Fit</em>
            </h2>
          </div>
          <div className="city-note">
            <p>
              Submitting a {location.city} property starts a review, not an
              obligation and not an offer promise. Some properties may fit a
              direct investor purchase, rental hold, renovation, flip, or
              off-market assignment. Others may need more information or may be
              better suited for another path, including a traditional listing if
              that appears to serve the owner better.
            </p>
            <p className="city-disclosure">{disclosure}</p>
          </div>
        </div>
      </section>

      <section className="city-final">
        <div className="city-wrap">
          <h2 className="city-title">
            Have a {location.city} Property to <em>Review?</em>
          </h2>
          <p className="city-copy">
            Share the basics about condition, occupancy, repairs, ownership,
            and timeline. I will review the details and follow up if the
            property appears to fit current rental, renovation, or investor
            purchase criteria.
          </p>
          <div className="city-actions" style={{ justifyContent: "center" }}>
            <CityCtaLink
              className="city-btn city-btn-primary"
              href="/#offer"
              citySlug={location.slug}
              ctaLabel="Submit My Property"
            >
              Submit My Property
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
