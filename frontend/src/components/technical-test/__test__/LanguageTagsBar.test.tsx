import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LanguageTagsBar from "../LanguageTagsBar";
import { contentForTechnicalTest } from "../languageLabelsContent";

const languages = contentForTechnicalTest.map((item) => item.label);

describe("LanguageTagsBar (TechnicalTest)", () => {
  it("renders all language buttons", () => {
    render(<LanguageTagsBar />);

    languages.forEach((language) => {
      expect(screen.getByText(language)).toBeInTheDocument();
    });
  });

  it("renders the correct number of language buttons", () => {
    render(<LanguageTagsBar />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(languages.length);
  });

  it("shows initial selected language with active styles", () => {
    render(<LanguageTagsBar initialSelected="React" />);

    const reactButton = screen.getByText("React");
    expect(reactButton).toHaveClass("bg-black", "text-white");
  });

  it("selects a language on click", () => {
    render(<LanguageTagsBar />);

    const jsButton = screen.getByText("JavaScript");
    fireEvent.click(jsButton);

    expect(jsButton).toHaveClass("bg-black", "text-white");
  });

  it("deselects language on second click", () => {
    render(<LanguageTagsBar />);

    const javaButton = screen.getByText("Java");
    fireEvent.click(javaButton);
    expect(javaButton).toHaveClass("bg-black", "text-white");

    fireEvent.click(javaButton);
    expect(javaButton).toHaveClass("bg-white", "text-gray-700");
  });

  it("calls onSelect with language name when selected", () => {
    const mockOnSelect = vi.fn();
    render(<LanguageTagsBar onSelect={mockOnSelect} />);

    const pythonButton = screen.getByText("Python");
    fireEvent.click(pythonButton);

    expect(mockOnSelect).toHaveBeenCalledWith("Python");
  });

  it("calls onSelect with null when deselected", () => {
    const mockOnSelect = vi.fn();
    render(<LanguageTagsBar initialSelected="PHP" onSelect={mockOnSelect} />);

    const phpButton = screen.getByText("PHP");
    fireEvent.click(phpButton);

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it("only one language can be selected at a time", () => {
    render(<LanguageTagsBar initialSelected="React" />);

    const sqlButton = screen.getByText("SQL");
    fireEvent.click(sqlButton);

    const reactButton = screen.getByText("React");
    expect(sqlButton).toHaveClass("bg-black", "text-white");
    expect(reactButton).toHaveClass("bg-white", "text-gray-700");
  });
});
