import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeagueList } from "../LeagueList";

const mockStandings = [{ username: "Júlia", points: 90 }];

describe("LeagueList", () => {
  it("renders the column headers", () => {
    render(<LeagueList standings={mockStandings} />);

    expect(screen.getByText("Nom")).toBeInTheDocument();
  });

  it("renders all standings correctly", () => {
    render(<LeagueList standings={mockStandings} />);

    expect(screen.getByText("Júlia")).toBeInTheDocument();

    expect(screen.getByText("90")).toBeInTheDocument();
  });
});
