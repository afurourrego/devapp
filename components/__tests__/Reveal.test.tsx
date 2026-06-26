import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/ui/Reveal";

test("renders its children", () => {
  render(<Reveal><p>hello</p></Reveal>);
  expect(screen.getByText("hello")).toBeInTheDocument();
});
