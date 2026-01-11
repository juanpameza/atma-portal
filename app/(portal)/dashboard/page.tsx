"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="max-w-5xl">
      <div className="text-2xl font-semibold text-neutral-900">Dashboard</div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-10 min-h-[300px] flex items-center justify-center">
        <button
          type="button"
          onClick={() => router.push("/enroll")}
          className="w-full max-w-md rounded-2xl bg-amber-500 py-6 text-2xl font-semibold text-neutral-900 shadow-lg transition hover:bg-amber-400 active:scale-[0.99]"
        >
          Enroll
        </button>
      </div>
    </div>
  );
}