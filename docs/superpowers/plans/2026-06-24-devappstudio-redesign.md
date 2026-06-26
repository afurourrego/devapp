# DevApp Studio Rebuild & Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the DevApp Studio Rails marketing site as a modern Next.js site on Vercel with an elegant, Apple-style design, premium scroll animations, light/dark theme, and a serverless contact form.

**Architecture:** Single-page Next.js (App Router) site. Each section is a self-contained component fed by a central `content/site.ts` data file. UI primitives and animation wrappers are reusable. The contact form posts to a Next API route that emails via Resend. Tailwind tokens drive the light/dark theme.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · next/image · Resend · Vitest + Testing Library · Vercel.

## Global Constraints

- Language: **English only** (all copy).
- Theme: **light/dark toggle**, persistent (localStorage), no flash on load. Apple-style elegance: large clean type, generous whitespace, subtle premium animation.
- Brand accent: purple `#5A2676` (used as accent in both themes).
- Source assets come from `../DevAppStudio/app/assets/images/`.
- Contact email destination: `capjuancode@devapp.studio` (via `RESEND_API_KEY` env var).
- Out of scope: time_tracker, Devise auth, any database.
- Node 20, npm 10. Project root: `/Users/juanlopez/Documents/github/devapp`.
- All paths below are relative to the project root.

---

## File Structure

```
app/
  layout.tsx              # root layout: fonts, ThemeProvider, metadata
  page.tsx                # composes all sections
  globals.css             # Tailwind + base tokens
  api/contact/route.ts    # serverless contact handler (Resend)
components/
  Navbar.tsx
  ThemeToggle.tsx
  ThemeProvider.tsx
  ui/Reveal.tsx           # scroll-reveal wrapper (Framer Motion)
  ui/Button.tsx
  sections/Hero.tsx
  sections/Services.tsx
  sections/Process.tsx
  sections/Work.tsx
  sections/Clients.tsx
  sections/Contact.tsx
  sections/Footer.tsx
content/
  site.ts                 # all copy + data
lib/
  validateContact.ts      # pure validation (shared by API + form)
public/images/            # migrated, optimized assets
test setup + configs
```

---

### Task 1: Scaffold Next.js project + Tailwind + theme tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Test: none (scaffolding verified by build)

**Interfaces:**
- Produces: a running Next app at `localhost:3000`; Tailwind classes incl. `dark:` variant; CSS vars `--accent`.

- [ ] **Step 1: Scaffold the app**

Run from project root (the dir already contains `.git` and `docs/`):
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack
```
When prompted that the directory is not empty, continue (it only has `.git`, `.gitignore`, `docs/`).

- [ ] **Step 2: Install runtime + test deps**

```bash
npm install framer-motion resend
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind for class-based dark mode + accent**

Replace `tailwind.config.ts` with:
```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: "#6D2E91", deep: "#5A2676", soft: "#8B5CF6" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Set base globals**

Replace `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
.dark { color-scheme: dark; }

