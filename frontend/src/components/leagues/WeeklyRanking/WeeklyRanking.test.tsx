import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getLeagueRanking } from "../../../services/leagueService";
import { WeeklyRanking } from "./WeeklyRanking";

vi.mock("../../../services/leagueService", () => ({
  getLeagueRanking: vi.fn(),
}));
vi.mock("../../leagues/StandingsTable", () => ({
  StandingsTable: () => (
    <table>
      <thead>
        <tr>
          <th>Posició</th>
        </tr>
      </thead>
    </table>
  ),
}));

const mockRanking = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    weekly_points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("WeeklyRanking", () => {
  it("renders the standings table after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);
    render(<WeeklyRanking />);
    await waitFor(() =>
      expect(screen.getByText("Posició")).toBeInTheDocument(),
    );
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));
    expect(() => render(<WeeklyRanking />)).not.toThrow();
  });
});
