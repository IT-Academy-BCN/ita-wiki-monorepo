import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTicketForm } from "../CreateTicketForm";

const mockSubmitTicketing = vi.fn();

vi.mock("../../../hooks/useCreateTicketing", () => ({
  useCreateTicketing: () => ({
    submitTicketing: mockSubmitTicketing,
    isLoading: false,
    error: null,
  }),
}));

describe("CreateTicketForm", () => {
  beforeEach(() => {
    mockSubmitTicketing.mockClear();
  });

  it("renders textarea and submit button", () => {
    render(<CreateTicketForm />);
    expect(screen.getByPlaceholderText("Descripció...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear ticket" }),
    ).toBeInTheDocument();
  });

  it("does not submit if description is empty", () => {
    render(<CreateTicketForm />);
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(mockSubmitTicketing).not.toHaveBeenCalled();
  });

  it("calls submitTicketing with description on submit", async () => {
    mockSubmitTicketing.mockResolvedValue({});
    render(<CreateTicketForm />);
    fireEvent.change(screen.getByPlaceholderText("Descripció..."), {
      target: { value: "Bug al login" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    await waitFor(() => {
      expect(mockSubmitTicketing).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Bug al login" }),
      );
    });
  });
});
