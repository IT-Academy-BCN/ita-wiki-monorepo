import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FiltersButton from "../FiltersButton";

describe("FiltersButton", () => {
  it("renders the trigger button", () => {
    render(<FiltersButton />);
    expect(screen.getByTestId("filters-button")).toBeInTheDocument();
  });

  it("dropdown is hidden when isOpen is false", () => {
    render(<FiltersButton isOpen={false} />);
    expect(screen.queryByTestId("filters-dropdown")).not.toBeInTheDocument();
  });

  it("shows dropdown when isOpen is true", () => {
    render(<FiltersButton isOpen={true} />);
    expect(screen.getByTestId("filters-dropdown")).toBeInTheDocument();
  });

  it("calls onToggle when button is clicked", () => {
    const mockToggle = vi.fn();
    render(<FiltersButton onToggle={mockToggle} />);
    fireEvent.click(screen.getByTestId("filters-button"));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("shows difficulty options when open", () => {
    render(<FiltersButton isOpen={true} />);
    expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-medium")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-hard")).toBeInTheDocument();
  });

  it("shows year options when open", () => {
    render(<FiltersButton isOpen={true} />);
    expect(screen.getByTestId("year-2024")).toBeInTheDocument();
  });

  it("selects difficulty on click", () => {
    render(<FiltersButton isOpen={true} />);
    const easyBtn = screen.getByTestId("difficulty-easy");
    fireEvent.click(easyBtn);
    expect(easyBtn).toHaveClass("bg-[#282828]");
  });

  it("calls onConfirm with selected filters when confirm is clicked", () => {
    const mockOnConfirm = vi.fn();
    render(<FiltersButton isOpen={true} onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByTestId("difficulty-hard"));
    fireEvent.click(screen.getByTestId("year-2024"));
    fireEvent.click(screen.getByTestId("filters-confirm"));
    expect(mockOnConfirm).toHaveBeenCalledWith({
      difficulty: "hard",
      year: 2024,
    });
  });

  it("calls onToggle on confirm to close dropdown", () => {
    const mockToggle = vi.fn();
    render(<FiltersButton isOpen={true} onToggle={mockToggle} />);
    fireEvent.click(screen.getByTestId("filters-confirm"));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
