import { NextRequest, NextResponse } from "next/server";

type LeadData = {
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  condition: string;
  knownIssues: string;
  repairsNeeded: string;
  considering: string;
  timeline: string;
  mainGoal: string;
  mortgageBalance: string;
  ownership: string;
  occupancy: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  bestTimeToReach: string;
  investorFit: string;
  investorFitScore: number;
  intent: string;
  submittedAt: string;
  source: string;
  sourcePage: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page: string;
  referrer: string;
  probateStatus?: string;
  outOfState?: string;
  damageType?: string;
  repairEstimate?: string;
  urgencyReason?: string;
  moveOutDate?: string;
};

const value = (input: unknown) =>
  typeof input === "string" ? input.trim() : "";

const sourceValue = (input: unknown, maxLength = 250) =>
  value(input).slice(0, maxLength);

const shown = (input: string | undefined) => input || "Not provided";

const escapeRegExp = (input: string) =>
  input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function displayAddress(address: string, city: string) {
  if (!address || !city) {
    return address;
  }

  const trailingCity = new RegExp(
    `(?:,\\s*|\\s+)${escapeRegExp(city)}\\s*,?\\s*$`,
    "i"
  );
  const cleaned = address.replace(trailingCity, "").trim();

  return cleaned || address;
}

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 10) {
    return phone;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const smsValue = (input: string | undefined, maxLength: number) => {
  const clean = shown(input).replace(/\s+/g, " ");
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

function normalizeLead(lead: Record<string, unknown>): LeadData {
  return {
    address: value(lead.address),
    city: value(lead.city),
    state: value(lead.state) || "MI",
    zip: value(lead.zip),
    propertyType: value(lead.propertyType),
    condition: value(lead.condition),
    knownIssues: value(lead.knownIssues),
    repairsNeeded: value(lead.repairsNeeded),
    considering: value(lead.considering),
    timeline: value(lead.timeline),
    mainGoal: value(lead.mainGoal) || value(lead.timeline),
    mortgageBalance: value(lead.mortgageBalance),
    ownership: value(lead.ownership),
    occupancy: value(lead.occupancy),
    firstName: value(lead.firstName),
    lastName: value(lead.lastName),
    email: value(lead.email).toLowerCase(),
    phone: value(lead.phone),
    preferredContactMethod: value(lead.preferredContactMethod),
    bestTimeToReach: value(lead.bestTimeToReach),
    investorFit: value(lead.investorFit) || "Needs Manual Review",
    investorFitScore: Number(lead.investorFitScore) || 0,
    intent: value(lead.intent) || "default",
    submittedAt: value(lead.submittedAt) || new Date().toISOString(),
    source: value(lead.source) || "website",
    sourcePage: value(lead.sourcePage) || "/",
    utm_source: sourceValue(lead.utm_source),
    utm_medium: sourceValue(lead.utm_medium),
    utm_campaign: sourceValue(lead.utm_campaign),
    utm_content: sourceValue(lead.utm_content),
    utm_term: sourceValue(lead.utm_term),
    landing_page: sourceValue(lead.landing_page, 1000),
    referrer: sourceValue(lead.referrer, 1000),
    ...(value(lead.probateStatus) && { probateStatus: value(lead.probateStatus) }),
    ...(value(lead.outOfState) && { outOfState: value(lead.outOfState) }),
    ...(value(lead.damageType) && { damageType: value(lead.damageType) }),
    ...(value(lead.repairEstimate) && { repairEstimate: value(lead.repairEstimate) }),
    ...(value(lead.urgencyReason) && { urgencyReason: value(lead.urgencyReason) }),
    ...(value(lead.moveOutDate) && { moveOutDate: value(lead.moveOutDate) }),
  };
}

function validateLead(data: LeadData) {
  const required: Array<keyof LeadData> = [
    "address",
    "city",
    "zip",
    "condition",
    "timeline",
    "firstName",
  ];
  const missing = required.filter((field) => !data[field]);

  if (!data.email && !data.phone) {
    missing.push("phone" as keyof LeadData);
  }

  return missing.map((field) => (field === "phone" ? "phone or email" : field));
}

function buildTaskDescription(data: LeadData) {
  const sellerName = `${data.firstName} ${data.lastName}`.trim();
  const conditional = [
    ["repairEstimate", data.repairEstimate],
    ["urgencyReason", data.urgencyReason],
    ["moveOutDate", data.moveOutDate],
    ["probateStatus", data.probateStatus],
    ["outOfState", data.outOfState],
    ["damageType", data.damageType],
  ]
    .filter(([, fieldValue]) => fieldValue)
    .map(([label, fieldValue]) => `- ${label}: ${fieldValue}`)
    .join("\n");

  return [
    "Lead type: The Proper Review",
    "Source: Proper Home Options website",
    `Submission timestamp: ${data.submittedAt}`,
    `Investor fit: ${data.investorFit}`,
    `Investor fit score: ${data.investorFitScore}`,
    "",
    "## Property",
    `Property address: ${data.address}`,
    `City: ${data.city}`,
    `State: ${data.state}`,
    `ZIP: ${data.zip}`,
    `Property type: ${shown(data.propertyType)}`,
    `Occupancy: ${shown(data.occupancy)}`,
    `Overall condition: ${data.condition}`,
    `Known issues: ${shown(data.knownIssues || data.damageType)}`,
    `Repairs needed: ${shown(data.repairsNeeded || data.repairEstimate)}`,
    `Considering: ${shown(data.considering)}`,
    `Timeline: ${data.timeline}`,
    `Main goal: ${shown(data.mainGoal)}`,
    `Approximate mortgage balance: ${shown(data.mortgageBalance)}`,
    `Ownership situation: ${shown(data.ownership)}`,
    conditional ? `\n## Conditional Details\n${conditional}` : "",
    "",
    "## Seller",
    `Seller name: ${sellerName}`,
    `Phone: ${shown(data.phone)}`,
    `Email: ${shown(data.email)}`,
    `Preferred contact method: ${shown(data.preferredContactMethod)}`,
    `Best time to reach: ${shown(data.bestTimeToReach)}`,
    "",
    "## Attribution",
    `UTM source: ${shown(data.utm_source)}`,
    `UTM medium: ${shown(data.utm_medium)}`,
    `UTM campaign: ${shown(data.utm_campaign)}`,
    `UTM content: ${shown(data.utm_content)}`,
    `UTM term: ${shown(data.utm_term)}`,
    `Landing page: ${shown(data.landing_page)}`,
    `Referrer: ${shown(data.referrer)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildClickUpTags(data: LeadData) {
  const tags = new Set(["investor-lead", "property-review"]);
  const combined = [
    data.condition,
    data.knownIssues,
    data.repairsNeeded,
    data.damageType,
    data.repairEstimate,
    data.ownership,
    data.occupancy,
    data.timeline,
    data.mainGoal,
    data.considering,
    data.urgencyReason,
    data.moveOutDate,
    data.probateStatus,
  ]
    .join(" ")
    .toLowerCase();

  if (/(fair|poor|repair|damage|foundation|roof|water|fire|mold|code|fix|renovation)/.test(combined)) {
    tags.add("fixer-upper");
  }
  if (/(inherited|estate|probate|trust)/.test(combined)) {
    tags.add("inherited");
  }
  if (/tenant/.test(data.occupancy.toLowerCase())) {
    tags.add("tenant-occupied");
  }
  if (/vacant/.test(data.occupancy.toLowerCase())) {
    tags.add("vacant");
  }
  if (/(immediate|2 weeks|30 days|14days|30days|urgent|foreclosure)/.test(combined)) {
    tags.add("urgent");
  }
  if (/(direct|cash|no repairs|no showings|avoid public listing|sale)/.test(combined)) {
    tags.add("direct-sale");
  }
  if (data.investorFit === "Strong Potential Fit") {
    tags.add("strong-fit");
  } else if (data.investorFit === "Possible Fit") {
    tags.add("possible-fit");
  } else {
    tags.add("manual-review");
  }

  return Array.from(tags);
}

function shouldCreateClickUpTask() {
  const clickUpSetting = process.env.ENABLE_CLICKUP_LEADS?.trim().toLowerCase();
  const hasCredentials =
    Boolean(process.env.CLICKUP_API_KEY) && Boolean(process.env.CLICKUP_LIST_ID);

  if (clickUpSetting === "false") {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] ClickUp lead creation disabled; skipping task creation.");
    }
    return false;
  }

  if (!hasCredentials) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] ClickUp not configured; skipping task creation.");
    }
    return false;
  }

  return true;
}

function notificationPriority(data: LeadData) {
  if (data.investorFit === "Strong Potential Fit") {
    return "Priority: Strong potential investor fit.";
  }
  if (data.investorFit === "Possible Fit") {
    return "Priority: Possible investor fit.";
  }
  return "Priority: Manual review needed.";
}

function buildNotificationText(data: LeadData) {
  const sellerName = `${data.firstName} ${data.lastName}`.trim();
  const propertyDisplayAddress = displayAddress(data.address, data.city);

  return [
    `New Proper Review: ${propertyDisplayAddress}, ${data.city}`,
    "",
    "Lead type: The Proper Review",
    notificationPriority(data),
    "",
    `Investor fit result: ${data.investorFit}`,
    `Investor fit score: ${data.investorFitScore}`,
    "",
    "Property Details",
    `Address: ${data.address}`,
    `City/state/ZIP: ${data.city}, ${data.state} ${data.zip}`,
    `Property type: ${shown(data.propertyType)}`,
    `Occupancy: ${shown(data.occupancy)}`,
    `Overall condition: ${data.condition}`,
    `Known issues: ${shown(data.knownIssues || data.damageType)}`,
    `Repairs needed: ${shown(data.repairsNeeded || data.repairEstimate)}`,
    `Considering: ${shown(data.considering)}`,
    `Timeline: ${data.timeline}`,
    `Main goal: ${shown(data.mainGoal)}`,
    `Approximate mortgage balance: ${shown(data.mortgageBalance)}`,
    `Ownership situation: ${shown(data.ownership)}`,
    "",
    "Seller Contact",
    `Name: ${sellerName}`,
    `Phone: ${shown(formatPhoneForDisplay(data.phone))}`,
    `Email: ${shown(data.email)}`,
    `Preferred contact method: ${shown(data.preferredContactMethod)}`,
    `Best time to reach: ${shown(data.bestTimeToReach)}`,
    "",
    "Attribution",
    `UTM source: ${shown(data.utm_source)}`,
    `UTM medium: ${shown(data.utm_medium)}`,
    `UTM campaign: ${shown(data.utm_campaign)}`,
    `UTM content: ${shown(data.utm_content)}`,
    `UTM term: ${shown(data.utm_term)}`,
    `Landing page: ${shown(data.landing_page)}`,
    `Referrer: ${shown(data.referrer)}`,
    "",
    `Submission timestamp: ${data.submittedAt}`,
    "Source: Proper Home Options website",
  ].join("\n");
}

async function createClickUpTask(data: LeadData) {
  const apiKey = process.env.CLICKUP_API_KEY!;
  const listId = process.env.CLICKUP_LIST_ID!;
  const propertyDisplayAddress = displayAddress(data.address, data.city);

  // Future ClickUp custom field IDs can be mapped here when the target list schema is finalized.
  const payload = {
    name: `Proper Review: ${propertyDisplayAddress}, ${data.city}`,
    description: buildTaskDescription(data),
    tags: buildClickUpTags(data),
  };

  try {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.warn(`[Lead] ClickUp task creation failed. Status: ${response.status}`);
    }
  } catch {
    console.warn("[Lead] ClickUp task creation failed.");
  }
}

async function sendLeadNotification(data: LeadData) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.LEAD_NOTIFICATION_EMAIL;
  const propertyDisplayAddress = displayAddress(data.address, data.city);

  if (!apiKey || !recipient) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] Email notification not configured; skipping send.");
    }
    return;
  }

  // Production should use a verified sender domain instead of onboarding@resend.dev.
  const payload = {
    from: "Proper Home Options <onboarding@resend.dev>",
    to: recipient,
    subject: `New Proper Review: ${propertyDisplayAddress}, ${data.city}`,
    text: buildNotificationText(data),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && process.env.NODE_ENV !== "production") {
      console.warn(`[Lead] Email notification failed. Status: ${response.status}`);
    }
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] Email notification failed.");
    }
  }
}

function buildSellerConfirmationText() {
  const contactEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  return [
    "Thank you for starting your Proper Review. I'll review the information you provided and follow up with practical property paths that may be worth considering based on your property, timeline, and goals.",
    "",
    "This is not an appraisal, offer, or guarantee. Not every property will receive an offer. Submitting your information does not create an agency relationship or obligation to sell. There is no pressure or obligation to continue.",
    "",
    "Proper Home Options is not an appraisal, lender, legal advisor, tax advisor, or financial advisor. Dimitri Kosmidis is a licensed Michigan real estate professional and real estate investor. In some cases, Dimitri or his investor network may be interested in purchasing the property.",
    contactEmail ? `Questions may be sent to ${contactEmail}.` : "",
    "",
    "Thank you,",
    "Dimitri Kosmidis",
  ]
    .filter((line) => line !== "")
    .join("\n\n");
}

async function sendSellerConfirmation(data: LeadData) {
  const enabled =
    process.env.SEND_SELLER_CONFIRMATION?.trim().toLowerCase() === "true";
  const apiKey = process.env.RESEND_API_KEY;

  if (!enabled || !data.email) {
    return;
  }

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Lead] Seller confirmation enabled without Resend configuration; skipping send."
      );
    }
    return;
  }

  // Production should use a verified sender domain once the final domain is chosen.
  const payload = {
    from: "Proper Home Options <onboarding@resend.dev>",
    to: data.email,
    subject: "Your Proper Review Request Was Received",
    text: buildSellerConfirmationText(),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && process.env.NODE_ENV !== "production") {
      console.warn(
        `[Lead] Seller confirmation failed. Status: ${response.status}`
      );
    }
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] Seller confirmation failed.");
    }
  }
}

function buildSmsMessage(data: LeadData) {
  const propertyDisplayAddress = displayAddress(data.address, data.city);
  const contact = data.phone
    ? `Call/Text: ${smsValue(formatPhoneForDisplay(data.phone), 24)}`
    : `Email: ${smsValue(data.email, 34)}`;

  return [
    `New Proper Home Options lead: ${smsValue(data.investorFit, 22)} - ${smsValue(propertyDisplayAddress, 32)}, ${smsValue(data.city, 18)}.`,
    `Seller: ${smsValue(data.firstName, 18)}.`,
    `${contact}.`,
    `Goal: ${smsValue(data.mainGoal, 34)}.`,
    `Timeline: ${smsValue(data.timeline, 22)}.`,
  ].join(" ");
}

async function sendSmsNotification(data: LeadData) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.LEAD_NOTIFICATION_PHONE;

  if (!accountSid || !authToken || !from || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] SMS notification not configured; skipping send.");
    }
    return;
  }

  const payload = new URLSearchParams({
    From: from,
    To: to,
    Body: buildSmsMessage(data),
  });

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      }
    );

    if (!response.ok && process.env.NODE_ENV !== "production") {
      console.warn(`[Lead] SMS notification failed. Status: ${response.status}`);
    }
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] SMS notification failed.");
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json();

    if (value(lead.website)) {
      return NextResponse.json({ success: true });
    }

    const data = normalizeLead(lead);
    const missing = validateLead(data);

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    if (shouldCreateClickUpTask()) {
      await createClickUpTask(data);
    }
    await sendLeadNotification(data);
    await sendSellerConfirmation(data);
    await sendSmsNotification(data);

    console.log(`[Lead] Proper Review request received | ${data.intent} | ${data.city}`);
    return NextResponse.json({ success: true });
  } catch {
    console.error("[Lead] Request handling failed.");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
