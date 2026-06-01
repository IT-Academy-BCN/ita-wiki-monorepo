import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TicketRow from "../TicketRow";
import type { ApiTicketData } from "../../../types/ticketingTypes";
import { UserContext } from "../../../context/UserContext";

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

  it("should render the status as static text", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByText("Nou")).toBeInTheDocument();
  });

  it("should render the priority dropdown with current value", () => {
    renderWithContext(<TicketRow ticket={mockTicket} />);
    expect(screen.getByRole("button", { name: "Alta" })).toBeInTheDocument();
  });
});
