import { vi, test, expect, beforeEach } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: function () {
      return { emails: { send: sendMock } };
    },
  };
});

import { POST } from "@/app/api/contact/route";

const req = (body: unknown) =>
  new Request("http://test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const validPayload = { email: "a@b.com", telephone: "123", companyName: "Acme", message: "Hi there" };

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
});

test("valid payload → 200 ok:true, sendMock called once", async () => {
  const res = await POST(req(validPayload));
  const body = await res.json();
  expect(res.status).toBe(200);
  expect(body).toEqual({ ok: true });
  expect(sendMock).toHaveBeenCalledTimes(1);
});

test("missing companyName → 400 ok:false, sendMock not called", async () => {
  const res = await POST(req({ ...validPayload, companyName: "" }));
  const body = await res.json();
  expect(res.status).toBe(400);
  expect(body.ok).toBe(false);
  expect(sendMock).not.toHaveBeenCalled();
});

test("honeypot filled → 200 ok:false error:spam, sendMock not called", async () => {
  const res = await POST(req({ ...validPayload, nickname: "bot" }));
  const body = await res.json();
  expect(res.status).toBe(200);
  expect(body.ok).toBe(false);
  expect(body.error).toBe("spam");
  expect(sendMock).not.toHaveBeenCalled();
});

test("resend failure → 500 ok:false, generic error not leaking internal message", async () => {
  sendMock.mockRejectedValue(new Error("fail"));
  const res = await POST(req(validPayload));
  const body = await res.json();
  expect(res.status).toBe(500);
  expect(body.ok).toBe(false);
  expect(body.error).not.toContain("fail");
  expect(body.error).toBeTruthy();
});
