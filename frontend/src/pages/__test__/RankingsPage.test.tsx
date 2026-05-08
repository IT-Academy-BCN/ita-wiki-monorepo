import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getLeagueRanking } from "../../services/leagueService";

import RankingsPage from "../RankingsPage";

vi.mock("../../services/leagueService", () => ({
  getLeagueRanking: vi.fn(),
}));

vi.mock("../../components/leagues/LeagueList", () => ({
  LeagueList: ({
    standings,
  }: {
    standings: { username: string; points: number }[];
  }) => (
    <div>
      <div>Posició</div>
      {standings.map((standing) => (
        <div key={standing.username}>
          <span>{standing.username}</span>
          <span>{standing.points}</span>
        </div>
      ))}
    </div>
  ),
}));

const mockRanking = [
  {
    username: "Albert",
    points: 94,
  },
];

describe("RankingsPage", () => {
  it("renders the league list after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });

    expect(screen.getByText("Albert")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));

    expect(() => render(<RankingsPage />)).not.toThrow();
  });
});
