import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalRanking } from "../GlobalRanking";

describe("GlobalRanking", () => {
  it("renders the global ranking", () => {
    render(<GlobalRanking />);
    const container = document.querySelector("article");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Jordi");
    expect(container).toHaveTextContent("115");
  });
  it("renders the add point component", () => {
    render(<GlobalRanking />);
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sumar punts/i }),
    ).toBeInTheDocument();
  });
});
