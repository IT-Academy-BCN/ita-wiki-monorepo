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
  it("does not render when isOpen is false", () => {
    render(<CloseProjectModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Completar projecte")).toBeNull();
  });

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

  it("calls onConfirm with empty strings when inputs are not filled", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CloseProjectModal {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onConfirm).toHaveBeenCalledWith("", "");
  });

  it("shows 'Guardant...' and does not call onConfirm when isSubmitting is true", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <CloseProjectModal
        {...defaultProps}
        onConfirm={onConfirm}
        isSubmitting={true}
      />,
    );

    expect(screen.getByRole("button", { name: "Guardant..." })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Guardant..." }));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking Cancel·lar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CloseProjectModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Cancel·lar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the close icon button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CloseProjectModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Tancar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
