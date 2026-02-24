import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TechnicalTestsHeader from "../TechnicalTestsHeader";
import { contentForTechnicalTest } from "../languageLabelsContent";

const firstLanguage = contentForTechnicalTest[0].label;

describe("TechnicalTestsHeader", () => {
  it("renders the LanguageTagsBar", () => {
    render(<TechnicalTestsHeader />);
    expect(screen.getByText(firstLanguage)).toBeInTheDocument();
  });

  it("calls onCategoryChange when a language is selected", () => {
    const mockOnChange = vi.fn();
    render(<TechnicalTestsHeader onCategoryChange={mockOnChange} />);
    fireEvent.click(screen.getByText(firstLanguage));
    expect(mockOnChange).toHaveBeenCalledWith(firstLanguage);
  });

  it("calls onCategoryChange with null when language is deselected", () => {
    const mockOnChange = vi.fn();
    render(
      <TechnicalTestsHeader
        initialCategory="React"
        onCategoryChange={mockOnChange}
      />,
    );
    fireEvent.click(screen.getByText("React"));
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("renders the LikesSortButton", () => {
    render(<TechnicalTestsHeader />);
    expect(screen.getByText("Likes")).toBeInTheDocument();
  });

  it("LikesSortButton starts inactive", () => {
    render(<TechnicalTestsHeader />);
    const button = screen.getByRole("button", { name: /likes/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveClass("bg-white");
  });

  it("LikesSortButton toggles active state on click", () => {
    render(<TechnicalTestsHeader />);
    const button = screen.getByRole("button", { name: /likes/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("bg-black");
  });

  it("calls onSortByLikes with true when Likes button activated", () => {
    const mockOnSort = vi.fn();
    render(<TechnicalTestsHeader onSortByLikes={mockOnSort} />);
    fireEvent.click(screen.getByRole("button", { name: /likes/i }));
    expect(mockOnSort).toHaveBeenCalledWith(true);
  });

  it("calls onSortByLikes with false when Likes button deactivated", () => {
    const mockOnSort = vi.fn();
    render(<TechnicalTestsHeader onSortByLikes={mockOnSort} />);
    const button = screen.getByRole("button", { name: /likes/i });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockOnSort).toHaveBeenLastCalledWith(false);
  });
});
