import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FiltersButton from "../FiltersButton";

describe("FiltersButton", () => {
  it("renders the trigger button", () => {
    render(<FiltersButton />);
    expect(screen.getByTestId("filters-button")).toBeInTheDocument();
  });

  it("dropdown is hidden by default", () => {
    render(<FiltersButton />);
    expect(screen.queryByTestId("filters-dropdown")).not.toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<FiltersButton />);
    fireEvent.click(screen.getByTestId("filters-button"));
    expect(screen.getByTestId("filters-dropdown")).toBeInTheDocument();
  });

  it("shows difficulty options when open", () => {
    render(<FiltersButton />);
    fireEvent.click(screen.getByTestId("filters-button"));
    expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-medium")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-hard")).toBeInTheDocument();
  });

  it("shows year options when open", () => {
    render(<FiltersButton />);
    fireEvent.click(screen.getByTestId("filters-button"));
    expect(screen.getByTestId("year-2024")).toBeInTheDocument();
  });

  it("selects difficulty on click", () => {
    render(<FiltersButton />);
    fireEvent.click(screen.getByTestId("filters-button"));
    const easyBtn = screen.getByTestId("difficulty-easy");
    fireEvent.click(easyBtn);
    expect(easyBtn).toHaveClass("bg-[#282828]");
  });

  it("calls onConfirm with selected filters when confirm is clicked", () => {
    const mockOnConfirm = vi.fn();
    render(<FiltersButton onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByTestId("filters-button"));
    fireEvent.click(screen.getByTestId("difficulty-hard"));
    fireEvent.click(screen.getByTestId("year-2024"));
    fireEvent.click(screen.getByTestId("filters-confirm"));
    expect(mockOnConfirm).toHaveBeenCalledWith({
      difficulty: "hard",
      year: 2024,
    });
  });

  it("closes dropdown after confirm", () => {
    render(<FiltersButton />);
    fireEvent.click(screen.getByTestId("filters-button"));
    fireEvent.click(screen.getByTestId("filters-confirm"));
    expect(screen.queryByTestId("filters-dropdown")).not.toBeInTheDocument();
  });
});
