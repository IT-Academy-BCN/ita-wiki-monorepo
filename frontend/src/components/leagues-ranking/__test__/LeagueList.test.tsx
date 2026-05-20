import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeagueList } from "../LeagueList/LeagueList";

export const createMockStandings = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    position: index + 1,
    user_id: 101 + index,
    username: `Júlia ${index > 0 ? index : ""}`,
    points: 94 - index * 2,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  }));

describe("LeagueList", () => {
  it("renders the column headers", () => {
    render(<LeagueList standings={createMockStandings(1)} />);

    expect(screen.getByText("Posició")).toBeInTheDocument();
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Estatus")).toBeInTheDocument();
    expect(screen.getByText("Llenguatge")).toBeInTheDocument();
    expect(screen.getByText("Punts")).toBeInTheDocument();
  });

  it("renders all standings correctly", () => {
    render(<LeagueList standings={createMockStandings(1)} />);

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

  it("applies green background to the top 3 when there are more than 3 participants", () => {
    render(<LeagueList standings={createMockStandings(4)} />);
    expect(screen.getByTestId("league-position-1")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-2")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-3")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-4")).not.toHaveClass(
      "bg-green-100",
    );
  });

  it("applies red background to the last 3 when there are more than 6 participants", () => {
    render(<LeagueList standings={createMockStandings(7)} />);
    expect(screen.getByTestId("league-position-5")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-6")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-7")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-4")).not.toHaveClass(
      "bg-red-100",
    );
  });
});
