import Link from "next/link";
import Image from "next/image";

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
            Create Account
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Title + subtitle */}
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-neutral-900">
            Buyback plans <br /> for solar homes
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Choose the plan that matches your goals: maximize credits or keep rates
            simple. Add BYOB (Bring Your Own Battery) if you already own a battery.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
            <div className="flex items-center justify-center rounded-2xl bg-neutral-100 py-4">
              <div className="h-28 w-28 rounded-xl border border-neutral-300 bg-white flex items-center justify-center text-neutral-500">
                <Image src="/Family.png" alt="" width={240} height={240} />
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-neutral-900">
              Solar 1:1 Buyback
            </h2>

            <ul className="mt-5 space-y-3 text-neutral-700">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Best for maximizing export credits</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Buyback matches your energy rate (1:1)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Good fit for high daytime production</span>
              </li>
            </ul>

            {/* Optional button (does nothing for now) */}
            <button
              type="button"
              className="mt-10 w-full rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-neutral-900 transition hover:bg-amber-400"
            >
              Select plan
            </button>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
            <div className="flex items-center justify-center rounded-2xl bg-neutral-100 py-4">
              <div className="h-28 w-56 rounded-xl border border-neutral-300 bg-white flex items-center justify-center text-neutral-500">
                <Image src="/House.png" alt="" width={240} height={240} />
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-neutral-900">
              Solar Buyback Saver
            </h2>

            <ul className="mt-5 space-y-3 text-neutral-700">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Best for a lower-cost buyback option</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Lower energy rate with a fixed buyback rate</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                <span>Good fit if you export less than you consume</span>
              </li>
            </ul>

            <button
              type="button"
              className="mt-10 w-full rounded-2xl bg-neutral-900 py-4 text-lg font-semibold text-white transition hover:bg-neutral-800"
            >
              Select plan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}