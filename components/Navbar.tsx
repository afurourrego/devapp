"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" aria-label="DevApp Studio" className="flex items-center">
          <Image
            src="/images/logo/devapp-white.svg"
            alt="DevApp Studio"
            width={132}
            height={30}
            priority
            className="h-[30px] w-auto"
          />
        </a>
        <div className="hidden items-center gap-9 font-mono text-xs uppercase tracking-[0.15em] text-muted md:flex">
          <a href="#services" className="transition-colors hover:text-paper">Services</a>
          <a href="#work" className="transition-colors hover:text-paper">Work</a>
          <a href="#process" className="transition-colors hover:text-paper">Process</a>
        </div>
        <a
          href="#contact"
          className="rounded-full border border-white/15 px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:border-violet hover:text-violet"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
