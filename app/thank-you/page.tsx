import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Review Received | OaklandCash",
  description:
    "Your investor property review request was received. Dimitrios Kosmidis will review the submitted property details.",
};

const disclosure =
  "Dimitrios Kosmidis is a licensed Michigan real estate professional and real estate investor. This site is intended for homeowners interested in a possible direct sale, investor purchase, or off-market property review. Not every property will receive an offer. Submitting a property does not create an agency relationship or obligation to sell.";

const steps = [
  "I'll review the property details",
  "I may look at condition, location, repair scope, occupancy, and rental or resale potential",
  "If it looks like a fit, I'll reach out for a direct conversation",
  "Not every property receives an offer",
];

export default function ThankYouPage() {
  return (
    <main className="ty-page">
      <style>{`
        .ty-page{min-height:100vh;background:#0C0C0C;color:#E8E4DC;font-family:'Outfit',sans-serif;position:relative;overflow:hidden;padding:120px 24px 48px;display:flex;align-items:center;}
        .ty-page::before{content:'';position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(232,168,76,0.12),transparent 70%);filter:blur(90px);top:-120px;right:-80px;}
        .ty-page::after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(245,240,232,0.04),transparent 70%);filter:blur(90px);bottom:6%;left:-120px;}
        .ty-shell{max-width:980px;margin:0 auto;width:100%;position:relative;z-index:1;}
        .ty-badge{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;color:#E8A84C;padding:9px 16px;border-radius:100px;border:1px solid rgba(232,168,76,0.2);background:rgba(232,168,76,0.05);margin-bottom:24px;text-transform:uppercase;letter-spacing:0.08em;}
        .ty-dot{width:7px;height:7px;background:#E8A84C;border-radius:50%;}
        .ty-card{background:#151515;border:1px solid rgba(255,255,255,0.06);border-radius:22px;padding:46px 40px;position:relative;overflow:hidden;}
        .ty-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#E8A84C,transparent 80%);}
        h1{font-family:'DM Serif Display',serif;font-size:clamp(38px,6vw,64px);line-height:1.06;color:#F5F0E8;letter-spacing:0;margin:0 0 18px;}
        .ty-body{font-size:18px;line-height:1.75;color:#9A948A;max-width:720px;margin:0 0 34px;}
        .ty-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:34px;align-items:start;}
        .ty-list{display:grid;gap:12px;margin:0;padding:0;list-style:none;}
        .ty-list li{display:flex;gap:12px;align-items:flex-start;background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;color:#D4CCBC;font-size:14px;line-height:1.55;}
        .ty-check{color:#E8A84C;flex:0 0 auto;margin-top:1px;}
        .ty-panel{background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;}
        .ty-panel-title{font-size:11px;color:#E8A84C;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:12px;}
        .ty-disclosure{font-size:12px;line-height:1.7;color:#6B665E;margin:0;}
        .ty-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px;}
        .ty-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.25s ease;}
        .ty-btn-primary{background:#E8A84C;color:#0C0C0C;}
        .ty-btn-primary:hover{background:#F2C97E;transform:translateY(-1px);}
        .ty-btn-secondary{border:1px solid rgba(255,255,255,0.12);color:#F5F0E8;background:transparent;}
        .ty-btn-secondary:hover{border-color:#E8A84C;color:#E8A84C;}
        @media(max-width:760px){.ty-page{padding:96px 18px 36px;align-items:flex-start}.ty-card{padding:34px 22px}.ty-grid{grid-template-columns:1fr}.ty-body{font-size:16px}.ty-actions{flex-direction:column}.ty-btn{width:100%}}
      `}</style>

      <div className="ty-shell">
        <div className="ty-badge">
          <span className="ty-dot" />
          Local Investor Review
        </div>
        <section className="ty-card">
          <h1>Your Property Review Was Received</h1>
          <p className="ty-body">
            I'll review the details and follow up if the property appears to fit
            my current rental, renovation, or investor purchase criteria. If
            another path appears to make more sense, I'll be direct about that.
          </p>

          <div className="ty-grid">
            <ul className="ty-list">
              {steps.map((step) => (
                <li key={step}>
                  <span className="ty-check">✓</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <aside className="ty-panel">
              <div className="ty-panel-title">Disclosure</div>
              <p className="ty-disclosure">{disclosure}</p>
            </aside>
          </div>

          <div className="ty-actions">
            <Link className="ty-btn ty-btn-primary" href="/#offer">
              Submit Another Property
            </Link>
            <Link className="ty-btn ty-btn-secondary" href="/">
              Return Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
