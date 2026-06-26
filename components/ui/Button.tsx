import Link from "next/link";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  type?: "button" | "submit";
};

export function Button({ href, onClick, children, variant = "solid", type = "button" }: Props) {
  const base =
    "group relative inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet";
  const cls =
    variant === "solid"
      ? `${base} bg-paper text-ink hover:shadow-[0_0_40px_-6px_rgba(168,85,247,0.7)] hover:-translate-y-0.5`
      : `${base} border border-white/15 text-paper hover:border-violet hover:text-violet`;

  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
