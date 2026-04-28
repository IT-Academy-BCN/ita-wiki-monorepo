import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TicketList from "../TicketList";
import type { Ticket } from "../../../types/ticketingTypes";

const mockTickets: Ticket[] = [
  {
    id: 1,
    description: "Error en el login",
    status: "pending",
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
  {
    id: 3,
    description: "Altre problema",
    status: "ready",
    priority: "medium",
    incident_date: "2026-04-21",
  },
  {
    id: 4,
    description: "Error crític",
    status: "blocked",
    priority: "critical",
    incident_date: "2026-04-22",
  },
];

describe("TicketList", () => {
  it("renders loading text while isLoading is true", () => {
    render(<TicketList tickets={[]} isLoading={true} error={null} />);
    expect(screen.getByText("Carregant tickets...")).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(
      <TicketList tickets={[]} isLoading={false} error="Error personalitzat" />,
    );
    expect(screen.getByText("Error personalitzat")).toBeInTheDocument();
  });

  it("renders empty state when tickets array is empty", () => {
    render(<TicketList tickets={[]} isLoading={false} error={null} />);
    expect(
      screen.getByText("No hi ha tickets disponibles"),
    ).toBeInTheDocument();
  });

  it("renders tickets when data is available", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);

    expect(screen.getByText("000001")).toBeInTheDocument();
    expect(screen.getByText("Error en el login")).toBeInTheDocument();
    expect(screen.getByText("23/04/2026")).toBeInTheDocument();
  });

  it("renders one action button per ticket", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);

    expect(screen.getAllByRole("button", { name: /accions/i })).toHaveLength(
      mockTickets.length,
    );
  });

  it("applies the correct color depending on the priority", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);

    expect(screen.getByText("Alta")).toHaveClass("text-orange-600");
    expect(screen.getByText("Baixa")).toHaveClass("text-emerald-600");
    expect(screen.getByText("Mitjana")).toHaveClass("text-amber-600");
    expect(screen.getByText("Crítica")).toHaveClass("text-red-600");
  });

  it("renders original date if invalid date is provided", () => {
    render(
      <TicketList
        tickets={[
          {
            id: 99,
            description: "Test",
            status: "pending",
            priority: "low",
            incident_date: "invalid-date",
          },
        ]}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByText("invalid-date")).toBeInTheDocument();
  });
});
