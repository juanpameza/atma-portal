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
    <div className="min-h-screen bg-[#fbf8f3] relative flex items-center justify-center px-6">
      <div className="absolute left-6 top-6">
        <Logo />
      </div>
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:text-neutral-900"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Sign up
        </Link>
      </div>
      <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
        <div className="text-center">
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
