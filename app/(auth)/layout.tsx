// This layout is used for authentication pages like login and signup.

import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 relative flex items-center justify-center p-6">
      <div className="absolute left-6 top-6">
        <Logo className="text-white hover:opacity-90" />
      </div>
      {children}
    </div>
  );
}
