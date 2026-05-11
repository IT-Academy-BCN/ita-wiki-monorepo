import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TicketingPage from "../TicketingPage";
import { useTicketingGetAll } from "../../hooks/useTicketingGetAll";

const mockSubmitTicketing = vi.hoisted(() => vi.fn());

vi.mock("../../hooks/useTicketingGetAll");
vi.mock("../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({ submitTicketing: mockSubmitTicketing }),
}));
vi.mock("../../components/tickets/TicketList", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ isLoading, error }: any) => {
    if (isLoading) return <p>Carregant tickets...</p>;
    if (error) return <p>{error}</p>;
    return <div data-testid="ticket-list" />;
  },
}));
vi.mock("../../components/ticketing/TicketingCreateForm", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TicketingCreateForm: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <button onClick={() => onSubmit({ description: "test" })}>
      Crear ticket
    </button>
  ),
}));

const mockHook = vi.mocked(useTicketingGetAll);

describe("TicketingPage", () => {
  beforeEach(() => {
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: false,
      errorMessage: null,
      refetch: vi.fn(),
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
      refetch: vi.fn(),
    });
    render(<TicketingPage />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("mostra el missatge d'error", () => {
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: false,
      errorMessage: "Error de connexió",
      refetch: vi.fn(),
    });
    render(<TicketingPage />);
    expect(screen.getByText("Error de connexió")).toBeInTheDocument();
  });

  it("crida refetch després de crear un ticket amb èxit", async () => {
    const mockRefetch = vi.fn();
    mockSubmitTicketing.mockResolvedValue(undefined);
    mockHook.mockReturnValue({
      tickets: [],
      isLoading: false,
      errorMessage: null,
      refetch: mockRefetch,
    });

    render(<TicketingPage />);

    await act(async () => {
      fireEvent.click(screen.getByText("Crear ticket"));
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
