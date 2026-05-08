import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RankingsPage from "../RankingsPage";

describe("RankingsPage", () => {
  it("shows WeeklyRanking by default", () => {
    render(<RankingsPage />);
    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });

  it("switches to GlobalRanking on toggle", () => {
    render(<RankingsPage />);
    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );
    expect(
      screen.getByRole("heading", { name: /classificació general/i }),
    ).toBeInTheDocument();
  });

  it("switches back to WeeklyRanking on toggle from Global", () => {
    render(<RankingsPage />);
    fireEvent.click(screen.getByRole("button", { name: /lliga setmanal/i }));
    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });
});
