import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PointsHistoryTable from "../PointsHistoryTable/PointsHistoryTable";

describe("PointsHistoryTable", () => {
  it("renders the three column headers", () => {
    render(<PointsHistoryTable data={[]} />);

    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Punts guanyats")).toBeInTheDocument();
    expect(screen.getByText("Activitats realitzades")).toBeInTheDocument();
  });

  it("renders rows with data from props", () => {
    const mockData = [
      { date: "2026-06-01T10:00:00.000000Z", points: 5, activity: "Resolució de Dubtes" },
    ];

    render(<PointsHistoryTable data={mockData} />);

    expect(screen.getByText("2026-06-01T10:00:00.000000Z")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Resolució de Dubtes")).toBeInTheDocument();
  });
});
