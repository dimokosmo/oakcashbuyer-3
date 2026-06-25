import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proper Review Request Received | Proper Home Options",
  description:
    "Your Proper Review request was received and will be reviewed based on the property, timeline, and goals you shared.",
};

const nextSteps = [
  "Dimitri will review the property details and your stated goals",
  "Relevant paths may include a direct sale, listing, refinance conversation, rental, repair, or hold strategy",
  "You may receive follow-up questions before any useful range or recommendation can be discussed",
  "You remain free to compare providers and decide whether to take any next step",
];

export default function ThankYouPage() {
  return (
    <main className="thanks-page">
      <style>{`
        .thanks-page{min-height:100vh;background:#F7F4EE;color:#1D2A25;font-family:'Outfit',sans-serif;padding:100px 24px 54px;display:grid;place-items:center;}
        .thanks-shell{width:min(940px,100%);}
        .thanks-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;margin-bottom:28px;}
        .thanks-mark{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;background:#365347;color:#fff;font-family:'DM Serif Display',serif;font-size:20px;}
        .thanks-card{background:#FFFDF9;border:1px solid #D9DED8;border-radius:10px;padding:clamp(28px,6vw,58px);box-shadow:0 22px 70px rgba(29,42,37,.08);}
        .thanks-kicker{font-size:11px;color:#527264;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:15px;}
        h1{font-family:'DM Serif Display',serif;font-size:clamp(40px,6vw,64px);font-weight:400;line-height:1.05;letter-spacing:0;margin:0 0 18px;max-width:760px;}
        .thanks-copy{font-size:17px;line-height:1.75;color:#657169;max-width:730px;margin:0 0 34px;}
        .thanks-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:start;}
        .thanks-list{list-style:none;padding:0;margin:0;display:grid;gap:12px;}
        .thanks-list li{display:flex;gap:11px;padding:14px 15px;border:1px solid #D9DED8;border-radius:8px;font-size:14px;line-height:1.55;color:#34453E;}
        .thanks-check{color:#527264;font-weight:700;}
        .thanks-note{background:#E7EEE9;border-radius:8px;padding:22px;font-size:12px;line-height:1.75;color:#34453E;}
        .thanks-note strong{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#527264;margin-bottom:8px;}
        .thanks-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px;}
        .thanks-button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:0 21px;border-radius:8px;font-size:14px;font-weight:700;}
        .thanks-primary{background:#365347;color:#fff}.thanks-secondary{border:1px solid #C8D0CA;color:#1D2A25;}
        @media(max-width:720px){.thanks-page{padding:78px 18px 36px;align-items:start}.thanks-grid{grid-template-columns:1fr}.thanks-actions{display:grid}.thanks-button{width:100%}}
      `}</style>

      <div className="thanks-shell">
        <Link className="thanks-brand" href="/">
          <span className="thanks-mark">P</span>
          <span>Proper Home Options</span>
        </Link>
        <section className="thanks-card">
          <div className="thanks-kicker">Request received</div>
          <h1>Your Proper Review request was received.</h1>
          <p className="thanks-copy">
            Dimitri will review the information you shared and follow up with
            practical paths that may deserve a closer look. This is a starting
            point for comparison, not a requirement to sell, list, refinance,
            or use a particular provider.
          </p>
          <div className="thanks-grid">
            <ul className="thanks-list">
              {nextSteps.map((step) => (
                <li key={step}>
                  <span className="thanks-check">✓</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <aside className="thanks-note">
              <strong>Important disclosure</strong>
              Proper Home Options is not an appraisal, lender, legal advisor,
              tax advisor, or financial advisor. Any ranges or options discussed
              require additional review and are not offers or guarantees.
            </aside>
          </div>
          <div className="thanks-actions">
            <Link className="thanks-button thanks-primary" href="/#report">Submit Another Property</Link>
            <Link className="thanks-button thanks-secondary" href="/">Return Home</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
