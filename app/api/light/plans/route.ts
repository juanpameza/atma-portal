import { NextResponse } from "next/server";

const LIGHT_API_BASE = "https://api.light.dev";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const postal_code = String(body?.postal_code ?? "").trim();
    const utility = String(body?.utility ?? "").trim();

    if (!postal_code || !utility) {
      return NextResponse.json(
        { error: "postal_code and utility are required" },
        { status: 400 }
      );
    }

    // App-level plans request endpoint
    const res = await fetch(`${LIGHT_API_BASE}/v1/app/accounts/enroll/plans/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postal_code,
        utility,

        // Optional knobs you mentioned (leave off for now):
        // plan_group,
        // energy_rate_cents_per_kwh,
        // partner_commission_per_month_dollars,
        // term_months,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Light plans error:", res.status, text);
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 502 });
    }

    return NextResponse.json({ plans: JSON.parse(text) });
  } catch (e) {
    console.error("Plans route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}