import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Proper Home Options",
  description:
    "How Proper Home Options may collect and use property, contact, source, and analytics information.",
};

const sections = [
  {
    title: "Information You Provide",
    body: [
      "When you submit a property for review, the site may collect property information such as the address, city, ZIP code, property type, occupancy, condition, known issues, repair needs, ownership situation, goals, and timeline.",
      "The site may also collect contact information you choose to provide, including your name, email address, phone number, preferred contact method, and best time to reach you.",
    ],
  },
  {
    title: "How Information May Be Used",
    body: [
      "Submitted information may be used to review whether a property appears to fit current rental, renovation, direct-purchase, or other investor criteria; respond to your request; ask follow-up questions; and discuss practical next steps.",
      "Information may also be used to operate, secure, troubleshoot, and improve the site and lead-review process.",
    ],
  },
  {
    title: "Email and SMS Communication",
    body: [
      "If you provide an email address or phone number, Dimitri may use it to follow up about your Proper Review request. A confirmation email may also be sent when that feature is enabled.",
      "Communication is intended to relate to your request. Submitting information does not require you to sell, list, or enter into a transaction.",
    ],
  },
  {
    title: "Analytics and Source Information",
    body: [
      "The site may collect privacy-conscious analytics and campaign-source information, such as referring page, landing page, UTM campaign parameters, page path, and general form progress.",
      "Names, email addresses, phone numbers, street addresses, ZIP codes, and full property details are not intentionally sent to Google Analytics.",
    ],
  },
  {
    title: "Service Providers",
    body: [
      "Information may be processed by service providers used to operate the lead workflow, such as website hosting, email delivery, SMS delivery, analytics, or task-management providers. These services are used only as needed to operate the site and respond to submissions.",
      "This site does not sell homeowner personal information.",
    ],
  },
  {
    title: "Data Choices and Questions",
    body: [
      "You may choose not to submit the form. To ask a privacy question or request a correction or deletion, reply to a communication from Proper Home Options or use the report form to request contact.",
      "Reasonable requests may be subject to legal, security, recordkeeping, or transaction-related requirements.",
    ],
  },
];

export default function PrivacyPage() {
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
        <div className="legal-kicker">Privacy</div>
        <h1>Privacy Policy</h1>
        <p className="legal-lede">
          This policy explains what information may be collected through the
          property review process and how it may be used to evaluate and respond
          to a homeowner request.
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
          This policy is a practical summary for the current site and is not a
          substitute for legal advice. Legal and employing-broker review is
          recommended before final publication or paid advertising.
        </div>
        <nav className="legal-links" aria-label="Legal pages">
          <Link href="/disclaimer">Terms &amp; Disclaimer</Link>
          <Link href="/">Return Home</Link>
        </nav>
      </div>
    </main>
  );
}
