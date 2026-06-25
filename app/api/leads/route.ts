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
  timeline: string;
  mainGoal: string;
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
  probateStatus?: string;
  outOfState?: string;
  damageType?: string;
  repairEstimate?: string;
  urgencyReason?: string;
  moveOutDate?: string;
};

const value = (input: unknown) =>
  typeof input === "string" ? input.trim() : "";

const shown = (input: string | undefined) => input || "Not provided";

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
    timeline: value(lead.timeline),
    mainGoal: value(lead.mainGoal) || value(lead.timeline),
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
    "Lead type: Investor Property Review",
    "Source: OaklandCash website",
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
    `Timeline: ${data.timeline}`,
    `Main goal: ${shown(data.mainGoal)}`,
    `Ownership situation: ${shown(data.ownership)}`,
    conditional ? `\n## Conditional Details\n${conditional}` : "",
    "",
    "## Seller",
    `Seller name: ${sellerName}`,
    `Phone: ${shown(data.phone)}`,
    `Email: ${shown(data.email)}`,
    `Preferred contact method: ${shown(data.preferredContactMethod)}`,
    `Best time to reach: ${shown(data.bestTimeToReach)}`,
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

  return [
    `New Investor Property Review: ${data.address}, ${data.city}`,
    "",
    notificationPriority(data),
    "",
    `Investor fit result: ${data.investorFit}`,
    `Investor fit score: ${data.investorFitScore}`,
    "",
    "Property",
    `Address: ${data.address}`,
    `City/state/ZIP: ${data.city}, ${data.state} ${data.zip}`,
    `Property type: ${shown(data.propertyType)}`,
    `Occupancy: ${shown(data.occupancy)}`,
    `Overall condition: ${data.condition}`,
    `Known issues: ${shown(data.knownIssues || data.damageType)}`,
    `Repairs needed: ${shown(data.repairsNeeded || data.repairEstimate)}`,
    `Timeline: ${data.timeline}`,
    `Main goal: ${shown(data.mainGoal)}`,
    `Ownership situation: ${shown(data.ownership)}`,
    "",
    "Seller",
    `Name: ${sellerName}`,
    `Phone: ${shown(data.phone)}`,
    `Email: ${shown(data.email)}`,
    `Preferred contact method: ${shown(data.preferredContactMethod)}`,
    `Best time to reach: ${shown(data.bestTimeToReach)}`,
    "",
    `Submission timestamp: ${data.submittedAt}`,
    "Source: OaklandCash website",
  ].join("\n");
}

async function createClickUpTask(data: LeadData) {
  const apiKey = process.env.CLICKUP_API_KEY!;
  const listId = process.env.CLICKUP_LIST_ID!;

  // Future ClickUp custom field IDs can be mapped here when the target list schema is finalized.
  const payload = {
    name: `Investor Property Review: ${data.address}, ${data.city}`,
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

  if (!apiKey || !recipient) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Lead] Email notification not configured; skipping send.");
    }
    return;
  }

  // Production should use a verified sender domain instead of onboarding@resend.dev.
  const payload = {
    from: "OaklandCash Leads <onboarding@resend.dev>",
    to: recipient,
    subject: `New Investor Property Review: ${data.address}, ${data.city}`,
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

function buildSmsMessage(data: LeadData) {
  const contact = data.phone
    ? `Call/Text: ${smsValue(data.phone, 24)}`
    : `Email: ${smsValue(data.email, 34)}`;

  return [
    `New OaklandCash lead: ${smsValue(data.investorFit, 22)} - ${smsValue(data.address, 32)}, ${smsValue(data.city, 18)}.`,
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
    await sendSmsNotification(data);

    console.log(`[Lead] Property review received | ${data.intent} | ${data.city}`);
    return NextResponse.json({ success: true });
  } catch {
    console.error("[Lead] Request handling failed.");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
