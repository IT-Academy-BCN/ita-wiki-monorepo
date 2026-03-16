import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TechnicalTestSkeleton from "../TechnicalTestSkeleton";

describe("TechnicalTestSkeleton", () => {
  it("renders the resource skeleton card with the expected container layout", () => {
    render(<TechnicalTestSkeleton />);

    const skeleton = screen.getByTestId("technical-test-card-skeleton");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe("LI");
    expect(skeleton.className).toContain("animate-pulse");
    expect(skeleton.className).toContain("min-h-[347px]");
    expect(skeleton.className).toContain("max-w-sm");
  });

  it("renders the key metadata placeholder groups used by the final card", () => {
    render(<TechnicalTestSkeleton />);

    const skeleton = screen.getByTestId("technical-test-card-skeleton");
    const chipPlaceholders = skeleton.querySelectorAll(
      ".rounded-full.border.border-gray-200.bg-gray-100",
    );
    const metricIconPlaceholders = skeleton.querySelectorAll(
      ".w-4.h-4.rounded-full.bg-gray-200",
    );

    expect(chipPlaceholders).toHaveLength(2);
    expect(metricIconPlaceholders.length).toBeGreaterThanOrEqual(3);
  });
});