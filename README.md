# DevApp Studio

Marketing site for DevApp Studio — a modern rebuild of the original Rails site.
Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.
Elegant, Apple-style design with a light/dark theme toggle and premium scroll
animations. Deployed on Vercel.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Test

```bash
npm test          # run once
npm run test:watch
```

## Build

```bash
npm run build
```

## Environment

The contact form sends email through [Resend](https://resend.com). Set:

```
RESEND_API_KEY=your_resend_api_key_here
```

in `.env.local` for local development (see `.env.example`), and in the Vercel
project's environment variables for production. Contact submissions are emailed
to `capjuancode@devapp.studio`. Until a custom domain is verified in Resend, the
sender uses Resend's sandbox address (`onboarding@resend.dev`).

## Deploy (Vercel)

1. Push this repository to GitHub.
2. Import the repo in Vercel — framework, build command, and output are
   auto-detected for Next.js.
3. Set `RESEND_API_KEY` in the Vercel project's environment variables.
4. Verify the contact form sends on the live URL.

## Project structure

```
app/            # routes, layout, API (api/contact), sitemap
components/     # Navbar, ThemeToggle/Provider, ui/ primitives, sections/
content/site.ts # all site copy and data
lib/            # validateContact (shared validation)
public/images/  # optimized assets
```
