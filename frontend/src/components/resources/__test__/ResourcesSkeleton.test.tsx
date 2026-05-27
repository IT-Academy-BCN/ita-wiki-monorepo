import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResourceCardSkeleton from "../ResourcesSkeleton";

describe("ResourcesSkeleton", () => {
  it("renders the resource skeleton card with the expected container layout", () => {
    render(<ResourceCardSkeleton />);

    const skeleton = screen.getByTestId("resource-card-skeleton");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain("animate-pulse");
    expect(skeleton.className).toContain("rounded-2xl");
    expect(skeleton.className).toContain("max-w-sm");
  });

  it("renders three tag-like placeholders", () => {
    render(<ResourceCardSkeleton />);

    const skeleton = screen.getByTestId("resource-card-skeleton");
    const tagPlaceholders = skeleton.querySelectorAll(
      ".rounded-full.border.border-gray-200.bg-gray-100",
    );

    expect(tagPlaceholders).toHaveLength(3);
  });
});
