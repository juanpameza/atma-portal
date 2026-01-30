import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl font-semibold text-neutral-900 hover:opacity-80"
    >
      Atma Energy
    </Link>
  );
}