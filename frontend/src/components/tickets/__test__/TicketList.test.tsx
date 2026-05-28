import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TicketList from "../TicketList";
import type { ApiTicketData } from "../../../types/ticketingTypes";

const base = {
  code_connect_id: 1,
  forum_answer_id: null,
  assignee_id: null,
  closed_by: null,
  closed_at: null,
  created_at: "2026-04-23T10:00:00Z",
  updated_at: "2026-04-23T10:00:00Z",
  code_connect: {
    id: 1,
    name: "Student Test",
    role: "student",
  },
};

const mockTickets: ApiTicketData[] = [
  {
    ...base,
    id: 1,
    name: "Login no funciona",
    description: "No puc iniciar sessió amb les meves credencials.",
    status: "pending",
    priority: "high",
    type: "error",
    affected_app: "wiki_frontend",
    affected_function: "login",
    incident_date: "2026-04-23",
  },
  {
    ...base,
    id: 2,
    name: "Suggeriment per millorar la interfície",
    description: "Seria genial tenir un mode fosc a l'aplicació.",
    status: "in_progress",
    priority: "medium",
    type: "suggestion",
    affected_app: "wiki_frontend",
    affected_function: "other",
    incident_date: "2026-04-20",
  },
  {
    ...base,
    id: 3,
    name: "Error al carregar el dashboard",
    description: "El dashboard mostra un error 500 en carregar les dades.",
    status: "blocked",
    priority: "critical",
    type: "error",
    affected_app: "wiki_frontend",
    affected_function: "other",
    incident_date: "2026-04-21",
  },
  {
    ...base,
    id: 4,
    name: "Millorar la documentació",
    description: "La documentació actual és difícil d'entendre.",
    status: "ready",
    priority: "low",
    type: "suggestion",
    affected_app: "wiki_frontend",
    affected_function: "other",
    incident_date: "2026-04-22",
  },
];

describe("TicketList", () => {
  it("renders empty state", () => {
    render(<TicketList tickets={[]} isLoading={false} error={null} />);
    expect(
      screen.getByText("No hi ha tickets disponibles"),
    ).toBeInTheDocument();
  });

  it("renders all ticket names", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    mockTickets.forEach((ticket) => {
      expect(screen.getByText(ticket.name)).toBeInTheDocument();
    });
  });

  it("renders ticket status labels in catalan", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getByText("Nou")).toBeInTheDocument();
    expect(screen.getByText("En progrés")).toBeInTheDocument();
    expect(screen.getByText("Bloquejat")).toBeInTheDocument();
    expect(screen.getByText("Fet")).toBeInTheDocument();
  });

  it("renders Descripció column header but not Tipus", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getByText("Descripció")).toBeInTheDocument();
    expect(screen.queryByText("Tipus")).not.toBeInTheDocument();
  });

  it("handles priority null without crash", () => {
    const ticketWithNullPriority = [{ ...mockTickets[0], priority: null }];
    render(
      <TicketList
        tickets={ticketWithNullPriority}
        isLoading={false}
        error={null}
      />,
    );
    expect(screen.getByText("Baixa")).toBeInTheDocument();
  });

  it("renders Rol column header", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getByText("Rol")).toBeInTheDocument();
  });

  it("renders the creator role in the Rol column", () => {
    render(<TicketList tickets={mockTickets} isLoading={false} error={null} />);
    expect(screen.getAllByText("student").length).toBeGreaterThan(0);
  });
});
