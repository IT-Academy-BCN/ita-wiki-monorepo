import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketingCreateForm } from "../TicketingCreateForm";
import "@testing-library/jest-dom";

describe("TicketingCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form elements", () => {
    const onSubmit = vi.fn();

    render(<TicketingCreateForm onSubmit={onSubmit} />);

    expect(screen.getByPlaceholderText("Descripció...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear tiquet" }),
    ).toBeInTheDocument();
  });

  it("submits with description on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TicketingCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Descripció..."), "Bug login");

    await user.click(screen.getByRole("button", { name: "Crear tiquet" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Bug login",
        }),
      );
    });
  });

  it("renders category select", () => {
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has bug as default category", () => {
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);
    expect(screen.getByRole("combobox")).toHaveValue("bug");
  });

  it("submits with selected category", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Descripció..."), "Bug login");
    await user.selectOptions(screen.getByRole("combobox"), "suggestion");
    await user.click(screen.getByRole("button", { name: "Crear tiquet" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Bug login",
          category: "suggestion",
        }),
      );
    });
  });

  it("resets category to bug after submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TicketingCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Descripció..."), "Bug login");
    await user.selectOptions(screen.getByRole("combobox"), "suggestion");
    await user.click(screen.getByRole("button", { name: "Crear tiquet" }));

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("bug");
    });
  });
});
