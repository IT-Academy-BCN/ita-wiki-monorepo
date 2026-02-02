import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TechnicalTestList from "../TechnicalTestList";
import { TechnicalTest } from "../../../types/TechnicalTest";
import useTechnicalTestList from "../../../hooks/useTechnicalTestList";

const mockTests: TechnicalTest[] = [
  {
    id: 1,
    title: "Test A",
    language: "JavaScript",
    description: "Test description A",
    tags: [],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    difficulty_level: "easy",
    duration: 60,
    exercises: [],
    state: "published",
  },
  {
    id: 2,
    title: "Test B",
    language: "TypeScript",
    description: "Test description B",
    tags: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    difficulty_level: "hard",
    duration: 120,
    exercises: [],
    state: "published",
  },
];

vi.mock("../../../hooks/useTechnicalTestList");

const mockedUseTechnicalTestList = vi.mocked(useTechnicalTestList);

describe("TechnicalTestList", () => {
  beforeEach(() => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: mockTests,
      isLoading: false,
      error: null,
    });
  });

  it("fetches and displays technical test titles from mock data", async () => {
    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test A")).toBeDefined();
      expect(screen.getByText("Test B")).toBeDefined();
    });
  });

  it("The title 'Proves tècniques' must be displayed", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Proves tècniques")).toBeDefined();
  });

  it("filters by language when filters are provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList
          filters={{
            languages: ["JavaScript"],
            years: [],
            difficulties: [],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.queryByText("Test B")).toBeNull();
  });

  it("filters by year when filters are provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList
          filters={{
            languages: [],
            years: ["2024"],
            difficulties: [],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test B")).toBeDefined();
    expect(screen.queryByText("Test A")).toBeNull();
  });

  it("filters by difficulty (Bàsica -> easy)", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList
          filters={{
            languages: [],
            years: [],
            difficulties: ["Bàsica"],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.queryByText("Test B")).toBeNull();
  });

  it("filters by difficulty (Difícil -> hard)", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList
          filters={{
            languages: [],
            years: [],
            difficulties: ["Difícil"],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test B")).toBeDefined();
    expect(screen.queryByText("Test A")).toBeNull();
  });

  it("shows error message when there is an error", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: [],
      isLoading: false,
      error: new Error("Algo ha fallado"),
    });

    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Error al obtenir proves tècniques")).toBeDefined();
  });

  it("shows EmptyState when there are no technical tests", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: [],
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    expect(screen.getByText("No hi ha proves tècniques")).toBeDefined();
  });

  it("shows EmptyState when filters return no results", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList
          filters={{
            languages: ["Python"],
            years: [],
            difficulties: [],
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("No hi ha proves tècniques")).toBeDefined();
  });

  it("shows EmptyState with error styling when there is an error", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: [],
      isLoading: false,
      error: new Error("Error de connexió"),
    });

    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Error al obtenir proves tècniques")).toBeDefined();
    expect(
      screen.getByText("Hi ha hagut un problema. Torna-ho a provar."),
    ).toBeDefined();
    expect(screen.queryByText("No hi ha proves tècniques")).toBeNull();
  });

  it("shows skeletons while loading", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: [],
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
