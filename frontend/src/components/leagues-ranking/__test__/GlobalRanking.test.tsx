import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchGlobalRanking } from "../../../api/endPointLeagues";
import { GlobalRanking } from "../GlobalRanking/GlobalRanking";

vi.mock("../../../api/endPointLeagues", () => ({
  fetchGlobalRanking: vi.fn(),
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
  AddLeaguePoints: ({
    users,
  }: {
    users: { user_id: number; username: string }[];
  }) => (
    <form aria-label="add league points">
      {users.map((user) => (
        <span key={user.user_id}>{user.username}</span>
      ))}
    </form>
  ),
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
    league_id: 1,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("GlobalRanking", () => {
  it("renders the league list after fetch", async () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);

    render(<GlobalRanking />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Júlia")).toHaveLength(2);
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders AddLeaguePoints", () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue([]);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();
  });

  it("renders AddLeaguePoints with ranking users", async () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("Júlia")).toHaveLength(2);
    });
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(new Error("fail"));

    expect(() => render(<GlobalRanking />)).not.toThrow();
  });

  it("renders the add point component", () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();
  });
});
