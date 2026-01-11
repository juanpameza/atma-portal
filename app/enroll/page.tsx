"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollPage() {
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      const res = await fetch("/api/light/enrollment-link", { method: "POST" });
      const data = await res.json().catch(() => null);

      if (cancelled) return;

      if (!res.ok) {
        setError(data?.error ?? "Could not start enrollment");
        return;
      }
      setUrl(data.url);
    }

    load();

    function handleMessage(event: MessageEvent) {
      const eventType = (event as any).data?.type;
      if (eventType === "light-flow-close") {
        router.push("/dashboard");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => {
      cancelled = true;
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-lg font-semibold">Enrollment</div>
          <p className="mt-2 text-neutral-600">{error}</p>
          <button
            className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-white"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Loading enrollment…</div>
      </div>
    );
  }

  // Full-screen iframe with very high z-index to avoid being covered. :contentReference[oaicite:5]{index=5}
  return (
    <iframe
      src={url}
      title="Light Enrollment"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 99999,
      }}
    />
  );
}