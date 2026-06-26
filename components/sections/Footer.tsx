import Image from "next/image";
import { site } from "@/content/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-white/10 px-6 pb-12 pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 font-mono text-xs uppercase tracking-[0.15em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <Image
            src="/images/logo/devapp-white.svg"
            alt="DevApp Studio"
            width={120}
            height={28}
            className="h-7 w-auto opacity-80"
          />
          <div className="flex flex-wrap gap-6">
            <a href={`mailto:${site.meta.email}`} className="hover:text-paper">{site.meta.email}</a>
            <a href={`tel:${site.meta.phone}`} className="hover:text-paper">{site.meta.phone}</a>
            <span>{site.meta.location}</span>
          </div>
          <span>© {year} {site.meta.name}</span>
        </div>
      </div>
    </footer>
  );
}
