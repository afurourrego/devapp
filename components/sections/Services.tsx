import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <Reveal>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-violet">What we do</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-display max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-semibold text-paper">
          Four ways we help you ship.
        </h2>
      </Reveal>

      <div className="mt-16 border-t border-white/10">
        {site.services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <div className="group grid cursor-default grid-cols-1 gap-4 border-b border-white/10 py-8 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[180px_1fr] md:items-baseline md:gap-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-violet">
                {s.tag}
              </span>
              <div>
                <h3 className="text-display text-3xl font-semibold text-paper transition-colors duration-300 group-hover:text-aurora sm:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-xl text-muted opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                  {s.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
