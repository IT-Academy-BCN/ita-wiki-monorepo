import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getLeagueRanking } from "../../services/leagueService";

import LeaguesPage from "../LeaguesPage";

vi.mock("../../services/leagueService", () => ({ getLeagueRanking: vi.fn() }));

vi.mock(
  "../../components/leagues-ranking/StandingsTable/StandingsTable",
  () => ({
    StandingsTable: () => (
      <table>
        <thead>
          <tr>
            <th>Posició</th>
          </tr>
        </thead>
      </table>
    ),
  }),
);

const mockRanking = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    weekly_points: 94,
    created_at: "",
    updated_at: "",
  },
];

describe("LeaguesPage", () => {
  it("renders the league list after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<LeaguesPage />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));

    expect(() => render(<LeaguesPage />)).not.toThrow();
  });
});
