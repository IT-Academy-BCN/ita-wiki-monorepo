import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import * as ReactRouter from "react-router";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useResources } from "../../context/ResourcesContext";
import ResourcesPage from "../ResourcesPage";

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

  it("shows the create resource button", () => {
    render(
      <MemoryRouter initialEntries={["/resources"]}>
        <Routes>
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Crear Recurso")).toBeInTheDocument();
  });

  it("resource button should redirect the user to the create resource page", async () => {
    const mockNavigate = vi.fn();
    vi.spyOn(ReactRouter, "useNavigate").mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={["/resources"]}>
        <Routes>
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Crear Recurso"));
    expect(mockNavigate).toHaveBeenCalledWith("/resources/add");
  });
});
