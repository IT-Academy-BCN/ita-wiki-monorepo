import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, vi } from "vitest";
import TicketDetailModal from "../TicketDetailModal";
import { useTicketComments } from "../../../hooks/useTicketComments";
import { TicketCategoryEnum } from "../../../types/ticketingTypes";
import type { ApiTicketData } from "../../../types/ticketingTypes";

vi.mock("../../ui/Modal/GenericModal", () => ({
  default: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div>{children}</div> : null),
}));

vi.mock("../../../hooks/useTicketComments");

vi.mock("../CategoryIcon", () => ({
  default: () => <span data-testid="category-icon" />,
}));

const mockUseTicketComments = vi.mocked(useTicketComments);

const mockHookReturn = (comments = []) => ({
  comments,
  isLoading: false,
  error: null,
  submitComment: vi.fn(),
  editComment: vi.fn(),
});

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
  beforeEach(() => mockUseTicketComments.mockReturnValue(mockHookReturn()));

  it("shows empty state when there are no comments", () => {
    render(
      <TicketDetailModal
        ticket={mockTicket}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText("No hi ha comentaris")).toBeInTheDocument();
  });

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

  it("shows comment text when a comment exists", () => {
    mockUseTicketComments.mockReturnValue(
      mockHookReturn([
        {
          id: 1,
          ticket_id: 1,
          user_id: 1,
          comment: "El login falla des de ahir.",
          is_closing_comment: false,
          created_at: "2026-04-23T10:00:00Z",
          updated_at: "2026-04-23T10:00:00Z",
          user: { id: 1 },
        },
      ]),
    );
    render(
      <TicketDetailModal
        ticket={mockTicket}
        isOpen={true}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText("El login falla des de ahir.")).toBeInTheDocument();
  });
});
