import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, it, vi, beforeEach, expect } from "vitest";
import ResourcesPage from "../ResourcesPage";
import { useResources } from "../../context/ResourcesContext";

vi.mock("../../context/ResourcesContext", () => ({
  useResources: vi.fn(),
}));

const mockedUseResources = vi.mocked(useResources);

describe("ResourcesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseResources.mockReturnValue({
      resources: [],
      isLoading: false,
      error: null,
      bookmarkedResources: [],
      loadingBookmarks: false,
      toggleBookmark: vi.fn(),
      isBookmarked: vi.fn().mockReturnValue(false),
      getBookmarkCount: vi.fn().mockReturnValue(0),
      refreshResources: vi.fn(),
      updateResourceLikeCount: vi.fn(),
    });
  });

  it("renders a scrollable container for the cards list", () => {
    render(
      <MemoryRouter initialEntries={["/resources"]}>
        <Routes>
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const scrollContainer = screen.getByTestId(
      "resources-cards-scroll-container",
    );

    expect(scrollContainer.className).toContain("overflow-y-auto");
    expect(scrollContainer.className).toContain("flex-1");
  });
});
