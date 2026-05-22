import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TicketCommentList from "../TicketCommentList";
import type { TicketComment } from "../../../types/ticketingTypes";

const mockComments: TicketComment[] = [
  {
    id: 1,
    ticket_id: 1,
    user_id: 1,
    comment: "First comment",
    is_closing_comment: false,
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-01T10:00:00Z",
    user: { id: 1, name: "John Doe" },
  },
];

describe("TicketCommentList", () => {
  it("renders comments with author name and content", () => {
    render(<TicketCommentList comments={mockComments} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("First comment")).toBeInTheDocument();
  });
});
