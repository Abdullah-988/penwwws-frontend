import { beforeEach, expect, test, vitest } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

beforeEach(() => {
  const mockIntersectionObserver = vitest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  vitest.stubGlobal("ResizeObserver", mockIntersectionObserver);
});

test("Page", () => {
  render(<Page />);

  expect(
    screen.getByText(
      "An all-in-one platform to manage students, staff, classes, and school operations—built to make administration simple and efficient.",
    ),
  ).toBeDefined();
});
