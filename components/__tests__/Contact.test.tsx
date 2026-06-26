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
