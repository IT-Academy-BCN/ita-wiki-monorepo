import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TicketList from "../TicketList";
import type { Ticket } from "../../../types/ticketingTypes";

const mockTickets: Ticket[] = [
  {
    id: 1,
    description: "Error en el login",
    status: "open",
    priority: "high",
    incident_date: "2026-04-23",
  },
  {
    id: 2,
    description: "Problema amb el formulari",
    status: "closed",
    priority: "low",
    incident_date: "2026-04-20",
  },
];

describe("TicketList", () => {
  it("renders loading text while isLoading is true", () => {
    render(<TicketList tickets={[]} isLoading={true} error={null} />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("renders error text if there is an error", () => {
    render(<TicketList tickets={[]} isLoading={false} error="Error" />);
    expect(screen.getByText("Error en carregar els tickets")).toBeInTheDocument();
  });

  it("renders empty state when tickets array is empty", () => {
    render(<TicketList tickets={[]} isLoading={false} error={null} />);
    expect(screen.getByText("No hi ha tickets disponibles")).toBeInTheDocument();
  });

  it("renders tickets when data is available", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getByText("000001")).toBeInTheDocument();
    expect(screen.getByText("Error en el login")).toBeInTheDocument();
    expect(screen.getByText("23/04/2026")).toBeInTheDocument();
  });

  it("renders one action button per ticket", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getAllByRole("button", { name: /accions/i })).toHaveLength(mockTickets.length);
  });

  it("applies correct color class for high priority", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    const highPriority = screen.getByText("high");
    expect(highPriority).toHaveClass("text-orange-600");
  });

  it("applies correct color class for low priority", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    const lowPriority = screen.getByText("low");
    expect(lowPriority).toHaveClass("text-emerald-600");
  });
});