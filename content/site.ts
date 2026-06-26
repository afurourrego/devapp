export const site = {
  meta: {
    name: "DevApp Studio",
    tagline: "Software & design studio.",
    email: "capjuancode@devapp.studio",
    phone: "+1 954-821-2508",
    location: "Orlando, FL",
  },
  hero: {
    eyebrow: "Software & design studio",
    // rendered as stacked kinetic lines; `accent` line gets the aurora gradient
    lines: ["We build", "software & design", "that moves you"],
    accentLine: "software & design",
    sub: "A small, senior team shipping websites, apps, and brands for companies that refuse to look like everyone else.",
    cta: "Start a project",
  },
  services: [
    {
      tag: "engineering",
      title: "Web Applications",
      body: "Full-stack web apps built to scale — from the React/Next.js front end to the infrastructure behind it.",
    },
    {
      tag: "design",
      title: "Product & UI/UX",
      body: "Interfaces designed around real users, prototyped and pixel-perfected before a line of code ships.",
    },
    {
      tag: "brand",
      title: "Brand & Identity",
      body: "Logos, visual systems, and the assets that make you look the part — on screen and off.",
    },
    {
      tag: "advisory",
      title: "Strategy & Consulting",
      body: "We help you scope, plan, and ship the right thing — and avoid building the wrong one.",
    },
  ],
  process: [
    { step: "01", title: "Talk", body: "We dig into your idea, your users, and the outcome that matters — then set clear expectations." },
    { step: "02", title: "Design", body: "We shape the experience and the visuals, prototyping until it feels right before we build." },
    { step: "03", title: "Build", body: "We engineer it end to end, obsessing over the details most teams skip." },
    { step: "04", title: "Launch", body: "We ship, measure what happens, and keep sharpening it after go-live." },
  ],
  work: Array.from({ length: 15 }, (_, i) => ({
    src: `/images/work/work-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `DevApp Studio project ${i + 1}`,
    label: `Project ${String(i + 1).padStart(2, "0")}`,
  })),
  clients: Array.from({ length: 16 }, (_, i) => ({
    src: `/images/clients/client-${String(i + 1).padStart(2, "0")}.png`,
    alt: `Client ${i + 1}`,
  })),
} as const;

export type Site = typeof site;
