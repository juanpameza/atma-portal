import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
        <div className="text-xl font-semibold text-neutral-900">
          Atma Energy
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-neutral-700 hover:text-neutral-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-amber-500 px-5 py-2 font-semibold text-neutral-900 hover:bg-amber-400"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900">
          Clean energy, made simple.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-600">
          Track your installation, documents, monitoring, and support — all in
          one place.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded-2xl bg-amber-500 px-8 py-4 text-lg font-semibold text-neutral-900 hover:bg-amber-400"
          >
            Enroll now
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-neutral-300 px-8 py-4 text-lg font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Log in
          </Link>
        </div>
      </main>
    </div>
  );
}