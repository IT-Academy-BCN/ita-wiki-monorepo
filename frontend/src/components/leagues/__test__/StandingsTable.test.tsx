/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { StandingsTable } from "../StandingsTable";
import { StandingsRow } from "../StandingsRow";

const mockStandings = [
  { position: 1, user_id: 1, points: 100 },
  { position: 2, user_id: 2, points: 90 },
  { position: 3, user_id: 3, points: 80 },
  { position: 9, user_id: 4, points: 70 },
];

describe("StandingsTable", () => {
  it("renders all rows correctly", () => {
    render(<StandingsTable standings={mockStandings} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders empty state when no standings are provided", () => {
    render(<StandingsTable standings={[]} />);
    expect(screen.getByText("No hi han dades disponibles")).toBeInTheDocument();
  });
});

describe("StandingsRow", () => {
  it("applies green highlight to top 3", () => {
    render(
      <table>
        <tbody>
          <StandingsRow standing={mockStandings[0]} position={1} />
        </tbody>
      </table>,
    );
    const row = screen.getByRole("row");
    expect(row).toHaveClass("bg-[var(--highlight-top)]");
  });

  it("applies pink highlight to relegation zone", () => {
    render(
      <table>
        <tbody>
          <StandingsRow standing={mockStandings[3]} position={9} />
        </tbody>
      </table>,
    );
    const row = screen.getByRole("row");
    expect(row).toHaveClass("bg-[var(--highlight-danger)]");
  });

  it("applies white background for positions outside both ranges", () => {
    render(
      <table>
        <tbody>
          <StandingsRow standing={mockStandings[1]} position={5} />
        </tbody>
      </table>,
    );
    const row = screen.getByRole("row");
    expect(row).toHaveClass("bg-white");
  });
});
