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
