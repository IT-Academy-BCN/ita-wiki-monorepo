import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { StandingsTable } from "../StandingsTable";
import { StandingsRow } from "../StandingsRow";
import type { Liga } from "../../../types/league";

const mockLigas: Liga[] = [
  { position: 1, user_id: 101, points: 94, created_at: "", updated_at: "" },
  { position: 2, user_id: 102, points: 88, created_at: "", updated_at: "" },
  { position: 8, user_id: 103, points: 40, created_at: "", updated_at: "" },
];

describe("StandingsTable", () => {
  it("renders all rows", () => {
    render(<StandingsTable ligas={mockLigas} />);
    expect(screen.getByText("User_101")).toBeInTheDocument();
    expect(screen.getByText("User_102")).toBeInTheDocument();
    expect(screen.getByText("User_103")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(<StandingsTable ligas={[]} />);
    expect(screen.getByText("No hi han dades")).toBeInTheDocument();
  });

  it("renders with blue border when highlighted", () => {
    const { container } = render(<StandingsTable ligas={mockLigas} highlighted />);
    expect(container.firstChild).toHaveClass("border-blue-400");
  });
});

describe("StandingsRow", () => {
  const renderRow = (liga: Liga) =>
    render(
      <table>
        <tbody>
          <StandingsRow liga={liga} />
        </tbody>
      </table>,
    );

  it("applies green highlight to top 3 positions", () => {
    renderRow(mockLigas[0]);
    expect(screen.getByRole("row")).toHaveClass("bg-[#d1fae5]");
  });

  it("applies pink highlight to danger zone (position >= 8)", () => {
    renderRow(mockLigas[2]);
    expect(screen.getByRole("row")).toHaveClass("bg-[#ffe4e6]");
  });

  it("applies white background for mid positions", () => {
    const midLiga: Liga = { position: 5, user_id: 105, points: 60, created_at: "", updated_at: "" };
    renderRow(midLiga);
    expect(screen.getByRole("row")).toHaveClass("bg-white");
  });
});
