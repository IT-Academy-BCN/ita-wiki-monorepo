/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { StandingsTable } from "../StandingsTable";
import { StandingsRow } from "../StandingsRow";

const mockStandings = [
  { position: 1, username: "Tom", points: 100 },
  { position: 2, username: "Lois", points: 90 },
  { position: 3, username: "Jon", points: 80 },
  { position: 9, username: "Anne", points: 70 },
];

describe("StandingsTable", () => {
  it("renders all rows correctly", () => {
    render(<StandingsTable standings={mockStandings} />);

    expect(screen.getByText("Tom")).toBeInTheDocument();
    expect(screen.getByText("Lois")).toBeInTheDocument();
    expect(screen.getByText("Jon")).toBeInTheDocument();
    expect(screen.getByText("Anne")).toBeInTheDocument();
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
