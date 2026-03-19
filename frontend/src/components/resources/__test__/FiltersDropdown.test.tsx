import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FiltersDropdown from "../FiltersDropdown";

describe("FiltersDropdown", () => {
  it("renders the button with text Filtres", () => {
    render(<FiltersDropdown />);
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("dropdown is closed by default", () => {
    render(<FiltersDropdown />);
    expect(screen.queryByText("Tipus")).not.toBeInTheDocument();
  });

  it("shows all sections when isOpen is true", () => {
    render(<FiltersDropdown isOpen={true} />);

    expect(screen.getByText("Tipus")).toBeInTheDocument();
    expect(screen.getByText("Etiquetes")).toBeInTheDocument();
    expect(screen.getByText("Els meus recursos")).toBeInTheDocument();
  });

  it("shows type filter options", () => {
    render(<FiltersDropdown isOpen={true} />);

    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Curs")).toBeInTheDocument();
  });

  it("shows my resources options", () => {
    render(<FiltersDropdown isOpen={true} />);

    expect(screen.getByText("Guardats")).toBeInTheDocument();
    expect(screen.getByText("Creats per mi")).toBeInTheDocument();
  });

  it("shows search input for tags", () => {
    render(<FiltersDropdown isOpen={true} />);

    expect(
      screen.getByPlaceholderText("Buscar etiquetes..."),
    ).toBeInTheDocument();
  });

  it("calls onToggle when button is clicked", () => {
    const mockOnToggle = vi.fn();
    render(<FiltersDropdown onToggle={mockOnToggle} />);

    fireEvent.click(screen.getByText("Filtres"));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("button has black background when isActive is true", () => {
    render(<FiltersDropdown isActive={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("bg-[#282828]");
    expect(button.className).toContain("text-white");
  });

  it("button has white background when isActive is false", () => {
    render(<FiltersDropdown isActive={false} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.className).toContain("bg-white");
    expect(button.className).toContain("text-[#282828]");
  });
});
