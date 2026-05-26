import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TicketCommentForm from "../TicketCommentForm";

describe("TicketCommentForm", () => {
  it("renders textarea and submit button", () => {
    render(<TicketCommentForm onSubmit={vi.fn()} error={null} />);

    expect(
      screen.getByPlaceholderText("Write a comment..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("calls onSubmit with the comment text", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TicketCommentForm onSubmit={mockSubmit} error={null} />);

    fireEvent.change(screen.getByPlaceholderText("Write a comment..."), {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSubmit).toHaveBeenCalledWith("Test comment");
  });
});
