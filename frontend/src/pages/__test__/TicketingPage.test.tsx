import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import TicketingPage from "../TicketingPage";
import { useTicketingGetAll } from "../../hooks/useTicketingGetAll";

vi.mock("../../hooks/useTicketingGetAll");
vi.mock("../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({ submitTicketing: vi.fn() }),
}));
vi.mock("../../components/tickets/TicketList", () => ({
  default: ({ isLoading, error }: { isLoading?: boolean; error?: string | null }) => {
    if (isLoading) return <p>Carregant tickets...</p>;
    if (error) return <p>{error}</p>;
    return <div data-testid="ticket-list" />;
  },
}));

const mockHook = vi.mocked(useTicketingGetAll);

describe("TicketingPage", () => {
  it("renderitza la llista de tickets", () => {
    mockHook.mockReturnValue({ tickets: [], isLoading: false, errorMessage: null });
    render(<TicketingPage />);
    expect(screen.getByTestId("ticket-list")).toBeInTheDocument();
  });

  it("mostra l'estat de càrrega", () => {
    mockHook.mockReturnValue({ tickets: [], isLoading: true, errorMessage: null });
    render(<TicketingPage />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("mostra el missatge d'error", () => {
    mockHook.mockReturnValue({ tickets: [], isLoading: false, errorMessage: "Error de connexió" });
    render(<TicketingPage />);
    expect(screen.getByText("Error de connexió")).toBeInTheDocument();
  });

  it("renderitza el formulari de creació de ticket", () => {
    mockHook.mockReturnValue({ tickets: [], isLoading: false, errorMessage: null });
    render(<TicketingPage />);
    expect(screen.getByRole("button", { name: "Crear ticket" })).toBeInTheDocument();
  });
});
