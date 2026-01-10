"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-xl p-8">
      <div className="mb-6">
        <div className="text-white text-xl font-semibold">Sign in</div>
        <div className="text-neutral-400 text-sm mt-1">Welcome back.</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-neutral-300 text-sm">Email address</label>
          <input
            className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white outline-none focus:border-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-neutral-300 text-sm">Password</label>
            <a className="text-amber-400 text-sm hover:underline" href="/signup">
              Create account
            </a>
          </div>
          <input
            className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white outline-none focus:border-neutral-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 font-semibold py-3"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-neutral-300">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}