// This is the layout for the portal section of the app.

import { Sidebar } from "@/components/Sidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}