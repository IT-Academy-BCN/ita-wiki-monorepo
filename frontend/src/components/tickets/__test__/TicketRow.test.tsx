import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TicketRow from "../TicketRow";
import type { ApiTicketData } from "../../../types/ticketingTypes";
import { UserContext } from "../../../context/UserContext";
import { TicketCategoryEnum } from "../../../types/ticketingTypes";

const mockUserContext = {
  user: { role: "admin" },
  isAuthenticated: true,
  setUser: vi.fn(),
  signOut: vi.fn(),
  signIn: vi.fn(),
  saveUser: vi.fn(),
  error: null,
  setError: vi.fn(),
  loading: false,
  setIsLoading: vi.fn(),
};

const mockTicket: ApiTicketData = {
  id: 1,
  code_connect_id: 1,
  forum_answer_id: null,
  assignee_id: null,
  closed_by: null,
  closed_at: null,
  created_at: "2026-04-23T10:00:00Z",
  updated_at: "2026-04-23T10:00:00Z",
  name: "Login no funciona",
  description: "No puc iniciar sessió.",
  status: "pending",
  priority: "high",
  type: "error",
  affected_app: "wiki_frontend",
  affected_function: "login",
  incident_date: "2026-04-23",
  category: TicketCategoryEnum.BUG,
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <UserContext.Provider value={mockUserContext}>{ui}</UserContext.Provider>,
  );
};

describe("TicketRow", () => {
  it("should render the ticket id padded", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByText("000001")).toBeInTheDocument();
  });

  it("should render the ticket name", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByText("Login no funciona")).toBeInTheDocument();
  });

  it("should render the status dropdown with current value", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByRole("button", { name: "Nou" })).toBeInTheDocument();
  });

  it("should render the priority dropdown with current value", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByRole("button", { name: /alta/i })).toBeInTheDocument();
  });

  it("should render the category label", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByAltText(/bug/i)).toBeInTheDocument();
  });

  it("should render - when category is null", () => {
    renderWithContext(<TicketRow ticket={{ ...mockTicket, category: null }} />);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("calls onViewDetail with the ticket when the ID is clicked", () => {
    const onViewDetailMock = vi.fn();
    renderWithContext(
      <TicketRow ticket={mockTicket} onViewDetail={onViewDetailMock} />,
    );

    fireEvent.click(screen.getByText("000001"));
    expect(onViewDetailMock).toHaveBeenCalledWith(mockTicket);
  });
});
