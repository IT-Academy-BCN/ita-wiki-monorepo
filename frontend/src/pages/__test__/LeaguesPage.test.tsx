import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LeaguesPage from "../LeaguesPage";

describe("LeaguesPage", () => {
  it("shows WeeklyRanking by default", async () => {
    render(<LeaguesPage />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /lliga oro/i }),
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
    fireEvent.click(screen.getByRole("button", { name: /lliga setmanal/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /lliga oro/i }),
      ).toBeInTheDocument();
    });
  });
});
