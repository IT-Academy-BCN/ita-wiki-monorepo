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
