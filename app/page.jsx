"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { getLeadAttribution } from "../lib/leadAttribution";
import { investorFitScoreRange, trackEvent } from "../lib/analytics";

const OPTIONS = [
  {
    number: "01",
    title: "Cash offer",
    copy: "A direct, as-is sale may fit when speed, repairs, occupancy, or simplicity matter most.",
  },
  {
    number: "02",
    title: "Traditional sale",
    copy: "Market exposure may create a stronger outcome when time, condition, and preparation allow.",
  },
  {
    number: "03",
    title: "Refinance conversation",
    copy: "A licensed mortgage professional can help you explore whether keeping the home is realistic.",
  },
  {
    number: "04",
    title: "Rent or hold",
    copy: "Keeping the property may make sense when rental demand, equity, and your timeline align.",
  },
  {
    number: "05",
    title: "Repair before selling",
    copy: "Targeted improvements can sometimes improve marketability or preserve more of the home's value.",
  },
  {
    number: "06",
    title: "Another practical path",
    copy: "Every situation is different. The useful answer may combine timing, repairs, financing, and planning.",
  },
];

const PROCESS = [
  ["Share the property", "Tell us about the home, its condition, and what you are considering."],
  ["We review the details", "We look at the property, local market context, timeline, and your stated goals."],
  ["See practical options", "The Proper Review organizes paths worth considering, including important tradeoffs."],
  ["You decide", "There is no obligation to use a particular buyer, agent, lender, or recommendation."],
];

const REPORT_ITEMS = [
  ["01", "Market sale range", "A preliminary range informed by available property details and relevant market activity."],
  ["02", "As-is cash offer range", "A possible direct-sale range when investor interest and property fit can be evaluated."],
  ["03", "Listing considerations", "Preparation, timing, exposure, costs, and questions to explore before a traditional sale."],
  ["04", "Refinance conversation", "Topics to review separately with a licensed mortgage professional if keeping the home matters."],
  ["05", "Rental or hold considerations", "Occupancy, management, repair, equity, and timing factors that may affect a hold strategy."],
  ["06", "Repair-before-selling considerations", "Improvements that may change marketability, cost, timing, or the range of available paths."],
  ["07", "Suggested next step", "A practical direction for further comparison, not a requirement or guaranteed recommendation."],
];

const FAQS = [
  ["Is this a cash offer company?", "Not only. A direct purchase may be one possible path, and Dimitri or his investor network may have interest in some properties. The purpose of the report is to compare that path with listing, refinancing, renting, holding, repairs, or another practical option."],
  ["Do I have to sell my home?", "No. Submitting information does not create an obligation to sell, list, refinance, or use any provider."],
  ["Is this an appraisal?", "No. The Proper Review is an informal decision-support review, not a licensed appraisal, inspection, or guarantee of value."],
  ["What if I want to list instead?", "If market exposure appears worth considering, Dimitri can discuss that option separately in his capacity as a Michigan real estate professional. Any agency relationship would require separate written documents."],
  ["What if I want to refinance instead of selling?", "The report may identify questions worth discussing with a licensed mortgage professional. Proper Home Options is not a lender and does not provide loan approval."],
  ["What if my property needs repairs?", "Share the condition as it is today. Repair needs can affect direct-sale, listing, rental, and hold scenarios differently."],
  ["Can I compare multiple options?", "Yes. Comparing realistic tradeoffs is the point. You are encouraged to evaluate alternatives before making a decision."],
  ["What areas do you serve?", "The initial focus is Oakland County and nearby Southeast Michigan communities. Property location and the type of help requested will determine what is practical."],
  ["What happens after I submit?", "Dimitri reviews the information and follows up when there is enough context for a useful conversation. Not every submission results in an offer or transaction."],
];

const DISCLOSURE =
  "Proper Home Options is not an appraisal, lender, legal advisor, tax advisor, or financial advisor. Any property review, value range, offer range, or option discussed is based on available property information, market activity, property condition, and the homeowner's stated goals. In some cases, Dimitri Kosmidis or his investor network may be interested in purchasing the property. In other cases, listing, refinancing, renting, holding, making repairs, or another option may be worth considering. Homeowners are encouraged to compare options and consult qualified legal, tax, financial, or mortgage professionals before making a decision.";

const STEPS = [
  { id: "property", label: "Property" },
  { id: "goals", label: "Goals" },
  { id: "contact", label: "Contact" },
];

const initialForm = {
  address: "",
  city: "",
  state: "MI",
  zip: "",
  propertyType: "",
  condition: "",
  considering: "",
  timeline: "",
  mainGoal: "",
  mortgageBalance: "",
  occupancy: "",
  ownership: "",
  knownIssues: "",
  repairsNeeded: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
};

