import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResourcesList } from "../ResourcesList";
import { IntResource } from "../../../types";
import { useMinLoading } from "../../../hooks/useMinLoading";

vi.mock("react-router", () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock("../../../context/ResourcesContext", () => ({
  useResources: () => ({
    isBookmarked: () => false,
    toggleBookmark: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../../../context/ResourcesFiltersContext", () => ({
  useResourcesFilters: () => ({
    selectedResourceTypes: [],
    selectedTags: [],
  }),
}));

vi.mock("../../../hooks/useResourceFilter", () => ({
  useResourceFilter: ({ resources }: { resources: IntResource[] }) => ({
    filteredResources: resources || [],
  }),
}));

vi.mock("../../../hooks/useResourceSort", () => ({
  useResourceSort: ({ resources }: { resources: IntResource[] }) => ({
    sortedResources: resources || [],
  }),
}));

vi.mock("../../../hooks/useMinLoading", () => ({
  useMinLoading: vi.fn(() => false),
}));

vi.mock("../../ui/ResourceCard", () => ({
  default: ({ resource }: { resource: IntResource }) => (
    <div data-testid="resource-card">{resource.title}</div>
  ),
}));

const mockResources = [
  {
    id: 1,
    github_id: 101,
    title: "React Guide",
    description: "Learn React",
    url: "https://react.dev",
    category: "Javascript",
    theme: null,
    type: "video",
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    github_id: 102,
    title: "TypeScript Basics",
    description: "Learn TS",
    url: "https://typescriptlang.org",
    category: "Javascript",
    theme: null,
    type: "article",
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as unknown as IntResource[];

describe("ResourcesList", () => {
  it("renders a list of resources correctly", () => {
    render(<ResourcesList resources={mockResources} category="all" />);

    const cards = screen.getAllByTestId("resource-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("React Guide")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Basics")).toBeInTheDocument();
  });

  it("displays the empty state when no resources are provided", () => {
    render(<ResourcesList resources={[]} category="all" />);

    expect(screen.getByText("No hi ha recursos")).toBeInTheDocument();
  });

  it("displays 6 skeletons when showLoader is true", () => {
    vi.mocked(useMinLoading).mockReturnValue(true);

    render(<ResourcesList resources={mockResources} category="all" />);
    const skeletons = screen.getAllByTestId("resource-card-skeleton");

    expect(skeletons).toHaveLength(6);
    expect(screen.queryByTestId("resource-card")).not.toBeInTheDocument();
  });

  it("should hide skeletons and show resources after loading is finished", () => {
    const useMinLoadingMock = vi.mocked(useMinLoading);
    useMinLoadingMock.mockReturnValue(true);

    const { rerender } = render(
      <ResourcesList resources={mockResources} category="all" />,
    );

    expect(screen.getAllByTestId("resource-card-skeleton")).toHaveLength(6);
    expect(screen.queryByTestId("resource-card")).not.toBeInTheDocument();

    useMinLoadingMock.mockReturnValue(false);

    rerender(<ResourcesList resources={mockResources} category="all" />);

    expect(
      screen.queryByTestId("resource-card-skeleton"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId("resource-card")).toHaveLength(
      mockResources.length,
    );
    expect(screen.getByText("React Guide")).toBeInTheDocument();
  });
});