html { scroll-behavior: smooth; }
body { @apply bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```
Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 6: Verify build runs**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js + Tailwind + Vitest with theme tokens"
```

---

### Task 2: Migrate and organize image assets

**Files:**
- Create: `public/images/work/`, `public/images/clients/`, `public/images/logo/`, `public/images/hero/`
- Test: none (verified by listing)

**Interfaces:**
- Produces: predictable asset paths used by `content/site.ts` in Task 3, e.g. `/images/work/work-01.jpg`, `/images/clients/client-01.png`, `/images/logo/devapp.svg`, `/images/logo/devapp-white.svg`, `/images/hero/hero.jpg`.

- [ ] **Step 1: Copy and rename assets from the Rails app**

```bash
SRC=../DevAppStudio/app/assets/images
mkdir -p public/images/work public/images/clients public/images/logo public/images/hero
cp "$SRC/dev_app.svg" public/images/logo/devapp.svg
cp "$SRC/dev_app_white.svg" public/images/logo/devapp-white.svg
cp "$SRC/index/web_devappstudio.jpg" public/images/hero/hero.jpg
i=1; for f in "$SRC"/index/carousel/*.jpg; do cp "$f" "$(printf 'public/images/work/work-%02d.jpg' $i)"; i=$((i+1)); done
i=1; for f in "$SRC"/index/customers/*.png; do cp "$f" "$(printf 'public/images/clients/client-%02d.png' $i)"; i=$((i+1)); done
```

- [ ] **Step 2: Verify assets landed**

Run: `ls public/images/work public/images/clients public/images/logo public/images/hero`
Expected: ~15 work images, ~16 client logos, 2 logo SVGs, 1 hero image.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: migrate and rename image assets from Rails app"
```

---

### Task 3: Central content data file

**Files:**
- Create: `content/site.ts`
- Test: none (typed data; consumed later)

**Interfaces:**
- Produces: `site` object with typed fields used by all sections:
  - `site.meta = { name, tagline, email, phone, location }`
  - `site.hero = { headline: string, sub: string, cta: string }`
  - `site.services: { title: string, body: string }[]`
  - `site.process: { step: string, title: string, body: string }[]`
  - `site.work: { src: string, alt: string }[]`
  - `site.clients: { src: string, alt: string }[]`

- [ ] **Step 1: Write the content file**

```ts
export const site = {
  meta: {
    name: "DevApp Studio",
    tagline: "We build software and design that moves businesses forward.",
    email: "capjuancode@devapp.studio",
    phone: "+1 954-821-2508",
    location: "Orlando, FL 32832",
  },
  hero: {
    headline: "Software & design, crafted to move you forward.",
    sub: "A focused team of full-stack developers and designers building modern web applications and brands.",
    cta: "Let's talk",
  },
  services: [
    { title: "Web Applications", body: "Fast, scalable web apps built end to end with modern stacks." },
    { title: "UI/UX Design", body: "Clean, intentional interfaces designed around your users." },
    { title: "Brand, Logos & Flyers", body: "Visual identity and assets that make you look the part." },
    { title: "Consulting", body: "We help you scope, plan, and ship the right thing." },
  ],
  process: [
    { step: "01", title: "Talk", body: "We start by understanding your idea and setting clear expectations." },
    { step: "02", title: "Design", body: "We craft the experience and visuals before a line of code." },
    { step: "03", title: "Build", body: "We develop with attention to every detail." },
    { step: "04", title: "Launch", body: "We ship, measure, and keep improving." },
  ],
  work: Array.from({ length: 15 }, (_, i) => ({
    src: `/images/work/work-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `DevApp Studio project ${i + 1}`,
  })),
  clients: Array.from({ length: 16 }, (_, i) => ({
    src: `/images/clients/client-${String(i + 1).padStart(2, "0")}.png`,
    alt: `Client ${i + 1}`,
  })),
};

export type Site = typeof site;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add central site content data"
```

---

### Task 4: Theme provider + toggle (no-flash light/dark)

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`
- Modify: `app/layout.tsx`
- Test: `components/__tests__/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<ThemeProvider>` wrapping the app; `useTheme()` hook returning `{ theme: "light"|"dark", toggle: () => void }`; `<ThemeToggle />` button that flips `document.documentElement` `.dark` class and persists to `localStorage["theme"]`.

- [ ] **Step 1: Write the failing test**

`components/__tests__/ThemeToggle.test.tsx`:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

test("toggles the dark class on the html element", () => {
  document.documentElement.classList.remove("dark");
  render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
  const btn = screen.getByRole("button", { name: /theme/i });
  fireEvent.click(btn);
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  fireEvent.click(btn);
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ThemeToggle`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement ThemeProvider**

`components/ThemeProvider.tsx`:
```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null);
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 4: Implement ThemeToggle**

`components/ThemeToggle.tsx`:
```tsx
"use client";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full border border-neutral-300 p-2 text-sm transition hover:border-accent dark:border-neutral-700"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

- [ ] **Step 5: Wire provider + no-flash script into layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/content/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: `${site.meta.name} — ${site.meta.tagline}`,
  description: site.hero.sub,
};

const noFlash = `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: noFlash }} /></head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- ThemeToggle`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: light/dark theme provider and toggle with no-flash"
```

---

### Task 5: Reusable Reveal animation wrapper + Button

**Files:**
- Create: `components/ui/Reveal.tsx`, `components/ui/Button.tsx`
- Test: `components/__tests__/Reveal.test.tsx`

**Interfaces:**
- Consumes: framer-motion.
- Produces: `<Reveal delay?={number}>children</Reveal>` — fades/slides children up when scrolled into view (once). `<Button href? onClick? variant?>` — accent CTA button/link.

- [ ] **Step 1: Write the failing test**

`components/__tests__/Reveal.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/ui/Reveal";

test("renders its children", () => {
  render(<Reveal><p>hello</p></Reveal>);
  expect(screen.getByText("hello")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Reveal`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement Reveal**

`components/ui/Reveal.tsx`:
```tsx
"use client";
import { motion } from "framer-motion";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Implement Button**

`components/ui/Button.tsx`:
```tsx
import Link from "next/link";

type Props = { href?: string; onClick?: () => void; children: React.ReactNode; variant?: "solid" | "ghost"; type?: "button" | "submit" };

export function Button({ href, onClick, children, variant = "solid", type = "button" }: Props) {
  const cls =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition " +
    (variant === "solid"
      ? "bg-accent text-white hover:bg-accent-deep"
      : "border border-neutral-300 hover:border-accent dark:border-neutral-700");
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- Reveal`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: Reveal animation wrapper and Button primitive"
```

---

### Task 6: Navbar with logo + theme toggle

**Files:**
- Create: `components/Navbar.tsx`
- Test: none (presentational; verified visually)

**Interfaces:**
- Consumes: `site`, `ThemeToggle`. Produces: `<Navbar />` — fixed top bar, anchors to `#work`, `#services`, `#contact`, logo swaps per theme.

- [ ] **Step 1: Implement Navbar**

`components/Navbar.tsx`:
```tsx
"use client";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/content/site";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-neutral-950/70 border-b border-black/5 dark:border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-semibold">
          <span>{site.meta.name}</span>
        </a>
        <div className="hidden gap-8 text-sm md:flex">
          <a href="#services" className="hover:text-accent">Services</a>
          <a href="#work" className="hover:text-accent">Work</a>
          <a href="#contact" className="hover:text-accent">Contact</a>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Verify dev server renders the navbar**

Run: `npm run dev` then open `localhost:3000` (after Task 15 wires it). For now: `npx tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: sticky navbar with theme toggle"
```

---

### Task 7: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Test: none (visual)

**Interfaces:**
- Consumes: `site.hero`, `Reveal`, `Button`, framer-motion. Produces: `<Hero />` — full-height hero with animated gradient backdrop, headline, sub, CTA.

- [ ] **Step 1: Implement Hero**

`components/sections/Hero.tsx`:
```tsx
"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-6">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #6D2E91, transparent 60%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          {site.hero.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400"
        >
          {site.hero.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }} className="mt-10"
        >
          <Button href="#contact">{site.hero.cta}</Button>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: animated hero section"
```

---

### Task 8: Services section

**Files:**
- Create: `components/sections/Services.tsx`
- Test: none (visual)

**Interfaces:**
- Consumes: `site.services`, `Reveal`. Produces: `<Services />` with `id="services"`.

- [ ] **Step 1: Implement Services**

`components/sections/Services.tsx`:
```tsx
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">What we do</h2>
      </Reveal>
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {site.services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <div className="h-full rounded-3xl border border-black/5 p-8 transition hover:border-accent/40 hover:shadow-lg dark:border-white/10">
              <h3 className="text-xl font-medium">{s.title}</h3>
              <p className="mt-3 text-neutral-600 dark:text-neutral-400">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: services section"
```

---

### Task 9: Process section

**Files:**
- Create: `components/sections/Process.tsx`
- Test: none (visual)

**Interfaces:**
- Consumes: `site.process`, `Reveal`. Produces: `<Process />`.

- [ ] **Step 1: Implement Process**

`components/sections/Process.tsx`:
```tsx
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function Process() {
  return (
    <section className="border-y border-black/5 bg-neutral-50 px-6 py-32 dark:border-white/10 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">How we work</h2></Reveal>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.05}>
              <div>
                <div className="text-sm font-medium text-accent">{p.step}</div>
                <h3 className="mt-2 text-xl font-medium">{p.title}</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: process section"
```

---

### Task 10: Work / portfolio gallery

**Files:**
- Create: `components/sections/Work.tsx`
- Test: none (visual)

**Interfaces:**
- Consumes: `site.work`, `Reveal`, `next/image`. Produces: `<Work />` with `id="work"`, responsive masonry-ish grid, hover zoom.

- [ ] **Step 1: Implement Work**

`components/sections/Work.tsx`:
```tsx
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-32">
      <Reveal><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Selected work</h2></Reveal>
      <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {site.work.map((w, i) => (
          <Reveal key={w.src} delay={(i % 3) * 0.05}>
            <div className="group overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
              <Image
                src={w.src} alt={w.alt} width={800} height={600}
                className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: work gallery section"
```

---

### Task 11: Clients marquee

**Files:**
- Create: `components/sections/Clients.tsx`
- Modify: `app/globals.css` (add marquee keyframes)
- Test: none (visual)

**Interfaces:**
- Consumes: `site.clients`, `next/image`. Produces: `<Clients />` infinite horizontal logo marquee.

- [ ] **Step 1: Add marquee keyframes to globals.css**

Append to `app/globals.css`:
```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 40s linear infinite; }
.marquee-mask { -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
```

- [ ] **Step 2: Implement Clients**

`components/sections/Clients.tsx`:
```tsx
import Image from "next/image";
import { site } from "@/content/site";

export function Clients() {
  const logos = [...site.clients, ...site.clients];
  return (
    <section className="py-24">
      <p className="mb-12 text-center text-sm uppercase tracking-widest text-neutral-500">Trusted by</p>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 px-8">
          {logos.map((c, i) => (
            <Image key={i} src={c.src} alt={c.alt} width={120} height={48}
              className="h-10 w-auto object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert" />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: clients marquee section"
```

---

### Task 12: Contact validation + API route (Resend)

**Files:**
- Create: `lib/validateContact.ts`, `app/api/contact/route.ts`
- Test: `lib/__tests__/validateContact.test.ts`

**Interfaces:**
- Produces:
  - `validateContact(input: unknown): { ok: true; data: ContactData } | { ok: false; error: string }` where `ContactData = { email: string; telephone: string; companyName: string; message: string }`.
  - Honeypot: if `input.nickname` is a non-empty string, return `{ ok: false, error: "spam" }`.
  - `POST /api/contact` → 200 `{ ok: true }` on success, 400 `{ ok: false, error }` on validation failure, 500 on send failure.

- [ ] **Step 1: Write the failing test**

`lib/__tests__/validateContact.test.ts`:
```ts
import { validateContact } from "@/lib/validateContact";

const valid = { email: "a@b.com", telephone: "123", companyName: "Acme", message: "Hi there" };

test("accepts valid input", () => {
  const r = validateContact(valid);
  expect(r.ok).toBe(true);
});
test("rejects bad email", () => {
  expect(validateContact({ ...valid, email: "nope" }).ok).toBe(false);
});
test("rejects missing company", () => {
  expect(validateContact({ ...valid, companyName: "" }).ok).toBe(false);
});
test("rejects when honeypot filled", () => {
  const r = validateContact({ ...valid, nickname: "bot" });
  expect(r).toEqual({ ok: false, error: "spam" });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- validateContact`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement validateContact**

`lib/validateContact.ts`:
```ts
export type ContactData = { email: string; telephone: string; companyName: string; message: string };
type Result = { ok: true; data: ContactData } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateContact(input: unknown): Result {
  const v = (input ?? {}) as Record<string, unknown>;
  if (typeof v.nickname === "string" && v.nickname.trim() !== "") return { ok: false, error: "spam" };
  const email = String(v.email ?? "").trim();
  const companyName = String(v.companyName ?? "").trim();
  const message = String(v.message ?? "").trim();
  const telephone = String(v.telephone ?? "").trim();
  if (!EMAIL.test(email)) return { ok: false, error: "Please enter a valid email." };
  if (!companyName) return { ok: false, error: "Company name is required." };
  if (!message) return { ok: false, error: "Message is required." };
  return { ok: true, data: { email, telephone, companyName, message } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- validateContact`
Expected: PASS.

- [ ] **Step 5: Implement the API route**

`app/api/contact/route.ts`:
```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validateContact";
import { site } from "@/content/site";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const result = validateContact(body);
  if (!result.ok) {
    const status = result.error === "spam" ? 200 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }
  const { email, telephone, companyName, message } = result.data;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "DevApp Studio <onboarding@resend.dev>",
      to: site.meta.email,
      replyTo: email,
      subject: `New contact from ${companyName}`,
      text: `From: ${companyName} <${email}>\nPhone: ${telephone}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to send. Please try again." }, { status: 500 });
  }
}
```

- [ ] **Step 6: Add env example**

Create `.env.example`:
```
RESEND_API_KEY=your_resend_api_key_here
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: contact validation + Resend API route"
```

---

### Task 13: Contact section form (client)

**Files:**
- Create: `components/sections/Contact.tsx`
- Test: `components/__tests__/Contact.test.tsx`

**Interfaces:**
- Consumes: `site.meta`, `Reveal`, `Button`, `/api/contact`. Produces: `<Contact />` with `id="contact"`, controlled form (email, telephone, companyName, message, hidden nickname honeypot), client-side required validation, submit states (idle/sending/success/error).

- [ ] **Step 1: Write the failing test**

`components/__tests__/Contact.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";

test("shows success after a successful submit", async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }) as any;
  render(<Contact />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
  fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "Acme" } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hello" } });
  fireEvent.click(screen.getByRole("button", { name: /send/i }));
  await waitFor(() => expect(screen.getByText(/thanks/i)).toBeInTheDocument());
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Contact`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement Contact**

`components/sections/Contact.tsx`:
```tsx
"use client";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending"); setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) setStatus("success");
      else { setStatus("error"); setError(data.error || "Something went wrong."); }
    } catch { setStatus("error"); setError("Network error. Please try again."); }
  }

  const field = "w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 outline-none focus:border-accent dark:border-white/15";

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s build something.</h2>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Tell us about your idea and we&apos;ll get back to you.</p>
            <dl className="mt-8 space-y-2 text-sm">
              <div><dt className="inline text-neutral-500">Email: </dt><dd className="inline">{site.meta.email}</dd></div>
              <div><dt className="inline text-neutral-500">Phone: </dt><dd className="inline">{site.meta.phone}</dd></div>
              <div><dt className="inline text-neutral-500">Location: </dt><dd className="inline">{site.meta.location}</dd></div>
            </dl>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {status === "success" ? (
            <p className="rounded-2xl border border-accent/30 p-8 text-lg">Thanks — we&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm">Email</label>
                <input id="email" name="email" type="email" required className={field} />
              </div>
              <div>
                <label htmlFor="telephone" className="mb-1 block text-sm">Phone (optional)</label>
                <input id="telephone" name="telephone" type="tel" className={field} />
              </div>
              <div>
                <label htmlFor="companyName" className="mb-1 block text-sm">Company</label>
                <input id="companyName" name="companyName" required className={field} />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm">Message</label>
                <textarea id="message" name="message" rows={4} required className={field} />
              </div>
              <input type="text" name="nickname" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              {status === "error" && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={status === "sending"}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Contact`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: contact form section with submit states"
```

---

### Task 14: Footer

**Files:**
- Create: `components/sections/Footer.tsx`
- Test: none (visual)

**Interfaces:**
- Consumes: `site.meta`. Produces: `<Footer />`.

- [ ] **Step 1: Implement Footer**

`components/sections/Footer.tsx`:
```tsx
import { site } from "@/content/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-black/5 px-6 py-12 text-sm text-neutral-500 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span>© {year} {site.meta.name}</span>
        <div className="flex gap-6">
          <a href={`mailto:${site.meta.email}`} className="hover:text-accent">{site.meta.email}</a>
          <a href={`tel:${site.meta.phone}`} className="hover:text-accent">{site.meta.phone}</a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit` → no errors.
```bash
git add -A && git commit -m "feat: footer"
```

---

### Task 15: Compose the page, SEO metadata, final verify

**Files:**
- Modify: `app/page.tsx`
- Create: `app/sitemap.ts`
- Test: none (full build + manual)

**Interfaces:**
- Consumes: all section components + `Navbar`.

- [ ] **Step 1: Compose page.tsx**

Replace `app/page.tsx`:
```tsx
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <Work />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Add sitemap**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://devapp.studio", changeFrequency: "monthly", priority: 1 }];
}
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open `localhost:3000`. Confirm: hero animates in; sections reveal on scroll; theme toggle flips light/dark with no flash on reload; work grid hovers; clients marquee scrolls; contact form validates and shows states (set `RESEND_API_KEY` in `.env.local` to test real send).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: compose landing page + sitemap"
```

---

### Task 16: Vercel deployment config + README

**Files:**
- Create: `README.md`
- Test: none

- [ ] **Step 1: Write README**

`README.md`:
```markdown
# DevApp Studio

Marketing site — Next.js (App Router), Tailwind, Framer Motion. Deployed on Vercel.

## Develop
npm install
npm run dev

## Test
npm test

## Environment
RESEND_API_KEY — required for the contact form (see .env.example).

## Deploy
Push to GitHub, import the repo in Vercel, set RESEND_API_KEY in project env vars. Build command and output are auto-detected.
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "docs: add README"
```

- [ ] **Step 3: Deploy (manual, with user)**

Push to GitHub and import in Vercel; set `RESEND_API_KEY`. Verify the contact form sends on the live URL. (Requires the user's Resend key + GitHub/Vercel access.)

---

## Self-Review Notes

- **Spec coverage:** Hero (T7), Services (T8), Process (T9), Work (T10), Clients (T11), Contact form+API (T12–13), Footer (T14), theme toggle (T4), Next.js+Tailwind+Framer (T1), asset migration (T2), Resend contact (T12), Vercel deploy (T16) — all spec sections mapped.
- **Honeypot** mirrors the old `nickname` captcha field (T12–13).
- **Types** consistent: `validateContact` / `ContactData` defined in T12 and consumed by T12's route; `site` shape from T3 used everywhere; `useTheme` from T4 used by T4's toggle.
- **Out of scope** (time_tracker, Devise, DB) excluded as specified.
- **Deferred inputs** (Resend key, which work images to feature, final copy) are placeholders the user fills; copy drafts are provided so no task is blocked.
