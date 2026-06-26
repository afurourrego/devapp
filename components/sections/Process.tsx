"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";

export function Process() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () =>
          track.current ? track.current.scrollWidth - window.innerWidth : 0;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + distance(),
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} className="relative overflow-hidden bg-surface">
      <div ref={track} className="flex flex-col md:w-max md:flex-row">
        {site.process.map((p, i) => (
          <div
            key={p.step}
            className="process-panel flex min-h-[60vh] w-full shrink-0 items-center px-6 py-20 md:h-screen md:min-h-screen md:w-screen md:py-0"
          >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
              <span className="text-display text-[clamp(5rem,16vw,16rem)] font-semibold leading-none text-violet">
                {p.step}
              </span>
              <div className="max-w-md">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-violet">
                  Step {i + 1} of {site.process.length}
                </p>
                <h3 className="text-display text-4xl font-semibold text-paper sm:text-6xl">{p.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
