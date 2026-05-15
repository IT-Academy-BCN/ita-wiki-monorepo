import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LeaguesPage from "../LeaguesPage";

vi.mock("../../components/leagues-ranking/WeeklyRanking/WeeklyRanking", () => ({
  WeeklyRanking: () => <h1>Lliga setmanal</h1>,
}));

vi.mock("../../components/leagues-ranking/GlobalRanking/GlobalRanking", () => ({
  GlobalRanking: () => <h1>Classificació general</h1>,
}));

describe("LeaguesPage", () => {
  it("shows WeeklyRanking by default", async () => {
    render(<LeaguesPage />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /lliga or/i }),
      ).toBeInTheDocument();
    });
  });

  it("switches to GlobalRanking on toggle", () => {
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    expect(
      screen.getByRole("heading", { name: /classificació general/i }),
    ).toBeInTheDocument();
  });
  it("switches back to WeeklyRanking on toggle from Global", async () => {
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    fireEvent.click(screen.getByRole("button", { name: /lliga setmanal/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /lliga or/i }),
      ).toBeInTheDocument();
    });
  });
});
