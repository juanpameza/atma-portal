"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleaned = zip.trim();
    const isValid = /^\d{5}$/.test(cleaned);

    if (!isValid) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setError(null);
    router.push(`/plans?zip=${encodeURIComponent(cleaned)}`);
  }

  return (
    <div className="min-h-screen bg-[#fbf8f3] flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
        <div className="text-center">
          <div className="absolute top-6 left-100">
        <Logo />
      </div>
          <div className="text-3xl font-semibold tracking-tight text-neutral-900">
            Check plans in your area
          </div>
          <p className="mt-3 text-neutral-600">
            Enter your ZIP code to view available solar buyback plans.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 text-neutral-700">
          <input
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full rounded-2xl border border-neutral-300 px-5 py-4 text-lg outline-none focus:border-neutral-900"
          />

          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-neutral-900 transition hover:bg-amber-400 active:scale-[0.99]"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          By continuing, you agree to our terms.
        </div>
      </div>
    </div>
  );
}
