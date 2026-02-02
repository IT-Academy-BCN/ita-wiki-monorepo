import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ResourcesLayout } from "../ResourcesLayout";
import { ResourcesList } from "../ResourcesList";
import { ResourcesFiltersProvider } from "../../../context/ResourcesFiltersContext";
import { categories } from "../../../data/categories";
import { IntResource } from "../../../types";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../hooks/useResourceFilter", () => ({
  useResourceFilter: () => ({
    filteredResources: mockResources,
    selectedTags: [],
    setSelectedTags: vi.fn(),
    selectedResourceTypes: ["Video"],
    setSelectedResourceTypes: vi.fn(),
  }),
}));

vi.mock("../../../context/UserContext", () => ({
  useUserContext: () => ({
    user: { id: "123463" },
  }),
}));

const mockUseMinLoading = vi.fn();

vi.mock("../../../hooks/useMinLoading", () => ({
  useMinLoading: () => mockUseMinLoading(),
}));

const mockUseResources = vi.fn();

vi.mock("../../../context/ResourcesContext", () => ({
  useResources: () => mockUseResources(),
}));

const mockResources: IntResource[] = [
  {
    id: 1,
    title: "React Basics",
    description: "Learn React step-by-step",
    type: "Video",
    created_at: "2025-02-25 00:00:00",
    updated_at: "2025-02-25 00:00:00",
    like_count: 10,
    bookmark_count: 2,
    comment_count: 1,
  } as IntResource,
  {
    id: 2,
    title: "Advanced JS",
    description: "Deep dive into JS",
    type: "Blog",
    created_at: "2025-02-25 00:00:00",
    updated_at: "2025-02-25 00:00:00",
    like_count: 5,
    bookmark_count: 0,
    comment_count: 0,
  } as IntResource,
];

const category = Object.keys(categories)[0] as keyof typeof categories;

describe("ResourcesLayout Component", () => {
  // Configurar el valor default del mock antes de cada test
  beforeEach(() => {
    // Por defecto, useMinLoading retorna false (no loading)
    mockUseMinLoading.mockReturnValue(false);
    
    mockUseResources.mockReturnValue({
      isBookmarked: vi.fn(),
      toggleBookmark: vi.fn(),
      resources: mockResources,
      isLoading: false,
      getBookmarkCount: (resourceId: number | string) => {
        const resource = mockResources.find((r) => r.id === resourceId);
        return resource?.bookmark_count || 0;
      },
      bookmarkedResources: [],
      loadingBookmarks: false,
    });
  });
  it("should render the component and display the correct title", () => {
    render(
      <MemoryRouter>
        <ResourcesFiltersProvider>
          <ResourcesLayout
            resources={mockResources}
            category={String(category)}
          />
        </ResourcesFiltersProvider>
      </MemoryRouter>,
    );

    const titleElement = screen.getByText(`Recursos ${String(category)}`);
    expect(titleElement.tagName).toBe("H2");
  });

  it("should render 8 skeletons when loading", () => {
    mockUseMinLoading.mockReturnValue(true);
    
    mockUseResources.mockReturnValue({
      isBookmarked: vi.fn(),
      toggleBookmark: vi.fn(),
      resources: mockResources,
      isLoading: true,
      getBookmarkCount: (resourceId: number | string) => {
        const resource = mockResources.find((r) => r.id === resourceId);
        return resource?.bookmark_count || 0;
      },
      bookmarkedResources: [],
      loadingBookmarks: false,
    });

    render(
      <MemoryRouter>
        <ResourcesFiltersProvider>
          <ResourcesList resources={mockResources} category={String(category)} />
        </ResourcesFiltersProvider>
      </MemoryRouter>
    );

    const skeletons = screen.getAllByTestId("resource-card-skeleton");
    expect(skeletons).toHaveLength(8);
    expect(screen.queryByText("React Basics")).not.toBeInTheDocument();
    expect(screen.queryByText("Advanced JS")).not.toBeInTheDocument();
  });

  it("should hide skeletons after loading completes", () => {
    mockUseMinLoading.mockReturnValue(true);
    
    mockUseResources.mockReturnValue({
      isBookmarked: vi.fn(),
      toggleBookmark: vi.fn(),
      resources: mockResources,
      isLoading: true,
      getBookmarkCount: (resourceId: number | string) => {
        const resource = mockResources.find((r) => r.id === resourceId);
        return resource?.bookmark_count || 0;
      },
      bookmarkedResources: [],
      loadingBookmarks: false,
    });

    const { rerender } = render(
      <MemoryRouter>
        <ResourcesFiltersProvider>
          <ResourcesList resources={mockResources} category={String(category)} />
        </ResourcesFiltersProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByTestId("resource-card-skeleton")).toHaveLength(8);

    // Simular que termina la carga
    mockUseMinLoading.mockReturnValue(false);
    mockUseResources.mockReturnValue({
      isBookmarked: vi.fn(),
      toggleBookmark: vi.fn(),
      resources: mockResources,
      isLoading: false,
      getBookmarkCount: (resourceId: number | string) => {
        const resource = mockResources.find((r) => r.id === resourceId);
        return resource?.bookmark_count || 0;
      },
      bookmarkedResources: [],
      loadingBookmarks: false,
    });

    rerender(
      <MemoryRouter>
        <ResourcesFiltersProvider>
          <ResourcesList resources={mockResources} category={String(category)} />
        </ResourcesFiltersProvider>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("resource-card-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText("React Basics")).toBeInTheDocument();
    expect(screen.getByText("Advanced JS")).toBeInTheDocument();
  });
});
