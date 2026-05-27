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
    like_count: 3,
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
    like_count: 10,
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

  it("filters by language when language prop is provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList language="JavaScript" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.queryByText("Test B")).toBeNull();
  });

  it("shows all tests when no language prop is provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.getByText("Test B")).toBeDefined();
  });

  it("shows EmptyState when language filter returns no results", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList language="Python" />
      </MemoryRouter>,
    );

    expect(screen.getByText("No hi ha proves tècniques")).toBeDefined();
  });

  it("filters by difficulty when difficulty prop is provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList difficulty="easy" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.queryByText("Test B")).toBeNull();
  });

  it("filters by year when year prop is provided", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList year={2025} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test A")).toBeDefined();
    expect(screen.queryByText("Test B")).toBeNull();
  });

  it("shows EmptyState when difficulty filter returns no results", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList difficulty="medium" />
      </MemoryRouter>,
    );

    expect(screen.getByText("No hi ha proves tècniques")).toBeDefined();
  });

  it("filters by difficulty and year combined", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList difficulty="hard" year={2024} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test B")).toBeDefined();
    expect(screen.queryByText("Test A")).toBeNull();
  });

  it("sorts tests by likes descending when sortByLikes is true", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList sortByLikes={true} />
      </MemoryRouter>,
    );

    const titles = screen
      .getAllByRole("link")
      .map((el) => el.textContent)
      .join(",");
    expect(titles.indexOf("Test B")).toBeLessThan(titles.indexOf("Test A"));
  });

  it("shows natural order when sortByLikes is false", () => {
    render(
      <MemoryRouter>
        <TechnicalTestList sortByLikes={false} />
      </MemoryRouter>,
    );

    const titles = screen
      .getAllByRole("link")
      .map((el) => el.textContent)
      .join(",");
    expect(titles.indexOf("Test A")).toBeLessThan(titles.indexOf("Test B"));
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
