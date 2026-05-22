import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UserProvider from "../../../context/UserContext";
import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import type { Ranking } from "../../../types/league";
import { WeeklyRanking } from "../WeeklyRanking/WeeklyRanking";

vi.mock("../../../hooks/useGlobalRanking", () => ({
  useGlobalRanking: vi.fn(),
}));

const mockLeagueGroups: [string, Omit<Ranking, "points_weekly">[]][] = [
  [
    "1",
    [
      {
        position: 1,
        user_id: 101,
        username: "Júlia",
        points: 94,
        status: "Junior Coder",
        language: "React",
        created_at: "2026-04-24T00:00:00Z",
        updated_at: "2026-04-24T00:00:00Z",
        league_id: 1,
      },
    ],
  ],
];

describe("WeeklyRanking", () => {
  it("renders the standings table after fetch", async () => {
    vi.mocked(useGlobalRanking).mockReturnValue({
      globalRanking: [],
      leagueGroups: mockLeagueGroups,
    });
    render(
      <UserProvider>
        <WeeklyRanking />
      </UserProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("Lliga Or")).toBeInTheDocument();
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });
});
