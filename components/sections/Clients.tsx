import Image from "next/image";
import { site } from "@/content/site";

function Row({ items, dir }: { items: typeof site.clients; dir: "left" | "right" }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden">
      <div
        className={`flex w-max items-center gap-16 px-8 ${
          dir === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {doubled.map((c, i) => (
          <Image
            key={`${c.src}-${i}`}
            src={c.src}
            alt={c.alt}
            width={160}
            height={64}
            className="h-16 w-auto shrink-0 object-contain opacity-50 grayscale invert transition duration-300 hover:opacity-100 sm:h-20"
          />
        ))}
      </div>
    </div>
  );
}

export function Clients() {
  const half = Math.ceil(site.clients.length / 2);
  const top = site.clients.slice(0, half);
  const bottom = site.clients.slice(half);

  return (
    <section className="border-y border-white/10 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto mb-16 max-w-6xl px-6 text-center">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-violet">Trusted by</p>
        <h2 className="text-display mx-auto max-w-3xl text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold text-paper">
          Brands and teams that came to ship — and came back.
        </h2>
      </div>
      <div className="flex flex-col gap-10">
        <Row items={top} dir="left" />
        <Row items={bottom} dir="right" />
      </div>
    </section>
  );
}
