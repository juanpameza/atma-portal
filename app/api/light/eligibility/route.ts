import { NextResponse } from "next/server";

const LIGHT_API_BASE = "https://api.light.dev";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const postal_code = String(body?.postal_code ?? "").trim();

    if (!postal_code) {
      return NextResponse.json({ error: "postal_code is required" }, { status: 400 });
    }

    // App-level eligibility endpoint
    const res = await fetch(`${LIGHT_API_BASE}/v1/app/accounts/enroll/eligibility`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postal_code }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Light eligibility error:", res.status, text);
      return NextResponse.json({ error: "Failed to check eligibility" }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    console.error("Eligibility route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}