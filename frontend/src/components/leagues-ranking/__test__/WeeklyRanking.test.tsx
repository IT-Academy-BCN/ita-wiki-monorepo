import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLeagues } from "../../../hooks/useLeagues";
import type { LigaResponse } from "../../../types/league";
import { WeeklyRanking } from "../WeeklyRanking/WeeklyRanking";

vi.mock("../../../hooks/useLeagues", () => ({
  useLeagues: vi.fn(),
}));

const mockLeague: LigaResponse = {
  "1": [
    {
      position: 1,
      user_id: 101,
      username: "Júlia",
      points_weekly: 94,
      league_id: 1,
    },
  ],
};

describe("WeeklyRanking", () => {
  it("renders the standings table after fetch", async () => {
    vi.mocked(useLeagues).mockReturnValue({
      leagues: mockLeague,
    });
    render(<WeeklyRanking />);
    await waitFor(() => {
      expect(screen.getByText(/Lliga Or/i)).toBeInTheDocument();
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });
});
