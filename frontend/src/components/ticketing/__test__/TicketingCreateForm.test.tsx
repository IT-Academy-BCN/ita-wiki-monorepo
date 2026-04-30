import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TicketingCreateForm } from "../TicketingCreateForm";

const mocks = vi.hoisted(() => {
  return {
    toastErrorMock: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastErrorMock,
  },
}));

const createCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

describe("TicketingCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a valid ticket payload with default required backend values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TicketingCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nom del ticket"), "Error login");
    await user.click(screen.getByRole("button", { name: "Crear ticket" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      forum_answer_id: null,
      assignee_id: null,
      name: "Error login",
      incident_date: createCurrentDate(),
      affected_app: "wiki_frontend",
      type: "error",
      affected_function: "other",
      description: "Error login",
    });
  });

  it("shows an error when the ticket name is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TicketingCreateForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Crear ticket" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(mocks.toastErrorMock).toHaveBeenCalledWith(
      "Escriu el nom del ticket.",
    );
  });

  it("disables the input and submit button while submitting", () => {
    const onSubmit = vi.fn();

    render(<TicketingCreateForm isSubmitting={true} onSubmit={onSubmit} />);

    expect(
      screen.getByLabelText("Nom del ticket").hasAttribute("disabled"),
    ).toBe(true);

    expect(
      screen
        .getByRole("button", { name: "Creant..." })
        .hasAttribute("disabled"),
    ).toBe(true);
  });
});
