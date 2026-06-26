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
