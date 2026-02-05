// This route starts the enrollment process by creating a Light account and embedding an iframe with the enrollment flow.
// This can be used for customers without an existing Atma Account.

import { NextResponse } from "next/server";

const LIGHT_API_BASE = "https://api.light.dev";

function cleanEmail(v: string) {
  return v.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const plan_group = String(body?.plan_group ?? "").trim(); // we’ll pass group_uuid here
    const first_name = String(body?.first_name ?? "").trim();
    const last_name = String(body?.last_name ?? "").trim();
    const email = cleanEmail(String(body?.email ?? ""));

    if (!plan_group || !first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "plan_group, first_name, last_name, and email are required" },
        { status: 400 }
      );
    }

    // 1) Create a Light Account (app-level)
    // IMPORTANT: If Light rejects duplicates, we’ll add a lookup step next.
    const createRes = await fetch(`${LIGHT_API_BASE}/v1/app/accounts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, first_name, last_name }),
    });

    const createText = await createRes.text();
    if (!createRes.ok) {
      console.error("Light account create error:", createRes.status, createText);
      return NextResponse.json(
        {
          error: "Failed to create Light account",
          details: createText,
        },
        { status: 502 }
      );
    }

    const created = JSON.parse(createText);
    const account_uuid = created?.uuid;

    if (!account_uuid) {
      console.error("Light account create missing uuid:", created);
      return NextResponse.json(
        { error: "Light account create returned no uuid" },
        { status: 502 }
      );
    }

    // 2) Create embedded flow login link (enrollment scope) for that plan_group
    const flowRes = await fetch(
      `${LIGHT_API_BASE}/v1/app/accounts/${account_uuid}/flow-login`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: "enrollment",
          plan_group,
        }),
      }
    );

    const flowText = await flowRes.text();
    if (!flowRes.ok) {
      console.error("Light flow-login error:", flowRes.status, flowText);
      return NextResponse.json(
        { error: "Failed to start enrollment flow", details: flowText },
        { status: 502 }
      );
    }

    const flow = JSON.parse(flowText);
    const login_link = flow?.login_link;

    if (!login_link) {
      console.error("Light flow-login missing login_link:", flow);
      return NextResponse.json(
        { error: "Flow-login returned no login_link" },
        { status: 502 }
      );
    }

    return NextResponse.json({ login_link });
  } catch (e) {
    console.error("Enroll start route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}