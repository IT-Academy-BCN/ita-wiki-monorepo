import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import RankingsPage from "../RankingsPage";
import { getLeagueRanking } from "../../services/leagueService";

vi.mock("../../services/leagueService", () => ({ getLeagueRanking: vi.fn() }));
vi.mock("../../components/leagues/RankingsTable", () => ({
  RankingsTable: ({ rankings }: { rankings: unknown[] }) => (
    <div data-testid="rankings-table">{rankings.length} rows</div>
  ),
}));
vi.mock("../../components/LeaderCard/LeaderCard", () => ({
  default: () => <div data-testid="leader-card" />,
}));
vi.mock("../../components/LeagueToggle/LeagueToggle", () => ({
  default: () => <div data-testid="league-toggle" />,
}));

const mockData = [
  { position: 1, user_id: 101, points: 94, created_at: "", updated_at: "" },
  { position: 2, user_id: 102, points: 88, created_at: "", updated_at: "" },
  { position: 3, user_id: 103, points: 75, created_at: "", updated_at: "" },
  { position: 4, user_id: 104, points: 70, created_at: "", updated_at: "" },
];

describe("RankingsPage", () => {
  it("shows loading state initially", () => {
    vi.mocked(getLeagueRanking).mockReturnValue(new Promise(() => {}));
    render(<RankingsPage />);
    expect(screen.getByText("Carregant...")).toBeInTheDocument();
  });

  it("renders LeagueToggle, LeaderCards and RankingsTables after fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockData);
    render(<RankingsPage />);
    await waitFor(() => {
      expect(screen.getByTestId("league-toggle")).toBeInTheDocument();
      expect(screen.getAllByTestId("leader-card")).toHaveLength(3);
      expect(screen.getAllByTestId("rankings-table")).toHaveLength(2);
    });
  });

  it("shows error message on fetch failure", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("fail"));
    render(<RankingsPage />);
    await waitFor(() => {
      expect(
        screen.getByText("No s'ha pogut carregar el rànquing."),
      ).toBeInTheDocument();
    });
  });
});
