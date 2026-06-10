import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PointsHistoryTable from "../PointsHistoryTable/PointsHistoryTable";

describe("PointsHistoryTable", () => {
  it("renders the three column headers", () => {
    render(<PointsHistoryTable />);

    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Punts guanyats")).toBeInTheDocument();
    expect(screen.getByText("Activitats realitzades")).toBeInTheDocument();
  });
});