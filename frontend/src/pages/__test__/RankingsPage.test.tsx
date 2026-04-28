import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RankingsPage from "../RankingsPage";

vi.mock("../../services/leagueService", () => ({
  getLeagueRanking: vi.fn(),
}));

import { getLeagueRanking } from "../../services/leagueService";

const mockRanking = [
  {
    position: 1,
    user_id: 101,
    points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 2,
    user_id: 102,
    points: 88,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("RankingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the skeleton while loading", () => {
    vi.mocked(getLeagueRanking).mockReturnValue(new Promise(() => {}));

    render(<RankingsPage />);

    expect(screen.getByText("Carregant...")).toBeInTheDocument();
  });

  it("shows the toggle after data is loaded", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Ranking general")).toBeInTheDocument();
      expect(screen.getByText("Liga semanal")).toBeInTheDocument();
    });
  });

  it("shows the standings table after a successful fetch", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
      expect(screen.getByText("Usuari")).toBeInTheDocument();
      expect(screen.getByText("Punts")).toBeInTheDocument();
    });
  });

  it("shows the empty state when the API returns an empty array", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue([]);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("No hi han dades disponibles"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error message when the API fails", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No s'han pogut carregar les dades. Torna-ho a intentar.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows the retry button when there is an error", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Torna-ho a intentar" }),
      ).toBeInTheDocument();
    });
  });

  it("clicking the retry button calls the API again", async () => {
    vi.mocked(getLeagueRanking)
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Torna-ho a intentar" }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Torna-ho a intentar" }));

    await waitFor(() => {
      expect(getLeagueRanking).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });

  it("does not show the skeleton after loading completes", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Carregant...")).not.toBeInTheDocument();
    });
  });

  it("does not show an error when data loads successfully", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "No s'han pogut carregar les dades. Torna-ho a intentar.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("the error state has role alert for accessibility", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
