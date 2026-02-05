// This is the signup page to create a new account in the portal.

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create account.");
      return;
    }

    // auto-login after signup
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-xl p-8">
      <div className="mb-6">
        <div className="text-white text-xl font-semibold">Create account</div>
        <div className="text-neutral-400 text-sm mt-1">Set up your portal access.</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-neutral-300 text-sm">Name (optional)</label>
          <input
            className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white outline-none focus:border-neutral-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-neutral-300 text-sm">Email</label>
          <input
            className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-white outline-none focus:border-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label className="text-neutral-300 text-sm">Password (min 8 chars)</label>
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
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className="text-neutral-400 text-sm">
          Already have an account?{" "}
          <a className="text-amber-400 hover:underline" href="/login">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}
