import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TicketCommentForm from "../TicketCommentForm";

describe("TicketCommentForm", () => {
  it("renders textarea, Guardar and Cerrar buttons when no initial value", () => {
    render(
      <TicketCommentForm onSubmit={vi.fn()} onClose={vi.fn()} error={null} />,
    );

    expect(
      screen.getByPlaceholderText("Escribe un comentario..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  it("shows existing comment readonly and hides Guardar when initialValue is provided", () => {
    render(
      <TicketCommentForm
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        error={null}
        initialValue="Comentario existente"
      />,
    );

    expect(
      screen.getByDisplayValue("Comentario existente"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Guardar" }),
    ).not.toBeInTheDocument();
  });

  it("calls onSubmit with the comment text", async () => {
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

  it("calls onClose when Cerrar is clicked", () => {
    const mockClose = vi.fn();
    render(
      <TicketCommentForm onSubmit={vi.fn()} onClose={mockClose} error={null} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(mockClose).toHaveBeenCalled();
  });
});
