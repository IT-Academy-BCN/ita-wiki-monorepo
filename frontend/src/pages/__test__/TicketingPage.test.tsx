import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TicketingPage from "../TicketingPage";
import { useTicketingGetAll } from "../../hooks/useTicketingGetAll";
import {
  TicketCategoryEnum,
  type ApiTicketData,
} from "../../types/ticketingTypes";
import type {
  IntCreateTicket,
  TicketListProps,
} from "../../types/ticketingTypes";

const mockSubmitTicketing = vi.hoisted(() => vi.fn());

vi.mock("../../hooks/useTicketingGetAll");
vi.mock("../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({ submitTicketing: mockSubmitTicketing }),
}));
vi.mock("../../components/tickets/TicketList", () => ({
  default: ({ tickets, isLoading, error, onViewDetail }: TicketListProps) => {
    if (isLoading) return <p>Carregant tickets...</p>;
    if (error) return <p>{error}</p>;
    return (
      <div data-testid="ticket-list">
        {tickets.map((t) => (
          <div
            key={t.id}
            data-testid="ticket-list-item"
            onClick={() => onViewDetail?.(t)}
          >
            {t.id}
          </div>
        ))}
      </div>
    );
  },
}));
vi.mock("../../components/ticketing/TicketingCreateForm", () => ({
  TicketingCreateForm: ({
    onSubmit,
  }: {
    onSubmit: (data: IntCreateTicket) => void;
  }) => (
    <button onClick={() => onSubmit({} as IntCreateTicket)}>
      Crear ticket
    </button>
  ),
}));

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({ user: { id: 7 } }),
}));

vi.mock("../../components/tickets/TicketDetailModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div role="dialog">Modal</div> : null,
}));

const mockHook = vi.mocked(useTicketingGetAll);
const hookReturn = (
  o: Partial<ReturnType<typeof useTicketingGetAll>> = {},
) => ({
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

  it("shows only pending and in-progress tickets by default", () => {
    const tickets = [
      { id: 1, status: "pending" },
      { id: 2, status: "in_progress" },
      { id: 3, status: "closed" },
    ] as ApiTicketData[];
    mockHook.mockReturnValue(hookReturn({ tickets }));
    render(<TicketingPage />);
    expect(screen.getAllByTestId("ticket-list-item")).toHaveLength(2);
  });

  it("toggles ticket filter when checkbox is clicked", () => {
    const tickets = [
      { id: 1, status: "pending" },
      { id: 2, status: "in_progress" },
      { id: 3, status: "blocked" },
    ] as ApiTicketData[];
    mockHook.mockReturnValue(hookReturn({ tickets }));
    render(<TicketingPage />);
    const blockedCheckbox = screen.getByLabelText("Bloquejat");
    fireEvent.click(blockedCheckbox);
    expect(screen.getAllByTestId("ticket-list-item")).toHaveLength(3);
  });

  it("opens modal when a ticket row is clicked", () => {
    const ticket = { id: 1, status: "pending" } as ApiTicketData;
    mockHook.mockReturnValue(hookReturn({ tickets: [ticket] }));
    render(<TicketingPage />);
    fireEvent.click(screen.getByTestId("ticket-list-item"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("it renders 'suggeriments' button", () => {
    render(<TicketingPage />);
    const button = screen.getByRole("button", { name: "Veure suggeriments" });
    expect(button).toBeInTheDocument();
  });

  it("shows all suggestion tickets when suggestions button is clicked", () => {
    const tickets = [
      { id: 1, status: "pending", category: TicketCategoryEnum.BUG },
      { id: 2, status: "closed", category: TicketCategoryEnum.SUGGESTION },
      { id: 3, status: "closed", category: TicketCategoryEnum.BUG },
    ] as ApiTicketData[];
    mockHook.mockReturnValue(hookReturn({ tickets }));
    render(<TicketingPage />);

    expect(mockHook).toHaveBeenLastCalledWith(false);

    fireEvent.click(screen.getByRole("button", { name: "Veure suggeriments" }));

    expect(mockHook).toHaveBeenLastCalledWith(true);

    expect(screen.getAllByTestId("ticket-list-item")).toHaveLength(1);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Veure tickets" }),
    ).toBeInTheDocument();
  });
});