function calculateInvestorFit(data) {
  const combined = [
    data.condition,
    data.considering,
    data.timeline,
    data.mainGoal,
    data.occupancy,
    data.knownIssues,
    data.repairsNeeded,
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;

  if (/(needs work|major repairs|damaged|as-is)/.test(combined)) score += 2;
  if (/(vacant|tenant)/.test(data.occupancy.toLowerCase())) score += 2;
  if (/(single-family|duplex|multifamily|townhome)/.test(data.propertyType.toLowerCase())) score += 1;
  if (/(asap|30 to 60 days)/.test(data.timeline.toLowerCase())) score += 2;
  if (/(sell for cash|fastest path|avoid repairs)/.test(combined)) score += 2;

  return {
    score,
    result:
      score >= 7
        ? "Strong Potential Fit"
        : score >= 4
          ? "Possible Fit"
          : "Needs Manual Review",
  };
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Header() {
  const [open, setOpen] = useState(false);
  const go = (id, label) => {
    trackEvent("homepage_cta_clicked", {
      cta_label: label,
      lead_type: "proper_review",
    });
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Proper Home Options home">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span>Proper Home Options</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#options">Your options</a>
        <a href="#how-it-works">How it works</a>
        <a href="#about">About</a>
        <a href="#faq">FAQ</a>
      </nav>
      <button className="header-cta" onClick={() => go("report", "Header report CTA")}>
        Start My Proper Review
      </button>
      <button
        className="menu-button"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#options" onClick={() => setOpen(false)}>Your options</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
          <button onClick={() => go("report", "Mobile report CTA")}>Start My Proper Review</button>
        </nav>
      ) : null}
    </header>
  );
}

function HomeOptionsForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const started = useRef(false);
  const fit = useMemo(() => calculateInvestorFit(formData), [formData]);

  const update = (field, value) => {
    if (field !== "website" && !started.current) {
      started.current = true;
      trackEvent("investor_form_started", { lead_type: "proper_review" });
    }
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, contact: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (step === 0) {
      if (!formData.address.trim()) nextErrors.address = "Enter the property address.";
      if (!formData.city.trim()) nextErrors.city = "Enter the city.";
      if (!formData.zip.trim()) nextErrors.zip = "Enter the ZIP code.";
      if (!formData.propertyType) nextErrors.propertyType = "Select a property type.";
      if (!formData.condition) nextErrors.condition = "Select the current condition.";
    } else if (step === 1) {
      if (!formData.considering) nextErrors.considering = "Select what you are considering.";
      if (!formData.timeline) nextErrors.timeline = "Select an ideal timeline.";
      if (!formData.mainGoal) nextErrors.mainGoal = "Select your main goal.";
    } else {
      if (!formData.firstName.trim()) nextErrors.firstName = "Enter your first name.";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        nextErrors.email = "Enter a valid email.";
      }
      if (!formData.email.trim() && !formData.phone.trim()) {
        nextErrors.contact = "Add a phone number or email.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    trackEvent("investor_form_step_completed", {
      form_step: STEPS[step].id,
      lead_type: "proper_review",
    });
    setStep((current) => current + 1);
  };

  const submit = async () => {
    if (!validate()) return;
    const scoreRange = investorFitScoreRange(fit.score);
    setSubmitting(true);
    setSubmitError("");
    trackEvent("investor_fit_calculated", {
      investor_fit: fit.result,
      investor_fit_score_range: scoreRange,
      lead_type: "proper_review",
    });
    trackEvent("investor_form_submitted", {
      form_step: STEPS[step].id,
      investor_fit: fit.result,
      investor_fit_score_range: scoreRange,
      lead_type: "proper_review",
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...getLeadAttribution(),
          investorFit: fit.result,
          investorFitScore: fit.score,
          intent: "proper-review",
          source: "Proper Home Options website",
          sourcePage: window.location.pathname,
          submittedAt: new Date().toISOString(),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.success) throw new Error("Submission failed");
      trackEvent("investor_lead_success", {
        investor_fit: fit.result,
        investor_fit_score_range: scoreRange,
        lead_type: "proper_review",
      });
      window.location.assign("/thank-you");
    } catch {
      trackEvent("investor_lead_error", {
        error_type: "submission_failed",
        lead_type: "proper_review",
      });
      setSubmitError(
        "We could not send your request. Please check your details and try again."
      );
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="form-loading" role="status" aria-live="polite">
        <span className="spinner" />
        <h3>Sending your property details</h3>
        <p>Your request is being prepared for review.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="form-progress" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((item, index) => (
          <Fragment key={item.id}>
            <div className={`progress-step ${index <= step ? "active" : ""}`}>
              <span>{index < step ? "✓" : index + 1}</span>
              <small>{item.label}</small>
            </div>
            {index < STEPS.length - 1 ? <i className={index < step ? "active" : ""} /> : null}
          </Fragment>
        ))}
      </div>

      {step === 0 ? (
        <div className="form-fields">
          <Field label="Property address" error={errors.address} wide>
            <input value={formData.address} onChange={(event) => update("address", event.target.value)} placeholder="123 Main Street" autoComplete="street-address" />
          </Field>
          <Field label="City" error={errors.city}>
            <input value={formData.city} onChange={(event) => update("city", event.target.value)} placeholder="Rochester Hills" autoComplete="address-level2" />
          </Field>
          <Field label="ZIP code" error={errors.zip}>
            <input value={formData.zip} onChange={(event) => update("zip", event.target.value)} placeholder="48309" inputMode="numeric" maxLength={5} autoComplete="postal-code" />
          </Field>
          <Field label="Property type" error={errors.propertyType}>
            <select value={formData.propertyType} onChange={(event) => update("propertyType", event.target.value)}>
              <option value="">Select one</option>
              <option>Single-family</option>
              <option>Condo</option>
              <option>Townhome</option>
              <option>Duplex</option>
              <option>Multifamily</option>
              <option>Land</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Current condition" error={errors.condition}>
            <select value={formData.condition} onChange={(event) => update("condition", event.target.value)}>
              <option value="">Select one</option>
              <option>Move-in ready</option>
              <option>Some updates needed</option>
              <option>Needs work</option>
              <option>Major repairs needed</option>
              <option>Damaged or difficult to finance</option>
            </select>
          </Field>
          <Field label="Current occupancy" optional wide>
            <select value={formData.occupancy} onChange={(event) => update("occupancy", event.target.value)}>
              <option value="">Select if known</option>
              <option>Owner-occupied</option>
              <option>Tenant-occupied</option>
              <option>Vacant</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="form-fields">
          <Field label="What are you considering?" error={errors.considering} wide>
            <select value={formData.considering} onChange={(event) => update("considering", event.target.value)}>
              <option value="">Select the closest fit</option>
              <option>Sell for cash</option>
              <option>List the property</option>
              <option>Explore a refinance conversation</option>
              <option>Rent it</option>
              <option>Repair before selling</option>
              <option>Not sure yet</option>
            </select>
          </Field>
          <Field label="Ideal timeline" error={errors.timeline}>
            <select value={formData.timeline} onChange={(event) => update("timeline", event.target.value)}>
              <option value="">Select one</option>
              <option>ASAP</option>
              <option>30 to 60 days</option>
              <option>3 to 6 months</option>
              <option>No rush</option>
            </select>
          </Field>
          <Field label="Main goal" error={errors.mainGoal}>
            <select value={formData.mainGoal} onChange={(event) => update("mainGoal", event.target.value)}>
              <option value="">Select one</option>
              <option>Most money</option>
              <option>Fastest path</option>
              <option>Avoid repairs</option>
              <option>Keep the property</option>
              <option>Lower payment</option>
              <option>Access equity</option>
              <option>Not sure</option>
            </select>
          </Field>
          <Field label="Approximate mortgage balance" optional wide>
            <input value={formData.mortgageBalance} onChange={(event) => update("mortgageBalance", event.target.value)} placeholder="Optional estimate" inputMode="decimal" />
          </Field>
          <Field label="Known issues or context" optional wide>
            <textarea value={formData.knownIssues} onChange={(event) => update("knownIssues", event.target.value)} placeholder="Repairs, tenants, inherited property, timing, or anything else that may help." rows={4} />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="form-fields">
          <Field label="First name" error={errors.firstName}>
            <input value={formData.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" />
          </Field>
          <Field label="Last name" optional>
            <input value={formData.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" />
          </Field>
          <Field label="Phone" optional>
            <input value={formData.phone} onChange={(event) => update("phone", event.target.value)} type="tel" autoComplete="tel" placeholder="(248) 555-0100" />
          </Field>
          <Field label="Email" optional error={errors.email}>
            <input value={formData.email} onChange={(event) => update("email", event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>
          {errors.contact ? <p className="form-error wide-error">{errors.contact}</p> : null}
          <div className="honeypot" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={formData.website} onChange={(event) => update("website", event.target.value)} /></label>
          </div>
          <div className="contact-note">
            Your information is used to review the property and follow up about
            your request. Submitting does not create an agency relationship or
            obligation to use any option.
          </div>
        </div>
      ) : null}

      {submitError ? <p className="submit-error" role="alert">{submitError}</p> : null}

      <div className="form-actions">
        {step > 0 ? <button className="button button-quiet" type="button" onClick={() => setStep((current) => current - 1)}>Back</button> : <span />}
        <button className="button button-primary" type="button" onClick={step === 2 ? submit : next}>
          {step === 2 ? "Start My Proper Review" : "Continue"}
        </button>
      </div>
      <p className="form-reassurance">No pressure. No automatic commitment. Compare before you decide.</p>
    </div>
  );
}

function Field({ label, optional, error, wide, children }) {
  return (
    <label className={`field ${wide ? "field-wide" : ""}`}>
      <span>{label}{optional ? <em>Optional</em> : null}</span>
      {children}
      {error ? <small className="form-error">{error}</small> : null}
    </label>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const cta = (label) => {
    trackEvent("homepage_cta_clicked", {
      cta_label: label,
      lead_type: "proper_review",
    });
    scrollToId("report");
  };

  return (
    <div id="top">
      <style>{`
        :root{--ink:#1D2A25;--ink-soft:#34453E;--sage:#527264;--sage-dark:#365347;--sage-pale:#E7EEE9;--paper:#F7F4EE;--white:#FFFDF9;--line:#D9DED8;--muted:#657169;--gold:#C08B45;--error:#A53E32;--shadow:0 22px 70px rgba(29,42,37,.10)}
        *{box-sizing:border-box}
        body{background:var(--paper);color:var(--ink);font-family:'Outfit',sans-serif}
        button,input,select,textarea{font:inherit}
        button,a{touch-action:manipulation}
        .site-header{height:74px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 clamp(20px,4vw,64px);position:absolute;top:0;left:0;right:0;z-index:20;color:#fff;border-bottom:1px solid rgba(255,255,255,.24)}
        .brand{display:flex;align-items:center;gap:11px;font-weight:700;font-size:16px;width:max-content}
        .brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:#fff;color:var(--sage-dark);font-family:'DM Serif Display',serif;font-size:21px}
        .desktop-nav{display:flex;gap:28px;font-size:14px;font-weight:500}
        .desktop-nav a{opacity:.88}.desktop-nav a:hover{opacity:1}
        .header-cta{justify-self:end;border:1px solid rgba(255,255,255,.56);background:rgba(255,255,255,.12);color:#fff;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer}
        .menu-button,.mobile-nav{display:none}
        .hero{min-height:min(820px,92vh);position:relative;display:flex;align-items:center;color:#fff;background-image:linear-gradient(90deg,rgba(24,43,35,.96) 0%,rgba(24,43,35,.84) 44%,rgba(24,43,35,.48) 72%,rgba(24,43,35,.30) 100%),url('/images/proper-home-options-hero.jpg');background-size:cover;background-position:center}
        .hero-inner{width:min(1220px,calc(100% - 48px));margin:0 auto;padding:130px 0 72px;display:grid;grid-template-columns:minmax(0,1fr) 410px;gap:70px;align-items:center}
        .hero-message{min-width:0}
        .eyebrow{display:flex;align-items:center;gap:9px;text-transform:uppercase;letter-spacing:.1em;font-size:11px;font-weight:700;margin-bottom:20px}
        .eyebrow::before{content:'';width:26px;height:1px;background:currentColor}
        .hero h1{font-family:'DM Serif Display',serif;font-weight:400;font-size:clamp(46px,5.8vw,76px);line-height:1.01;letter-spacing:0;max-width:740px;margin:0 0 24px;text-wrap:balance}
        .hero-copy{max-width:650px;font-size:17px;line-height:1.7;color:rgba(255,255,255,.84);margin:0 0 32px}
        .hero-actions{display:flex;gap:12px;flex-wrap:wrap}
        .button{min-height:50px;display:inline-flex;align-items:center;justify-content:center;padding:0 21px;border-radius:8px;border:1px solid transparent;font-weight:700;font-size:14px;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease}
        .button:hover{transform:translateY(-1px)}
        .button-primary{background:var(--sage-dark);color:#fff}.button-primary:hover{background:#2C463B}
        .hero .button-primary{background:#fff;color:var(--ink)}.hero .button-primary:hover{background:#F3F0E9}
        .button-secondary{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.52);color:#fff}
        .button-quiet{background:transparent;border-color:var(--line);color:var(--ink)}
        .trust-line{display:flex;align-items:center;gap:10px;margin-top:28px;font-size:13px;color:rgba(255,255,255,.76)}
        .trust-avatar{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--gold);color:#fff;font-weight:700}
        .review-preview{background:rgba(255,253,249,.97);color:var(--ink);border:1px solid rgba(255,255,255,.74);border-radius:10px;padding:25px;box-shadow:0 24px 70px rgba(12,27,21,.24);backdrop-filter:blur(10px)}
        .review-preview-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:18px;border-bottom:1px solid var(--line)}
        .review-preview-brand{font-family:'DM Serif Display',serif;font-size:25px;line-height:1.05}
        .review-preview-brand small{display:block;font-family:'Outfit',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--sage);font-weight:700;margin-bottom:6px}
        .review-badge{font-size:10px;font-weight:700;color:var(--sage-dark);background:var(--sage-pale);border-radius:999px;padding:7px 9px;white-space:nowrap}
        .review-address{padding:17px 0 14px}.review-address strong{display:block;font-size:13px;margin-bottom:3px}.review-address span{font-size:11px;color:var(--muted)}
        .review-paths{display:grid;gap:8px}
        .review-path{display:grid;grid-template-columns:28px 1fr auto;gap:9px;align-items:center;padding:9px 10px;border:1px solid var(--line);border-radius:7px;background:#fff}
        .review-icon{width:28px;height:28px;border-radius:6px;display:grid;place-items:center;background:var(--sage-pale);color:var(--sage-dark);font-size:11px;font-weight:800}
        .review-path strong{font-size:12px}.review-path span:last-child{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700}
        .review-preview-foot{display:flex;justify-content:space-between;gap:16px;padding-top:16px;margin-top:16px;border-top:1px solid var(--line);font-size:10px;color:var(--muted)}
        .section{padding:104px 24px}
        .section-inner{width:min(1160px,100%);margin:0 auto}
        .section-kicker{font-size:11px;font-weight:700;color:var(--sage);text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px}
        .section h2{font-family:'DM Serif Display',serif;font-weight:400;font-size:clamp(36px,5vw,58px);line-height:1.08;letter-spacing:0;margin:0;color:var(--ink);text-wrap:balance}
        .section-lede{font-size:17px;line-height:1.75;color:var(--muted);max-width:690px;margin:20px 0 0}
        .problem-grid{display:grid;grid-template-columns:.88fr 1.12fr;gap:80px;align-items:start}
        .problem-copy{font-size:18px;line-height:1.8;color:var(--ink-soft);padding-top:8px}
        .problem-copy p{margin:0 0 20px}
        .options-section{background:var(--white)}
        .section-heading{display:flex;align-items:end;justify-content:space-between;gap:40px;margin-bottom:46px}
        .section-heading .section-lede{max-width:530px}
        .option-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
        .option-card{min-height:238px;padding:28px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--white)}
        .option-number{font-size:11px;font-weight:700;color:var(--gold);margin-bottom:46px}
        .option-card h3{font-family:'DM Serif Display',serif;font-size:25px;font-weight:400;letter-spacing:0;margin:0 0 10px}
        .option-card p{font-size:14px;line-height:1.65;color:var(--muted);margin:0}
        .process-grid{display:grid;grid-template-columns:.72fr 1.28fr;gap:86px;align-items:start}
        .process-list{border-top:1px solid var(--line)}
        .process-item{display:grid;grid-template-columns:42px 1fr;gap:18px;padding:24px 0;border-bottom:1px solid var(--line)}
        .process-item>span{color:var(--sage);font-weight:700;font-size:13px;padding-top:3px}
        .process-item h3{font-size:17px;margin:0 0 6px}.process-item p{font-size:14px;line-height:1.65;color:var(--muted);margin:0}
        .proper-review-section{background:#ECE8E0}
        .proper-review-intro{max-width:760px;margin-bottom:44px}
        .proper-review-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #CDD3CE;border-left:1px solid #CDD3CE}
        .proper-review-card{padding:25px;min-height:220px;background:rgba(255,253,249,.62);border-right:1px solid #CDD3CE;border-bottom:1px solid #CDD3CE}
        .proper-review-card:last-child{grid-column:span 2;background:var(--sage-dark);color:#fff}
        .proper-review-code{font-size:10px;font-weight:800;color:var(--gold);letter-spacing:.08em;margin-bottom:38px}
        .proper-review-card:last-child .proper-review-code{color:#E8C48E}
        .proper-review-card h3{font-family:'DM Serif Display',serif;font-size:23px;font-weight:400;letter-spacing:0;margin:0 0 9px}
        .proper-review-card p{font-size:13px;line-height:1.65;color:var(--muted);margin:0}
        .proper-review-card:last-child p{color:rgba(255,255,255,.72)}
        .report-section{background:var(--sage-dark);color:#fff}
        .report-layout{display:grid;grid-template-columns:.76fr 1.24fr;gap:70px;align-items:start}
        .report-section .section-kicker{color:#BDD0C5}.report-section h2{color:#fff}
        .report-section .section-lede{color:rgba(255,255,255,.72)}
        .report-principles{display:grid;gap:12px;margin-top:32px}
        .report-principle{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;color:rgba(255,255,255,.84);font-size:13px;line-height:1.55}
        .report-principle span{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.1);color:#E8C48E;font-size:10px;font-weight:800}
        .form-shell{background:var(--white);color:var(--ink);padding:34px;border-radius:8px;box-shadow:var(--shadow)}
        .form-shell h3{font-family:'DM Serif Display',serif;font-size:31px;font-weight:400;letter-spacing:0;margin:0 0 7px}
        .form-intro{font-size:14px;line-height:1.6;color:var(--muted);margin:0 0 25px}
        .form-progress{display:flex;align-items:center;margin-bottom:30px}
        .progress-step{display:flex;align-items:center;gap:7px;color:#929A95}.progress-step.active{color:var(--ink)}
        .progress-step span{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);font-size:11px;font-weight:700}.progress-step.active span{background:var(--sage);color:#fff;border-color:var(--sage)}
        .progress-step small{font-size:11px;font-weight:700}
        .form-progress i{height:1px;background:var(--line);flex:1;margin:0 10px}.form-progress i.active{background:var(--sage)}
        .form-fields{display:grid;grid-template-columns:1fr 1fr;gap:17px}
        .field{display:flex;flex-direction:column;gap:7px}.field-wide{grid-column:1/-1}
        .field>span{font-size:12px;font-weight:700;color:var(--ink-soft);display:flex;justify-content:space-between;gap:10px}
        .field em{font-style:normal;font-weight:500;color:#8A938E}
        .field input,.field select,.field textarea{width:100%;border:1px solid #CBD2CD;background:#fff;color:var(--ink);border-radius:7px;padding:12px 13px;outline:none;min-height:46px}
        .field textarea{resize:vertical;line-height:1.5}.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--sage);box-shadow:0 0 0 3px rgba(82,114,100,.12)}
        .form-error{font-size:11px;color:var(--error);font-style:normal}.wide-error{grid-column:1/-1;margin:0}
        .contact-note{grid-column:1/-1;background:var(--sage-pale);padding:13px 14px;border-radius:7px;font-size:12px;line-height:1.55;color:var(--ink-soft)}
        .honeypot{position:absolute;left:-9999px}
        .submit-error{background:#F9E9E5;color:var(--error);padding:12px;border-radius:7px;font-size:13px;margin:18px 0 0}
        .form-actions{display:flex;justify-content:space-between;gap:12px;margin-top:24px}.form-actions .button-primary{min-width:180px}
        .form-reassurance{text-align:center;font-size:11px;color:#78827C;margin:16px 0 0}
        .form-loading{text-align:center;padding:70px 20px}.form-loading h3{margin:18px 0 6px}.form-loading p{color:var(--muted);margin:0}
        .spinner{width:38px;height:38px;border:3px solid var(--sage-pale);border-top-color:var(--sage);border-radius:50%;display:inline-block;animation:spin .8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .about-section{background:#ECE8E0}
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .about-panel{background:var(--white);border:1px solid var(--line);padding:34px;border-radius:8px}
        .about-name{font-family:'DM Serif Display',serif;font-size:30px;margin-bottom:5px}.about-role{font-size:12px;color:var(--sage);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:22px}
        .about-panel p{font-size:15px;line-height:1.75;color:var(--ink-soft);margin:0 0 16px}.about-panel p:last-child{margin:0}
        .faq-wrap{max-width:900px;margin:0 auto}.faq-wrap>.section-kicker,.faq-wrap>h2{text-align:center}
        .faq-list{margin-top:46px;border-top:1px solid var(--line)}
        .faq-item{border-bottom:1px solid var(--line)}
        .faq-question{width:100%;display:flex;justify-content:space-between;gap:20px;text-align:left;border:0;background:transparent;padding:22px 0;color:var(--ink);font-weight:700;cursor:pointer}
        .faq-question span:last-child{font-size:20px;color:var(--sage);font-weight:400}
        .faq-answer{font-size:14px;line-height:1.75;color:var(--muted);padding:0 42px 22px 0;max-width:800px}
        .final-cta{background:var(--sage-pale);text-align:center;padding:88px 24px}
        .final-cta h2{font-family:'DM Serif Display',serif;font-size:clamp(38px,5vw,58px);font-weight:400;letter-spacing:0;margin:0 auto 16px;max-width:760px}
        .final-cta p{color:var(--muted);margin:0 auto 28px;max-width:610px;line-height:1.7}
        .site-footer{background:var(--ink);color:#fff;padding:66px 24px 30px}
        .footer-inner{width:min(1160px,100%);margin:0 auto}
        .footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:60px;padding-bottom:42px}
        .footer-brand{font-family:'DM Serif Display',serif;font-size:27px;margin-bottom:13px}.footer-copy{font-size:13px;line-height:1.7;color:rgba(255,255,255,.62);max-width:390px}
        .footer-title{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.48);margin-bottom:13px}
        .footer-links{display:grid;gap:9px;font-size:13px;color:rgba(255,255,255,.75)}
        .footer-links a:hover{color:#fff}
        .footer-disclosure{font-size:11px;line-height:1.75;color:rgba(255,255,255,.48);padding:24px 0;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}
        .footer-bottom{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-top:22px;font-size:11px;color:rgba(255,255,255,.44)}
        @media(max-width:900px){
          .site-header{grid-template-columns:1fr auto}.desktop-nav,.header-cta{display:none}.menu-button{display:grid;gap:5px;border:0;background:transparent;padding:10px;cursor:pointer}.menu-button span{width:24px;height:2px;background:#fff}
          .mobile-nav{display:grid;position:absolute;top:74px;left:16px;right:16px;background:var(--white);color:var(--ink);padding:18px;border-radius:8px;box-shadow:var(--shadow);gap:5px}.mobile-nav a{padding:11px}.mobile-nav button{border:0;background:var(--sage-dark);color:#fff;border-radius:7px;padding:13px;font-weight:700;margin-top:6px}
          .hero{min-height:auto;background-position:61% center}.hero-inner{padding:118px 0 66px;grid-template-columns:1fr;gap:38px}.hero-message{max-width:720px}.review-preview{max-width:620px}
          .problem-grid,.process-grid,.report-layout,.about-grid{grid-template-columns:1fr;gap:44px}.option-grid{grid-template-columns:repeat(2,1fr)}
          .proper-review-grid{grid-template-columns:repeat(2,1fr)}.proper-review-card:last-child{grid-column:span 1}
          .section-heading{display:block}.footer-grid{grid-template-columns:1.3fr 1fr;gap:40px}
        }
        @media(max-width:620px){
          .site-header{height:68px;padding:0 18px}.brand{font-size:14px}.brand-mark{width:30px;height:30px}.mobile-nav{top:68px}
          .hero{align-items:flex-start;background-position:66% center;background-image:linear-gradient(180deg,rgba(24,43,35,.96) 0%,rgba(24,43,35,.88) 58%,rgba(24,43,35,.68) 100%),url('/images/proper-home-options-hero.jpg')}
          .hero-inner{width:calc(100% - 36px);padding:104px 0 44px;gap:30px}.hero h1{font-size:43px}.hero-copy{font-size:16px;line-height:1.6}
          .hero-actions{display:grid}.hero-actions .button{width:100%}.trust-line{align-items:flex-start}
          .review-preview{padding:19px}.review-preview-top{gap:10px}.review-preview-brand{font-size:22px}.review-path{grid-template-columns:26px 1fr}.review-path span:last-child{display:none}.review-preview-foot{display:grid;gap:4px}
          .section{padding:74px 18px}.section h2{font-size:38px}.section-lede{font-size:16px}
          .problem-copy{font-size:16px}.option-grid,.proper-review-grid{grid-template-columns:1fr}.option-card,.proper-review-card{min-height:0}.option-number,.proper-review-code{margin-bottom:28px}
          .form-shell{padding:25px 18px}.form-fields{grid-template-columns:1fr}.field-wide{grid-column:auto}.contact-note,.wide-error{grid-column:auto}
          .form-actions .button-primary{min-width:0;flex:1}.progress-step small{display:none}
          .footer-grid{grid-template-columns:1fr}.footer-bottom{display:grid}
        }
      `}</style>

      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <div className="hero-message">
            <div className="eyebrow">Introducing The Proper Review</div>
            <h1 id="hero-heading">Compare your property options before making your next move.</h1>
            <p className="hero-copy">
              The Proper Review helps homeowners look at possible paths,
              including a cash offer, traditional sale, refinance conversation,
              renting, repairing, or holding the property, based on their goals,
              timeline, and property condition.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => cta("Hero proper review CTA")}>Start My Proper Review</button>
              <button className="button button-secondary" onClick={() => cta("Hero talk CTA")}>Talk Through My Options</button>
            </div>
            <div className="trust-line">
              <span className="trust-avatar" aria-hidden="true">DK</span>
              <span>Led by Dimitri Kosmidis, a licensed Michigan real estate professional and real estate investor.</span>
            </div>
            </div>
            <aside className="review-preview" aria-label="Example Proper Review comparison">
              <div className="review-preview-top">
                <div className="review-preview-brand">
                  <small>Proper Home Options</small>
                  The Proper Review
                </div>
                <span className="review-badge">Guided comparison</span>
              </div>
              <div className="review-address">
                <strong>Your property, viewed from more than one angle</strong>
                <span>Illustrative categories, not a valuation or recommendation</span>
              </div>
              <div className="review-paths">
                {[
                  ["C", "Cash sale", "Compare"],
                  ["L", "Traditional listing", "Compare"],
                  ["R", "Refinance conversation", "Explore"],
                  ["H", "Rent or hold", "Explore"],
                  ["F", "Repair first", "Consider"],
                ].map(([icon, title, status]) => (
                  <div className="review-path" key={title}>
                    <span className="review-icon">{icon}</span>
                    <strong>{title}</strong>
                    <span>{status}</span>
                  </div>
                ))}
              </div>
              <div className="review-preview-foot">
                <span>Based on property details</span>
                <span>Built around your goals</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section">
          <div className="section-inner problem-grid">
            <div>
              <div className="section-kicker">A clearer starting point</div>
              <h2>Most homeowners do not need a sales pitch.</h2>
            </div>
            <div className="problem-copy">
              <p>They need a clear view of their options.</p>
              <p>
                Selling directly may make sense when the home needs work, timing
                matters, or simplicity is valuable. In other situations,
                listing, refinancing, renting, holding, or making repairs may
                create a better outcome.
              </p>
              <p>
                Proper Home Options organizes those paths around your actual
                property and goals, so the conversation starts with context
                rather than pressure.
              </p>
            </div>
          </div>
        </section>

        <section className="section options-section" id="options">
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <div className="section-kicker">Paths worth comparing</div>
                <h2>Your home may give you more than one practical option.</h2>
              </div>
              <p className="section-lede">
                The right path depends on condition, equity, timing, local
                demand, and what matters most to you.
              </p>
            </div>
            <div className="option-grid">
              {OPTIONS.map((option) => (
                <article className="option-card" key={option.title}>
                  <div className="option-number">{option.number}</div>
                  <h3>{option.title}</h3>
                  <p>{option.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-inner process-grid">
            <div>
              <div className="section-kicker">How it works</div>
              <h2>Start with the facts. Decide at your pace.</h2>
              <p className="section-lede">
                The process is designed to reduce confusion, not rush a
                homeowner into one predetermined answer.
              </p>
            </div>
            <div className="process-list">
              {PROCESS.map(([title, copy], index) => (
                <article className="process-item" key={title}>
                  <span>0{index + 1}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section proper-review-section">
          <div className="section-inner">
            <div className="proper-review-intro">
              <div className="section-kicker">The product</div>
              <h2>What&apos;s included in The Proper Review</h2>
              <p className="section-lede">
                A structured look at the property paths that may deserve
                comparison. Any ranges are preliminary, based on available
                information, and are not appraisals, offers, or guarantees.
              </p>
            </div>
            <div className="proper-review-grid">
              {REPORT_ITEMS.map(([code, title, copy]) => (
                <article className="proper-review-card" key={title}>
                  <div className="proper-review-code">{code}</div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section report-section" id="report">
          <div className="section-inner report-layout">
            <div>
              <div className="section-kicker">Start The Proper Review</div>
              <h2>A guided intake, not a generic lead form.</h2>
              <p className="section-lede">
                Share the property basics and what you are trying to
                accomplish. The review begins with context before contact
                details.
              </p>
              <div className="report-principles">
                <div className="report-principle"><span>1</span><div>Compare multiple paths rather than assuming a cash sale is the answer.</div></div>
                <div className="report-principle"><span>2</span><div>Keep sensitive mortgage information optional.</div></div>
                <div className="report-principle"><span>3</span><div>Choose whether any suggested next step deserves a separate conversation.</div></div>
              </div>
            </div>
            <div className="form-shell">
              <h3>Start Your Proper Review</h3>
              <p className="form-intro">
                Share a few details about the property and what you are trying
                to accomplish. We&apos;ll review possible paths, including a
                cash offer, traditional sale, refinance conversation, rental,
                repair, or hold strategy.
              </p>
              <HomeOptionsForm />
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="section-inner about-grid">
            <div>
              <div className="section-kicker">Local and transparent</div>
              <h2>A real person behind the options conversation.</h2>
              <p className="section-lede">
                Proper Home Options is led locally, with the operator&apos;s
                roles and potential interests stated directly.
              </p>
            </div>
            <article className="about-panel">
              <div className="about-name">Dimitri Kosmidis</div>
              <div className="about-role">Licensed Michigan Real Estate Professional &amp; Real Estate Investor</div>
              <p>
                Dimitri helps homeowners compare practical property options. In
                some cases, Dimitri or his investor network may be interested
                in purchasing the property.
              </p>
              <p>
                In other cases, listing, exploring a refinance conversation
                with a licensed mortgage professional, renting, repairing, or
                another option may be worth considering.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-inner faq-wrap">
            <div className="section-kicker">Common questions</div>
            <h2>Useful answers before you share your property.</h2>
            <div className="faq-list">
              {FAQS.map(([question, answer], index) => {
                const open = openFaq === index;
                return (
                  <article className="faq-item" key={question}>
                    <button className="faq-question" type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                      <span>{question}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
                    </button>
                    {open ? <div className="faq-answer">{answer}</div> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <h2>Start with a clear view of your options.</h2>
          <p>
            Share the property basics, compare practical paths, and decide what
            deserves a closer look.
          </p>
          <button className="button button-primary" onClick={() => cta("Final proper review CTA")}>Start My Proper Review</button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Proper Home Options</div>
              <p className="footer-copy">
                Practical property-option reviews for Michigan homeowners
                considering a sale, refinance conversation, rental, repairs, or
                another path.
              </p>
            </div>
            <div>
              <div className="footer-title">Explore</div>
              <nav className="footer-links" aria-label="Footer navigation">
                <a href="#options">Your options</a>
                <a href="#how-it-works">How it works</a>
                <a href="#report">The Proper Review</a>
                <a href="#faq">FAQ</a>
              </nav>
            </div>
            <div>
              <div className="footer-title">Information</div>
              <nav className="footer-links" aria-label="Legal navigation">
                <span>Michigan service area</span>
                <a href="/privacy">Privacy Policy</a>
                <a href="/disclaimer">Terms &amp; Disclaimer</a>
              </nav>
            </div>
          </div>
          <p className="footer-disclosure">{DISCLOSURE}</p>
          <div className="footer-bottom">
            <span>© 2026 Proper Home Options. All rights reserved.</span>
            <span>Led by Dimitri Kosmidis, licensed Michigan real estate professional and real estate investor.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
