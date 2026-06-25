import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Disclaimer | Proper Home Options",
  description:
    "Important terms and disclosures for Proper Home Options reports and property-option conversations.",
};

const sections = [
  {
    title: "Professional and Investor Role",
    body: [
      "Dimitri Kosmidis is a licensed Michigan real estate professional and real estate investor. Proper Home Options helps homeowners compare practical property paths, which may include a direct sale, traditional listing, refinance conversation, rental, repair, or hold strategy.",
      "If a traditional listing or other real estate service appears to be a better fit, that option may be discussed separately and would require its own disclosures and written agreement.",
    ],
  },
  {
    title: "No Agency Relationship",
    body: [
      "Submitting a property or communicating through this site does not create an agency, brokerage, fiduciary, advisory, or other professional relationship.",
      "No seller is obligated to list, sell, negotiate, or enter into a transaction because information was submitted.",
    ],
  },
  {
    title: "Review Is Not an Appraisal or Offer",
    body: [
      "A property review and preliminary investor fit screen are not an appraisal, inspection, valuation, offer, approval, or guarantee.",
      "Not every property will receive an offer. Any indication of potential fit is preliminary and depends on further review, due diligence, access, title, condition, financing, and other relevant factors.",
    ],
  },
  {
    title: "Seller Options",
    body: [
      "Homeowners may have alternatives, including listing traditionally, selling as-is, exploring a refinance conversation with a licensed mortgage professional, making repairs before sale, continuing to rent or hold the property, or selling to another buyer or investor.",
      "Sellers should consider their goals, timing, costs, risks, and available professional advice before choosing a path.",
    ],
  },
  {
    title: "Use of Submitted Information",
    body: [
      "Information submitted through the site may be used to evaluate possible investor interest, communicate with the seller, request additional details, and decide whether a direct conversation is practical.",
      "Submission does not require Dimitri or any related party to make an offer or continue discussions. Dimitri or his investor network may benefit from a purchase, and Dimitri may benefit from separately agreed real estate services.",
    ],
  },
  {
    title: "Written Transaction Terms",
    body: [
      "Any potential transaction would need to be reviewed separately and documented in writing. Only the final signed documents would describe the actual parties, price, timing, contingencies, costs, representations, and obligations.",
      "Homeowners may wish to consult an attorney, tax professional, financial advisor, or other qualified professional regarding their individual circumstances.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <main className="legal-page">
      <style>{`
        .legal-page{min-height:100vh;background:#F7F4EE;color:#1D2A25;font-family:'Outfit',sans-serif;padding:118px 24px 64px;}
        .legal-shell{max-width:920px;margin:0 auto;}
        .legal-back{display:inline-flex;color:#657169;font-size:13px;margin-bottom:30px;transition:color .2s ease;}
        .legal-back:hover{color:#365347;}
        .legal-kicker{font-size:11px;font-weight:700;color:#527264;text-transform:uppercase;letter-spacing:.12em;margin-bottom:15px;}
        h1{font-family:'DM Serif Display',serif;font-size:clamp(42px,7vw,68px);line-height:1.04;letter-spacing:0;color:#1D2A25;margin:0 0 20px;}
        .legal-lede{font-size:17px;line-height:1.75;color:#657169;max-width:760px;margin:0 0 42px;}
        .legal-card{background:#FFFDF9;border:1px solid #D9DED8;border-radius:10px;padding:38px;}
        .legal-section{padding:28px 0;border-bottom:1px solid #D9DED8;}
        .legal-section:first-child{padding-top:0}.legal-section:last-child{border-bottom:0;padding-bottom:0}
        h2{font-family:'DM Serif Display',serif;font-size:27px;letter-spacing:0;color:#1D2A25;margin:0 0 13px;}
        .legal-section p{font-size:15px;line-height:1.8;color:#56645D;margin:0 0 12px;}
        .legal-section p:last-child{margin-bottom:0}
        .legal-note{margin-top:30px;padding:20px 22px;border:1px solid #CCD8D0;background:#E7EEE9;border-radius:8px;font-size:13px;line-height:1.7;color:#34453E;}
        .legal-links{display:flex;gap:18px;flex-wrap:wrap;margin-top:30px;font-size:13px;font-weight:600;color:#365347;}
        .legal-links a:hover{color:#527264;}
        @media(max-width:640px){.legal-page{padding:92px 18px 42px}.legal-card{padding:28px 20px}.legal-lede{font-size:16px}}
      `}</style>

      <div className="legal-shell">
        <Link className="legal-back" href="/">
          Back to Proper Home Options
        </Link>
        <div className="legal-kicker">Terms</div>
        <h1>Terms &amp; Disclaimer</h1>
        <p className="legal-lede">
          These terms explain the limits of the preliminary property review and
          what submitting information does, and does not, mean.
        </p>

        <article className="legal-card">
          {sections.map((section) => (
            <section className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>

        <div className="legal-note">
          These terms are general site disclosures and are not legal advice or
          attorney-approved transaction documents. Legal and employing-broker
          review is recommended before final publication or paid advertising.
        </div>
        <nav className="legal-links" aria-label="Legal pages">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/">Return Home</Link>
        </nav>
      </div>
    </main>
  );
}
