import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import RankingsPage from "../RankingsPage";
import { getLeagueRanking } from "../../services/leagueService";

vi.mock("../../services/leagueService", () => ({ getLeagueRanking: vi.fn() }));

vi.mock("../../components/LeagueToggle/LeagueToggle", () => ({
  default: ({ view, onChange }: { view: string; onChange: (v: string) => void }) => (
    <div>
      <button onClick={() => onChange("weekly")} aria-pressed={view === "weekly"}>Lliga setmanal</button>
      <button onClick={() => onChange("global")} aria-pressed={view === "global"}>Classificació general</button>
    </div>
  ),
}));

vi.mock("../../components/leagues/StandingsTable", () => ({
  StandingsTable: () => <table><thead><tr><th>Posició</th></tr></thead></table>,
}));

vi.mock("../../components/leagues/StandingsEmptyState", () => ({
  StandingsEmptyState: () => <p>No hi han dades disponibles</p>,
}));

vi.mock("../../components/leagues/StandingsTableSkeleton", () => ({
  StandingsTableSkeleton: () => <p>Carregant...</p>,
}));

const mockRanking = [
  { position: 1, user_id: 101, points: 94, created_at: "2026-04-24T00:00:00Z", updated_at: "2026-04-24T00:00:00Z" },
  { position: 2, user_id: 102, points: 88, created_at: "2026-04-24T00:00:00Z", updated_at: "2026-04-24T00:00:00Z" },
];

describe("RankingsPage", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows the skeleton while loading", () => {
    vi.mocked(getLeagueRanking).mockReturnValue(new Promise(() => {}));
    render(<RankingsPage />);
    expect(screen.getByText("Carregant...")).toBeInTheDocument();
  });

  it("shows the standings table after a successful fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);
    render(<RankingsPage />);
    await waitFor(() => expect(screen.getByText("Posició")).toBeInTheDocument());
  });

  it("shows an error message when the API fails", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));
    render(<RankingsPage />);
    await waitFor(() =>
      expect(screen.getByText("No s'han pogut carregar les dades. Torna-ho a intentar.")).toBeInTheDocument(),
    );
  });

  it("shows the retry button and calls the API again on click", async () => {
    vi.mocked(getLeagueRanking)
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(mockRanking);
    const user = userEvent.setup();
    render(<RankingsPage />);
    await waitFor(() => screen.getByRole("button", { name: "Torna-ho a intentar" }));
    await user.click(screen.getByRole("button", { name: "Torna-ho a intentar" }));
    await waitFor(() => {
      expect(getLeagueRanking).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });

  it("the error state has role alert for accessibility", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));
    render(<RankingsPage />);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
