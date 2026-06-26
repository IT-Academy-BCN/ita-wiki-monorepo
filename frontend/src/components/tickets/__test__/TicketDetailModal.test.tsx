import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, vi } from "vitest";
import TicketDetailModal from "../TicketDetailModal";
import { TicketCategoryEnum } from "../../../types/ticketingTypes";
import type { ApiTicketData } from "../../../types/ticketingTypes";

vi.mock("../CategoryIcon", () => ({
  default: () => <span data-testid="category-icon" />,
}));

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
  code_connect: { id: 1, role: "student" },
};

describe("TicketDetailModal", () => {
  it("renders ticket details correctly", () => {
    render(
      <TicketDetailModal
        ticket={mockTicket}
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("000001")).toBeInTheDocument();
    expect(screen.getByText("No puc iniciar sessió.")).toBeInTheDocument();
    expect(screen.getByText("Nou")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByTestId("category-icon")).toBeInTheDocument();
    expect(screen.getByText("23/04/2026")).toBeInTheDocument();
    expect(screen.getByText("student")).toBeInTheDocument();
  });
});
