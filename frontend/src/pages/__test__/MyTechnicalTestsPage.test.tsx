import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import MyTechnicalTestsPage from "../MyTechnicalTestsPage";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import useTechnicalTestList from "../../hooks/useTechnicalTestList";

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockTechnicalTests = [
  {
    id: 1,
    title: "Low Likes Test",
    language: "JavaScript",
    description: "",
    tags: [],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    difficulty_level: "easy",
    duration: 30,
    exercises: [],
    state: "published",
    like_count: 2,
  },
  {
    id: 2,
    title: "High Likes Test",
    language: "TypeScript",
    description: "",
    tags: [],
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    difficulty_level: "hard",
    duration: 60,
    exercises: [],
    state: "published",
    like_count: 99,
  },
  {
    id: 3,
    title: "Old Medium Test",
    language: "JavaScript",
    description: "",
    tags: [],
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    difficulty_level: "medium",
    duration: 45,
    exercises: [],
    state: "published",
    like_count: 5,
  },
];

vi.mock("../../hooks/useTechnicalTestList");
const mockedUseTechnicalTestList = vi.mocked(useTechnicalTestList);

describe("MyTechnicalTestsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: [],
      isLoading: false,
      error: null,
    });
  });

  it("handles empty data", async () => {
    const emptyMockData = { data: [] };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(emptyMockData),
      }),
    ) as unknown as typeof fetch;

    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText("- Test A")).not.toBeInTheDocument();
    });
  });

  it("renders the page title 'Proves tècniques'", () => {
    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Proves tècniques")).toBeInTheDocument();
  });

  it("renders a scrollable container for the cards list", () => {
    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    const scrollContainer = screen.getByTestId(
      "technical-tests-cards-scroll-container",
    );

    expect(scrollContainer.className).toContain("overflow-y-auto");
    expect(scrollContainer.className).toContain("flex-1");
  });

  it("filters by difficulty when confirmed from FiltersButton", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: mockTechnicalTests,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("filters-button"));
    fireEvent.click(screen.getByTestId("difficulty-easy"));
    fireEvent.click(screen.getByTestId("filters-confirm"));

    expect(screen.getByText("Low Likes Test")).toBeInTheDocument();
    expect(screen.queryByText("High Likes Test")).not.toBeInTheDocument();
    expect(screen.queryByText("Old Medium Test")).not.toBeInTheDocument();
  });

  it("filters by year when confirmed from FiltersButton", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: mockTechnicalTests,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("filters-button"));
    fireEvent.click(screen.getByTestId("year-2024"));
    fireEvent.click(screen.getByTestId("filters-confirm"));

    expect(screen.getByText("Old Medium Test")).toBeInTheDocument();
    expect(screen.queryByText("Low Likes Test")).not.toBeInTheDocument();
    expect(screen.queryByText("High Likes Test")).not.toBeInTheDocument();
  });

  it("sorts cards by likes descending when Likes button is clicked", () => {
    mockedUseTechnicalTestList.mockReturnValue({
      technicalTests: mockTechnicalTests,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <MyTechnicalTestsPage />
      </MemoryRouter>,
    );

    const likesButton = screen.getByRole("button", { name: /likes/i });
    fireEvent.click(likesButton);

    const links = screen.getAllByRole("link");
    const titles = links.map((el) => el.textContent ?? "").join(",");
    expect(titles.indexOf("High Likes Test")).toBeLessThan(
      titles.indexOf("Low Likes Test"),
    );
  });
});
