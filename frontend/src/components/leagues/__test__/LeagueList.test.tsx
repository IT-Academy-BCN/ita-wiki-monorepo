import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeagueList } from "../LeagueList";

const mockStandings = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("LeagueList", () => {
  it("renders the column headers", () => {
    render(<LeagueList standings={mockStandings} />);

    expect(screen.getByText("Posició")).toBeInTheDocument();
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Punts")).toBeInTheDocument();
  });

  it("renders all standings correctly", () => {
    render(<LeagueList standings={mockStandings} />);

    expect(screen.getByText("Júlia")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
    expect(screen.getByTestId("league-position-1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Junior developer")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("does not render participant positions when standings are empty", () => {
    render(<LeagueList standings={[]} />);

    expect(screen.queryByTestId("league-position-1")).not.toBeInTheDocument();
  });
});
