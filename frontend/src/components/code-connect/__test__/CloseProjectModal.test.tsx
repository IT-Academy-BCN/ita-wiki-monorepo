import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CloseProjectModal from "../CloseProjectModal";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn().mockResolvedValue(undefined),
  isSubmitting: false,
};

describe("CloseProjectModal", () => {
  it("renders the title, labels and inputs when isOpen is true", () => {
    render(<CloseProjectModal {...defaultProps} />);

    expect(screen.getByText("Completar projecte")).toBeTruthy();
    expect(screen.getByLabelText("URL de GitHub")).toBeTruthy();
    expect(screen.getByLabelText("URL de YouTube")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel·lar" })).toBeTruthy();
  });

  it("calls onConfirm with the typed URLs when clicking Guardar", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CloseProjectModal {...defaultProps} onConfirm={onConfirm} />);

    await user.type(
      screen.getByLabelText("URL de GitHub"),
      "https://github.com/user/project",
    );
    await user.type(
      screen.getByLabelText("URL de YouTube"),
      "https://youtube.com/watch?v=123",
    );
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onConfirm).toHaveBeenCalledWith(
      "https://github.com/user/project",
      "https://youtube.com/watch?v=123",
    );
  });
});
