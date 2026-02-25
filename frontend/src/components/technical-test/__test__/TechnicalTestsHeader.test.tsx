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
});
