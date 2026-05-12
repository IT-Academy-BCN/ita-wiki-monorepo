import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getLeagueRanking } from "../../services/leagueService";

import LeaguesPage from "../LeaguesPage";

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
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    weekly_points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("LeaguesPage", () => {
  it("renders the league list after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<LeaguesPage />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });

    expect(screen.getByText("Júlia")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));

    expect(() => render(<LeaguesPage />)).not.toThrow();
  });
});
