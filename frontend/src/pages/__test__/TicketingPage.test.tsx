import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TicketingPage from "../TicketingPage";
import { useTicketingGetAll } from "../../hooks/useTicketingGetAll";
import type { TicketListProps } from "../../types/ticketingTypes";

vi.mock("../../hooks/useTicketingGetAll");
vi.mock("../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({ submitTicketing: vi.fn() }),
}));
vi.mock("../../components/tickets/TicketList", () => ({
  default: ({ isLoading, error }: TicketListProps) => {
    if (isLoading) return <p>Carregant tickets...</p>;
    if (error) return <p>{error}</p>;
    return <div data-testid="ticket-list" />;
  },
}));

const mockHook = vi.mocked(useTicketingGetAll);

describe("TicketingPage", () => {
  beforeEach(() => {
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: false,
      errorMessage: null,
    });
  });

  it("renderitza la llista de tickets", () => {
    render(<TicketingPage />);
    expect(screen.getByTestId("ticket-list")).toBeInTheDocument();
  });

  it("mostra l'estat de càrrega", () => {
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: true,
      errorMessage: null,
    });
    render(<TicketingPage />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("mostra el missatge d'error", () => {
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: false,
      errorMessage: "Error de connexió",
    });
    render(<TicketingPage />);
    expect(screen.getByText("Error de connexió")).toBeInTheDocument();
  });
});
