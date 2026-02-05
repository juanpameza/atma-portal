import Link from "next/link";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  const baseClassName =
    "text-xl font-semibold tracking-tight text-neutral-900 transition hover:opacity-80";
  return (
    <Link
      href="/"
      className={[baseClassName, className].filter(Boolean).join(" ")}
    >
      Atma Energy
    </Link>
  );
}
