import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalRanking } from "../../leagues-ranking/GlobalRanking/GlobalRanking";

describe("GlobalRanking", () => {
  it("renders the add point component", () => {
    render(<GlobalRanking />);
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sumar punts/i }),
    ).toBeInTheDocument();
  });
});
