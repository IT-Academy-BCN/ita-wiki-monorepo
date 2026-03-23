import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SortDropdown from "../SortDropdown";

describe("SortDropdown", () => {
  it("renders the button with text Ordenar", () => {
    render(<SortDropdown />);
    expect(screen.getByText("Ordenar")).toBeInTheDocument();
  });

  it("dropdown is closed by default", () => {
    render(<SortDropdown />);
    expect(screen.queryByText("Likes")).not.toBeInTheDocument();
  });

  it("shows dropdown options when isOpen is true", () => {
    render(<SortDropdown isOpen={true} />);

    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Data de creació")).toBeInTheDocument();
    expect(screen.getByText("Ascendent")).toBeInTheDocument();
    expect(screen.getByText("Descendent")).toBeInTheDocument();
  });

  it("calls onToggle when button is clicked", () => {
    const mockOnToggle = vi.fn();
    render(<SortDropdown onToggle={mockOnToggle} />);

    fireEvent.click(screen.getByText("Ordenar"));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("button has black background when isActive is true", () => {
    render(<SortDropdown isActive={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("bg-[#282828]");
    expect(button.className).toContain("text-white");
  });

  it("button has white background when isActive is false", () => {
    render(<SortDropdown isActive={false} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.className).toContain("bg-white");
    expect(button.className).toContain("text-[#282828]");
  });
});
