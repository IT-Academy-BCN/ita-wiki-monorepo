import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import RankingsPage from "../RankingsPage";
import { getLeagueRanking } from "../../services/leagueService";

vi.mock("../../services/leagueService", () => ({ getLeagueRanking: vi.fn() }));
vi.mock("../../components/leagues/StandingsTable", () => ({
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
