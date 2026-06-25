import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, vi } from "vitest";
import TicketDetailModal from "../TicketDetailModal";
import { useTicketComments } from "../../../hooks/useTicketComments";
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

const mockUseTicketComments = vi.mocked(useTicketComments);

const mockHookReturn = (comments = []) => ({
  comments,
  isLoading: false,
  error: null,
  submitComment: vi.fn(),
  editComment: vi.fn(),
});

const mockTicket = { id: 1 } as ApiTicketData;

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
