import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const LIGHT_API_BASE = "https://api.light.dev";

function splitName(name?: string | null) {
  const safe = (name ?? "").trim();
  if (!safe) return { first_name: "Customer", last_name: " " };
  const parts = safe.split(/\s+/);
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") || " " };
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1) Ensure the user has a Light Account UUID (create if missing)
    let lightAccountUuid = user.lightAccountUuid;

    if (!lightAccountUuid) {
      const { first_name, last_name } = splitName(user.name);

      // Create Light Account: POST /v1/app/accounts :contentReference[oaicite:2]{index=2}
      const createRes = await fetch(`${LIGHT_API_BASE}/v1/app/accounts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          first_name,
          last_name,
        }),
      });

      if (!createRes.ok) {
        const text = await createRes.text();
        console.error("Light create account failed:", createRes.status, text);
        return NextResponse.json(
          { error: "Failed to create Light account" },
          { status: 502 }
        );
      }

      const account = await createRes.json();
      lightAccountUuid = account.uuid;

      await prisma.user.update({
        where: { email: user.email },
        data: { lightAccountUuid },
      });
    }

    // 2) Request an embedded flow link: POST /v1/app/accounts/{uuid}/flow-login scope=enrollment :contentReference[oaicite:3]{index=3}
    const flowRes = await fetch(
      `${LIGHT_API_BASE}/v1/app/accounts/${lightAccountUuid}/flow-login`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIGHT_APP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scope: "enrollment" }),
      }
    );

    if (!flowRes.ok) {
      const text = await flowRes.text();
      console.error("Light flow-login failed:", flowRes.status, text);
      return NextResponse.json(
        { error: "Failed to create enrollment link" },
        { status: 502 }
      );
    }

    const flowData = await flowRes.json();
    return NextResponse.json({ url: flowData.login_link });
  } catch (err) {
    console.error("Enrollment link error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}