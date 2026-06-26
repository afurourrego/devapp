"use client";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function Work() {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, scroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scroll - dx;
  };
  const onPointerUp = () => {
    drag.current.down = false;
  };

  return (
    <section id="work" className="py-28 sm:py-40">
      <div className="mx-auto mb-14 flex max-w-6xl items-end justify-between px-6">
        <div>
          <Reveal>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-violet">Selected work</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2rem,5vw,3.75rem)] font-semibold text-paper">
              Things we&apos;ve shipped.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted sm:block">
            Drag to explore →
          </span>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-6 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {site.work.map((w) => (
          <figure
            key={w.src}
            className="group relative aspect-[4/3] w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 sm:w-[44vw] lg:w-[34vw]"
          >
            <Image
              src={w.src}
              alt={w.alt}
              fill
              draggable={false}
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 34vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
