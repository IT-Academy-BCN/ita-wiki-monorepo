import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TicketCommentForm from "../TicketCommentForm";

describe("TicketCommentForm", () => {
  it("calls onSubmit with the comment text when Guardar is clicked", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <TicketCommentForm
        onSubmit={mockSubmit}
        onClose={vi.fn()}
        error={null}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Escribe un comentario..."), {
      target: { value: "Nuevo comentario" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(mockSubmit).toHaveBeenCalledWith("Nuevo comentario");
  });
});
