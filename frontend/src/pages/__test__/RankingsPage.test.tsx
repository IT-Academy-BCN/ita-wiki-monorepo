import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getLeagueRanking } from "../../services/leagueService";
import RankingsPage from "../RankingsPage";

vi.mock("../../services/leagueService", () => ({ getLeagueRanking: vi.fn() }));
vi.mock("../../components/rankings/leagues/StandingsTable", () => ({
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
  { position: 1, user_id: 101, points: 94, created_at: "", updated_at: "" },
];

describe("RankingsPage", () => {
  it("renders the standings table after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);
    render(<RankingsPage />);
    await waitFor(() =>
      expect(screen.getByText("Posició")).toBeInTheDocument(),
    );
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));
    expect(() => render(<RankingsPage />)).not.toThrow();
  });
});
