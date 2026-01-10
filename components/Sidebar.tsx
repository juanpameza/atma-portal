"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Documents", href: "/documents" },
  { name: "Installation", href: "/installation" },
  { name: "Monitoring", href: "/monitoring" },
  { name: "Service", href: "/service" },
  { name: "Support", href: "/support" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white">
      <div className="p-5">
        <div className="font-semibold text-neutral-900">atma energy</div>
        <div className="text-xs text-neutral-500">Customer Portal</div>
      </div>

      <nav className="px-3 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
                active
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-700 hover:bg-neutral-50",
              ].join(" ")}
            >
              {it.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}