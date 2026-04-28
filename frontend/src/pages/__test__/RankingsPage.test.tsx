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

  it("mostra o skeleton durante o carregamento", () => {
    vi.mocked(getLeagueRanking).mockReturnValue(new Promise(() => {}));

    render(<RankingsPage />);

    expect(screen.getByText("Carregant...")).toBeInTheDocument();
  });

  it("mostra o toggle após carregar os dados", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Ranking general")).toBeInTheDocument();
      expect(screen.getByText("Liga semanal")).toBeInTheDocument();
    });
  });

  it("mostra a tabela com dados após carregamento com sucesso", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
      expect(screen.getByText("Usuari")).toBeInTheDocument();
      expect(screen.getByText("Punts")).toBeInTheDocument();
    });
  });

  it("mostra o estado vazio quando a API retorna array vazio", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue([]);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("No hi han dades disponibles"),
      ).toBeInTheDocument();
    });
  });

  it("mostra a mensagem de erro quando a API falha", async () => {
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

  it("mostra o botão de retry quando há erro", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));

    render(<RankingsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Torna-ho a intentar" }),
      ).toBeInTheDocument();
    });
  });

  it("o botão de retry chama a API novamente", async () => {
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

  it("não mostra o skeleton após o carregamento", async () => {
    vi.mocked(getLeagueRanking).mockResolvedValue(mockRanking);

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Carregant...")).not.toBeInTheDocument();
    });
  });

  it("não mostra erro quando os dados carregam com sucesso", async () => {
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

  it("o estado de erro tem role alert para acessibilidade", async () => {
    vi.mocked(getLeagueRanking).mockRejectedValue(new Error("network error"));

    render(<RankingsPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
