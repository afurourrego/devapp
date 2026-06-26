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
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON body */
      }
      if (res.ok && data.ok) setStatus("success");
      else {
        setStatus("error");
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-paper placeholder-muted/50 outline-none transition-colors focus:border-violet";
  const label = "mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-muted";

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-violet">Contact</p>
            <h2 className="text-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold">
              Let&apos;s build
              <br />
              <span className="text-aurora">something good.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted">
              Tell us what you&apos;re making. We reply to every serious inquiry within a day.
            </p>
            <dl className="mt-10 space-y-3 font-mono text-sm">
              <div className="flex gap-3">
                <dt className="text-muted">email</dt>
                <dd>
                  <a href={`mailto:${site.meta.email}`} className="text-paper hover:text-violet">
                    {site.meta.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted">phone</dt>
                <dd>
                  <a href={`tel:${site.meta.phone}`} className="text-paper hover:text-violet">
                    {site.meta.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-muted">where</dt>
                <dd className="text-paper">{site.meta.location}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {status === "success" ? (
            <p className="rounded-2xl border border-violet/30 bg-violet/5 p-10 text-xl text-paper">
              Thanks — we&apos;ll be in touch soon.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={label}>
                  Email
                </label>
                <input id="email" name="email" type="email" required className={field} />
              </div>
              <div>
                <label htmlFor="telephone" className={label}>
                  Phone (optional)
                </label>
                <input id="telephone" name="telephone" type="tel" className={field} />
              </div>
              <div>
                <label htmlFor="companyName" className={label}>
                  Company
                </label>
                <input id="companyName" name="companyName" required className={field} />
              </div>
              <div>
                <label htmlFor="message" className={label}>
                  Message
                </label>
                <textarea id="message" name="message" rows={4} required className={field} />
              </div>
              <input type="text" name="nickname" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              {status === "error" && <p className="text-sm text-magenta">{error}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-6px_rgba(168,85,247,0.7)] disabled:translate-y-0 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
