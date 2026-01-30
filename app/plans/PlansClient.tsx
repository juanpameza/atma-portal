"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function formatCentsPerKwh(v?: string) {
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return `${v}¢/kWh`;
  return `${n.toFixed(2)}¢/kWh`;
}

function formatDollars(v?: string) {
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return `$${v}/mo`;
  return `$${n.toFixed(2)}/mo`;
}

function fmt2(v?: string) {
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toFixed(2);
}

function PlanBullets({ p }: { p: RatePlan }) {
  return (
    <ul className="mt-5 space-y-3 text-neutral-700">
      <li className="flex gap-3">
        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
        <span>Term: {p.term_months} months</span>
      </li>

      {p.energy_rate_cents_per_kwh ? (
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
          <span>Energy rate: {fmt2(p.energy_rate_cents_per_kwh)}¢/kWh</span>
        </li>
      ) : null}

      {p.export_rate_cents_per_kwh ? (
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
          <span>Export rate: {fmt2(p.export_rate_cents_per_kwh)}¢/kWh</span>
        </li>
      ) : null}

      {p.plan_monthly_cost_dollars ? (
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
          <span>Base Fee: ${fmt2(p.plan_monthly_cost_dollars)}/mo</span>
        </li>
      ) : null}

      {p.tdu_shortname && p.delivery_rate_cents_per_kwh ? (
        <li className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
          <span>
            {p.tdu_shortname} Delivery Charges: {fmt2(p.delivery_rate_cents_per_kwh)}¢/kWh
          </span>
        </li>
      ) : null}
    </ul>
  );
}

type Utility = { name: string; display_name?: string };
type RatePlan = {
  uuid: string;
  name: string;
  term_months: number;
  energy_rate_cents_per_kwh?: string;
  export_rate_cents_per_kwh?: string;
  plan_monthly_cost_dollars?: string;
  avg_cents_per_kwh_1000?: string;
  tdu_shortname?: string;
  delivery_rate_cents_per_kwh?: string;
};

export default function PlansPage() {
  const params = useSearchParams();
  const router = useRouter();

  const zip = (params.get("zip") ?? "").trim();

  const [eligibility, setEligibility] = useState<number | null>(null);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [utility, setUtility] = useState<string>("");
  const [plans, setPlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bestUtility = useMemo(() => utilities?.[0]?.name ?? "", [utilities]);

  useEffect(() => {
  async function run() {
    if (!zip) {
      setError("Missing ZIP code.");
      setLoading(false);
      return;
    }

      setLoading(true);
      setError(null);

      // 1) eligibility -> utilities
      const eligRes = await fetch("/api/light/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postal_code: zip }),
      });

      const eligData = await eligRes.json().catch(() => null);
      if (!eligRes.ok) {
        setError(eligData?.error ?? "Could not check eligibility.");
        setLoading(false);
        return;
      }

      setEligibility(eligData.eligibility_likelihood ?? 0);
      setUtilities(eligData.utilities ?? []);

      const chosen = eligData.utilities?.[0]?.name ?? "";
      setUtility(chosen);

      if ((eligData.eligibility_likelihood ?? 0) <= 0) {
        setLoading(false);
        return;
      }

      // 2) request plans using postal_code + utility
      const plansRes = await fetch("/api/light/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postal_code: zip, utility: chosen }),
      });

      const plansData = await plansRes.json().catch(() => null);
      if (!plansRes.ok) {
        setError(plansData?.error ?? "Could not load plans.");
        setLoading(false);
        return;
      }

      setPlans(plansData.plans ?? []);
      setLoading(false);
    }

    run();
  }, [zip]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f3] flex items-center justify-center">
        <div className="text-neutral-600">Loading plans…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf8f3] flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-8">
          <div className="text-lg font-semibold text-neutral-900">Oops</div>
          <p className="mt-2 text-neutral-600">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 py-4 text-white font-semibold"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  if ((eligibility ?? 0) <= 0) {
    return (
      <div className="min-h-screen bg-[#fbf8f3]">
        <header className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-neutral-700 hover:text-neutral-900">
            Change ZIP
          </Link>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-3xl border border-neutral-200 bg-white p-10">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Not available in this ZIP yet
            </h1>
            <p className="mt-3 text-neutral-600">
              This area doesn’t appear eligible for enrollment right now. Try a nearby ZIP code.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex rounded-2xl bg-amber-500 px-8 py-4 font-semibold text-neutral-900 hover:bg-amber-400"
            >
              Try another ZIP
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Replace your static cards with a map over `plans`
  return (
    <div className="min-h-screen bg-[#fbf8f3]">
      <header className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
        <Logo />
        <div className="text-sm text-neutral-600">
          ZIP <span className="font-semibold">{zip}</span>
          {bestUtility ? (
            <>
              {" · "}
              Utility <span className="font-semibold">{bestUtility}</span>
            </>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
  <div className="text-center pt-4">
    <h1 className="text-5xl font-semibold tracking-tight text-neutral-900">
      Buyback plans <br /> for solar homes
    </h1>
    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
      Plans shown are based on your ZIP and utility.
    </p>

    <div className="mx-auto mt-4 text-sm text-neutral-600">
      ZIP <span className="font-semibold">{zip}</span>
      {bestUtility ? (
        <>
          {" "}
          · Utility <span className="font-semibold">{bestUtility}</span>
        </>
      ) : null}
    </div>
  </div>

  {/* All plans */}
  <div className="mt-14">
    <div className="flex items-end justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-neutral-900">
          All available plans
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Showing {plans.length} plan{plans.length === 1 ? "" : "s"}.
        </p>
      </div>

      <Link
        href="/"
        className="text-sm font-semibold text-neutral-900 hover:opacity-80"
      >
        Change ZIP
      </Link>
    </div>

    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {plans.map((p, i) => {
        const featured = i < 2;

        return (
          <div
            key={p.uuid}
            className={[
              "rounded-3xl border bg-white p-7 shadow-sm",
              featured ? "border-amber-200" : "border-neutral-200",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="text-lg font-semibold text-neutral-900">{p.name}</div>
              {featured ? (
                <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-neutral-900">
                  Recommended
                </div>
              ) : null}
            </div>

            {/* Bullet list with your variables */}
            <PlanBullets p={p} />

            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              Select plan
            </button>
          </div>
        );
      })}
    </div>
  </div>
</main>
    </div>
  );
}