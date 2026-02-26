import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router";
import TechnicalTestCard from "../TechnicalTestCard";
import { getLevelIcon } from "../../../utils/getLevelIcon";
import { TechnicalTest } from "../../../types/TechnicalTest";

vi.mock("../languageLabelsContent", () => ({
  contentForTechnicalTest: [
    {
      icon: () => <svg data-testid="react-icon">React Icon</svg>,
      label: "React",
    },
    {
      icon: () => <svg data-testid="javascript-icon">JavaScript Icon</svg>,
      label: "JavaScript",
    },
  ],
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("TechnicalTestCard", () => {
  const mockTest: TechnicalTest = {
    id: 123,
    title: "React Testing Best Practices",
    language: "React",
    description: "Learn how to test React components",
    tags: ["testing", "react"],
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-11-24T14:20:00Z",
    difficulty_level: "easy",
    duration: null,
    exercises: [],
    state: "published",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Level icon by difficulty", () => {
    it("should return the same icon for the same difficulty level", () => {
      const firstResult = getLevelIcon("easy");
      const secondResult = getLevelIcon("easy");

      expect(firstResult).toBe(secondResult);
    });

    it("should return different icons for different difficulty levels", () => {
      const resultEasy = getLevelIcon("easy");
      const resultHard = getLevelIcon("hard");

      expect(resultEasy).not.toBe(resultHard);
    });

    it("should return a default icon for null difficulty", () => {
      const result = getLevelIcon(null);
      expect(result).toBeTruthy();
    });
  });

  describe("Link navigation", () => {
    it("should render a link with the correct URL to the technical test detail page", () => {
      renderWithRouter(<TechnicalTestCard test={mockTest} />);

      const link = screen.getByRole("link", {
        name: new RegExp(mockTest.title, "i"),
      });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "/resources/technical-test/123",
      );
    });

    it("should generate correct URL for different test IDs", () => {
      const differentTest = { ...mockTest, id: 456 };
      renderWithRouter(<TechnicalTestCard test={differentTest} />);

      const link = screen.getByRole("link", {
        name: new RegExp(differentTest.title, "i"),
      });

      expect(link).toHaveAttribute(
        "href",
        "/resources/technical-test/456",
      );
    });
  });

  describe("Date formatting display", () => {
    it("should format a valid ISO date to Catalan locale (ca-ES)", () => {
      renderWithRouter(<TechnicalTestCard test={mockTest} />);

      const dateElement = screen.getByText(/15/);
      expect(dateElement).toBeInTheDocument();
    });

    it("should display 'Data desconeguda' when created_at is undefined", () => {
      const testWithoutDate = {
        ...mockTest,
        created_at: undefined as unknown as string,
      };
      renderWithRouter(<TechnicalTestCard test={testWithoutDate} />);

      expect(screen.getByText("Data desconeguda")).toBeInTheDocument();
    });
  });
});
