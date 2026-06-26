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
