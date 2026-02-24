import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SortIcon from "../SortIcon";

describe("SortIcon", () => {
  it("renders heart icon", () => {
    render(<SortIcon name="heart" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-4", "h-4");
  });

  it("renders calendar icon", () => {
    render(<SortIcon name="calendar" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders chevronUp icon", () => {
    render(<SortIcon name="chevronUp" />);
    const path = document.querySelector("path");
    expect(path).toHaveAttribute("d", "M5 15l7-7 7 7");
  });

  it("renders chevronDown icon", () => {
    render(<SortIcon name="chevronDown" />);
    const path = document.querySelector("path");
    expect(path).toHaveAttribute("d", "M19 9l-7 7-7-7");
  });

  it("has correct SVG attributes", () => {
    render(<SortIcon name="heart" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
