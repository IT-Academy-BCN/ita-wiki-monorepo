import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LanguageTagsBar from "../LanguageTagsBar";
import { categories } from "../../../data/categories";

describe("LanguageTagsBar", () => {
  it("renders all categories", () => {
    render(<LanguageTagsBar />);

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("renders correct number of category buttons", () => {
    render(<LanguageTagsBar />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(categories.length);
  });

  it("shows initial selected category", () => {
    render(<LanguageTagsBar initialSelected="React" />);

    const reactButton = screen.getByText("React");
    expect(reactButton).toHaveClass("bg-black", "text-white");
  });

  it("selects category on click", () => {
    render(<LanguageTagsBar />);

    const nodeButton = screen.getByText("Node");
    fireEvent.click(nodeButton);

    expect(nodeButton).toHaveClass("bg-black", "text-white");
  });

  it("deselects category on second click", () => {
    render(<LanguageTagsBar />);

    const reactButton = screen.getByText("React");
    fireEvent.click(reactButton);
    expect(reactButton).toHaveClass("bg-black", "text-white");
    fireEvent.click(reactButton);

    expect(reactButton).toHaveClass("bg-white", "text-gray-700");
  });

  it("calls onSelect with category name when selected", () => {
    const mockOnSelect = vi.fn();
    render(<LanguageTagsBar onSelect={mockOnSelect} />);

    const angularButton = screen.getByText("Angular");
    fireEvent.click(angularButton);

    expect(mockOnSelect).toHaveBeenCalledWith("Angular");
  });

  it("calls onSelect with null when deselected", () => {
    const mockOnSelect = vi.fn();
    render(<LanguageTagsBar initialSelected="React" onSelect={mockOnSelect} />);

    const reactButton = screen.getByText("React");
    fireEvent.click(reactButton);

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it("only one category can be selected at a time", () => {
    render(<LanguageTagsBar initialSelected="React" />);

    const nodeButton = screen.getByText("Node");
    fireEvent.click(nodeButton);

    const reactButton = screen.getByText("React");

    expect(nodeButton).toHaveClass("bg-black", "text-white");
    expect(reactButton).toHaveClass("bg-white", "text-gray-700");
  });
});
