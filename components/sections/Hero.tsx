"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

const HeroAurora = dynamic(() => import("@/components/HeroAurora").then((m) => m.HeroAurora), {
  ssr: false,
});

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { eyebrow, lines, accentLine, sub, cta } = site.hero;

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* signature: cursor-reactive WebGL aurora */}
      <div className="absolute inset-0">
        <HeroAurora />
      </div>
      {/* legibility veil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-violet"
        >
          {eyebrow}
        </motion.p>

        <h1 className="text-display text-[clamp(2.75rem,9vw,8rem)] font-semibold">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden -mb-[0.25em]">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease }}
                className={`block pb-[0.25em] ${line === accentLine ? "text-aurora" : "text-paper"}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          {sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease }}
          className="mt-10 flex items-center gap-5"
        >
          <Button href="#contact">{cta}</Button>
          <a href="#work" className="font-mono text-sm text-muted transition-colors hover:text-paper">
            See the work →
          </a>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
      >
        Scroll
      </motion.div>
    </section>
  );
}
