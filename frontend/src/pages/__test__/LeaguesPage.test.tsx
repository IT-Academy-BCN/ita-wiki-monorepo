import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LeaguesPage from "../LeaguesPage";

describe("LeaguesPage", () => {
  it("shows WeeklyRanking by default", () => {
    render(<LeaguesPage />);

    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });

  it("switches to GlobalRanking on toggle", () => {
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    expect(
      screen.getByRole("button", { name: /classificació general/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches back to WeeklyRanking on toggle from Global", () => {
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    fireEvent.click(screen.getByRole("button", { name: /lliga setmanal/i }));

    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });
});
