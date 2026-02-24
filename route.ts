import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json();

    const required = ["address", "city", "zip", "firstName", "email", "phone"];
    const missing = required.filter((f) => !lead[f]?.trim());
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const data = {
      address: lead.address?.trim(),
      city: lead.city?.trim(),
      state: lead.state || "MI",
      zip: lead.zip?.trim(),
      condition: lead.condition || "not specified",
      timeline: lead.timeline || "not specified",
      ownership: lead.ownership || "not specified",
      occupancy: lead.occupancy || "not specified",
      firstName: lead.firstName?.trim(),
      lastName: lead.lastName?.trim() || "",
      email: lead.email?.trim().toLowerCase(),
      phone: lead.phone?.trim(),
      intent: lead.intent || "default",
      submittedAt: lead.submittedAt || new Date().toISOString(),
      source: lead.source || "website",
      sourcePage: lead.sourcePage || "/",
      ...(lead.probateStatus && { probateStatus: lead.probateStatus }),
      ...(lead.outOfState && { outOfState: lead.outOfState }),
      ...(lead.damageType && { damageType: lead.damageType }),
      ...(lead.repairEstimate && { repairEstimate: lead.repairEstimate }),
      ...(lead.urgencyReason && { urgencyReason: lead.urgencyReason }),
      ...(lead.moveOutDate && { moveOutDate: lead.moveOutDate }),
    };

    const results: { clickup?: string } = {};

    // ClickUp task creation
    const cuToken = process.env.CLICKUP_API_TOKEN;
    const cuList = process.env.CLICKUP_LIST_ID;
    if (cuToken && cuList) {
      try {
        const priorityMap: Record<string, number> = {
          fastClose: 1,
          distressed: 2,
          inherited: 2,
          default: 3,
        };
        const dueMap: Record<string, number> = {
          "14days": 1,
          "30days": 3,
          "60days": 7,
          exploring: 14,
        };
        const dueDays = dueMap[data.timeline] || 3;

        const desc = [
          `## Property`,
          `**Address:** ${data.address}, ${data.city}, ${data.state} ${data.zip}`,
          `**Condition:** ${data.condition}`,
          `**Timeline:** ${data.timeline}`,
          ``,
          `## Contact`,
          `**Name:** ${data.firstName} ${data.lastName}`,
          `**Email:** ${data.email}`,
          `**Phone:** ${data.phone}`,
          ``,
          `## Context`,
          `**Intent:** ${data.intent}`,
          `**Submitted:** ${data.submittedAt}`,
        ].join("\n");

        const cuRes = await fetch(
          `https://api.clickup.com/api/v2/list/${cuList}/task`,
          {
            method: "POST",
            headers: {
              Authorization: cuToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `🏠 ${data.address}, ${data.city} — ${data.firstName} ${data.lastName}`.trim(),
              description: desc,
              priority: priorityMap[data.intent] || 3,
              due_date: Date.now() + dueDays * 86400000,
              due_date_time: true,
              tags: [
                data.intent,
                data.city.toLowerCase().replace(/\s+/g, "-"),
              ].filter(Boolean),
              status: "new lead",
            }),
          }
        );
        if (cuRes.ok) {
          const task = await cuRes.json();
          results.clickup = task.id;
        }
      } catch (err: any) {
        console.error("[Lead] ClickUp error:", err.message);
      }
    }

    // n8n webhook
    const webhook = process.env.N8N_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clickupTaskId: results.clickup }),
      }).catch(() => {});
    }

    console.log(`[Lead] ${data.email} | ${data.intent} | ${data.city}`);
    return NextResponse.json({
      success: true,
      taskId: results.clickup || null,
    });
  } catch (error) {
    console.error("[Lead] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
