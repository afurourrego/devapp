# DevApp Studio — Rebuild & Redesign Design Spec

**Date:** 2026-06-24
**Status:** Approved (design phase)

## Goal

Rebuild the DevApp Studio marketing site — currently a Rails 5.2 app deployed on
Heroku — as a modern Next.js site deployed on Vercel, with a complete redesign:
an elegant, Apple-style aesthetic with premium, subtle animations, in English,
with a light/dark theme toggle.

## Context: the current site

The existing site (`github/DevAppStudio`, Rails 5.2 / Ruby 2.5, ~2019–2020) is a
**single-page agency landing site**. The public site consists of:

- Parallax hero image
- Two free-text intro blocks ("We are a motivated team…")
- Image carousels (past work) + a logos slider
- Customer logos grid
- Footer with contact info + a contact form that **sends an email** via the
  `mail_form` gem (no database persistence)

There is also a `time_tracker` resource and Devise auth — these are an **internal
tool**, NOT part of the public marketing site, and are **out of scope**.

### Reusable assets (from `app/assets/images/`)
- 2 logo SVGs: `dev_app.svg`, `dev_app_white.svg`
- 15 work/project images (`index/carousel/`)
- 16 customer logos (`index/customers/`)
- 10 slider logos (`index/slider/`)
- 1 hero image (`index/web_devappstudio.jpg`)
- Brand color: purple `#5A2676`

## Decisions

| Topic | Decision |
|-------|----------|
| Framework | **Next.js (App Router) + TypeScript** |
| Hosting | **Vercel** (migrating off Heroku) |
| Styling | **Tailwind CSS** with design tokens for light/dark |
| Animation | **Framer Motion** (scroll-reveal, transitions); Lenis/GSAP only if a section needs more |
| Images | **next/image** (optimize the heavy current assets) |
| Contact form | **Resend** via a Next API route (replaces `mail_form`) |
| Language | **English only** |
| Theme | **Apple-style elegant**, light/dark toggle (persistent), purple accent in both modes |
| Content | Rethought from scratch (not a 1:1 port) |
| Branding | Reuse existing: name "DevApp Studio", purple `#5A2676` (modernized), existing images/text reworked |
| Out of scope | time_tracker, Devise login |

## Site structure (one-page, scroll)

1. **Hero** — Logo + strong headline + subtitle + primary CTA ("Let's talk").
   Animated background (subtle moving purple gradient / mesh), text entrance
   animation.
2. **Services** — Cards: Web Applications, UI/UX Design, Brand / Logos & Flyers,
   Consulting. Hover + scroll-reveal animation.
3. **Process** — The current "we communicate first…" copy turned into 3–4 visual
   steps: Talk → Design → Build → Launch.
4. **Work / Portfolio** — Current carousel images reorganized as a modern
   gallery/grid with hover + scroll-reveal effects.
5. **Clients** — Customer logos as an infinite marquee.
6. **Contact** — Redesigned form (email, phone, company, message) + contact
   info. Submits to a serverless API route.
7. **Footer** — Info, copyright, social links.

## Visual direction (Apple-style)

- Large, clean typography with strong hierarchy (Inter / SF-style). Big
  headlines, generous whitespace.
- Minimal palette: near-pure white/black + grays, purple as the single accent.
- Subtle, premium animations: scroll reveals, soft parallax, content fading in
  as you scroll, delicate hovers. Elegance over spectacle.
- Persistent light/dark toggle.

## Architecture

New project lives in `github/devapp` (current working directory).

```
devapp/
  app/
    layout.tsx          # root layout, theme provider, fonts
    page.tsx            # composes the section components
    api/contact/route.ts# serverless contact handler (Resend)
  components/
    sections/           # Hero, Services, Process, Work, Clients, Contact, Footer
    ui/                 # ThemeToggle, Button, Card, AnimatedText, etc.
  content/
    site.ts             # all copy + data (services, steps, projects, clients)
  lib/
    theme.ts            # theme helpers
  public/images/        # optimized assets migrated from the Rails app
  tailwind.config.ts
```

**Component boundaries:** each section is a self-contained component that takes
its content from `content/site.ts`. Copy/data is centralized so text edits never
require touching component internals. UI primitives (`ThemeToggle`, `Button`,
animation wrappers) are reusable and independently testable.

### Contact flow (replaces mail_form)
- `POST /api/contact` receives `{ email, telephone, companyName, message,
  nickname }`.
- Validates required fields + email format; rejects if `nickname` honeypot is
  filled (spam guard, mirrors the current `nickname` captcha field).
- Sends email via Resend to the configured destination address.
- Returns JSON `{ ok: true }` or `{ ok: false, error }`; the form shows
  success/error UI.
- Requires `RESEND_API_KEY` env var (set in Vercel + `.env.local`).

### Error handling
- Form: inline field validation, disabled state while submitting, clear
  success/error messages, graceful failure if the API errors.
- API: input validation with safe error responses; never leak internal errors.
- Images: next/image with proper sizing/fallbacks.

## Testing
- Component tests for the contact form (validation, honeypot, submit states).
- API route test for `/api/contact` (valid payload, missing fields, honeypot
  triggered, Resend failure).
- Manual/visual check of animations and light/dark across breakpoints.

## Out of scope
- time_tracker tool, Devise authentication, any database.
- Migrating Heroku infra (we deploy fresh to Vercel).

## Open items (need from user later)
- Resend API key + destination email address: `capjuancode@devapp.studio`.
- Final English copy for headlines (draft now, refine later).
- Confirm which of the 15 work images to feature.
