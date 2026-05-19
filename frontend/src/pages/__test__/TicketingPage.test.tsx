import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TicketingPage from "../TicketingPage";
import { useTicketingGetAll } from "../../hooks/useTicketingGetAll";
import type { TicketListProps } from "../../types/ticketingTypes";

const mockSubmitTicketing = vi.hoisted(() => vi.fn());

vi.mock("../../hooks/useTicketingGetAll");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock("../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({ submitTicketing: mockSubmitTicketing }),
}));
vi.mock("../../components/tickets/TicketList", () => ({
  default: ({ isLoading, error }: TicketListProps) => {
    if (isLoading) return <p>Carregant tickets...</p>;
    if (error) return <p>{error}</p>;
    return <div data-testid="ticket-list" />;
  },
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock("../../components/ticketing/TicketingCreateForm", () => ({
  TicketingCreateForm: ({ onSubmit }: any) => (
    <button onClick={() => onSubmit({})}>Crear ticket</button>
  ),
}));

const mockHook = vi.mocked(useTicketingGetAll);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hookReturn = (o: any = {}) => ({
  tickets: [],
  isLoading: false,
  errorMessage: null,
  refetch: vi.fn(),
  ...o,
});

describe("TicketingPage", () => {
  beforeEach(() => mockHook.mockReturnValue(hookReturn()));

  it("renderitza la llista de tickets", () => {
    render(<TicketingPage />);
    expect(screen.getByTestId("ticket-list")).toBeInTheDocument();
  });

  it("mostra l'estat de càrrega", () => {
    mockHook.mockReturnValue(hookReturn({ isLoading: true }));
    render(<TicketingPage />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("mostra el missatge d'error", () => {
    mockHook.mockReturnValue(hookReturn({ errorMessage: "Error de connexió" }));
    render(<TicketingPage />);
    expect(screen.getByText("Error de connexió")).toBeInTheDocument();
  });

  it("crida refetch després de crear un ticket amb èxit", async () => {
    const mockRefetch = vi.fn();
    mockSubmitTicketing.mockResolvedValue(undefined);
    mockHook.mockReturnValue(hookReturn({ refetch: mockRefetch }));
    render(<TicketingPage />);
    await act(async () => fireEvent.click(screen.getByText("Crear ticket")));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
