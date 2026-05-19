import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlobalRanking } from "../GlobalRanking/GlobalRanking";

import { getLeagueRanking } from "../../../services/leagueService";

vi.mock("../../../services/leagueService", () => ({
  getLeagueRanking: vi.fn(),
}));

vi.mock("../LeagueList/LeagueList", () => ({
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

vi.mock("../AddLeaguePoints/AddLeaguePoints", () => ({
  AddLeaguePoints: () => <form aria-label="add league points" />,
}));

const mockRanking = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    points_weekly: 94,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("GlobalRanking", () => {
  it("renders the league list after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<GlobalRanking />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });

    expect(screen.getByText("Júlia")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders AddLeaguePoints", () => {
    vi.mocked(getLeagueRanking).mockResolvedValue([]);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));

    expect(() => render(<GlobalRanking />)).not.toThrow();
  });

  it("renders the add point component", () => {
    vi.mocked(getLeagueRanking).mockResolvedValue([]);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();
  });
});
