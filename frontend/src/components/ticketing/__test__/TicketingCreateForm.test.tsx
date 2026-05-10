import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketingCreateForm } from "../TicketingCreateForm";

describe("TicketingCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and submit button", () => {
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText("Descripció...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear ticket" }),
    ).toBeInTheDocument();
  });

  it("does not submit if description is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with description on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);
    await user.type(screen.getByPlaceholderText("Descripció..."), "Bug login");
    await user.click(screen.getByRole("button", { name: "Crear ticket" }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Bug login" }),
      );
    });
  });
});
