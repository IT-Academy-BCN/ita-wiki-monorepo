import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { IntResource } from "../../types";
import { useResourceFilter } from "../../hooks/useResourceFilter";
import { useResourceSort } from "../../hooks/useResourceSort";
import { useResources } from "../../context/ResourcesContext";
import { useResourcesFilters } from "../../context/ResourcesFiltersContext";
import ResourceCard from "../ui/ResourceCard";
import ResourceCardSkeleton from "./ResourcesSkeleton";
import { useMinLoading } from "../../hooks/useMinLoading";
import EmptyState from "../ui/EmptyState";

interface ResourcesListProps {
  resources: IntResource[];
  category?: string;
}

export const ResourcesList = ({ resources, category }: ResourcesListProps) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { selectedResourceTypes, selectedTags } = useResourcesFilters();

  const { isBookmarked, toggleBookmark, isLoading, error } = useResources();

  const showLoader = useMinLoading(isLoading, 500);

  const categoryFilteredResources = useMemo(() => {
    if (!resources?.length) return [];
    return category && category !== "all"
      ? resources.filter(
          (resource) =>
            resource.category.toLowerCase() === category.toLowerCase(),
        )
      : resources;
  }, [resources, category]);

  const { filteredResources } = useResourceFilter({
    resources: categoryFilteredResources,
    selectedResourceTypes,
    selectedTags,
    selectedCategory: null,
  });

  const { sortedResources } = useResourceSort({
    resources: filteredResources,
  });

  const visibleResources = useMemo(() => {
    if (!searchTerm) return sortedResources;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return sortedResources.filter((resource) =>
      resource.title.toLowerCase().includes(lowerSearchTerm),
    );
  }, [sortedResources, searchTerm]);

  if (error) {
    return (
      <EmptyState
        text="Error al obtenir recursos"
        subtext="Hi ha hagut un problema carregant les dades. Torna-ho a provar."
        textClassName="text-red-500"
      />
    );
  }

  if (showLoader) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, index) => (
          <ResourceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!resources?.length) {
    return (
      <EmptyState
        text="No hi ha recursos"
        subtext="Encara no s'han afegit recursos a la plataforma."
      />
    );
  }

  if (visibleResources.length === 0) {
    return (
      <div className="w-full py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
        <p className="text-gray-900 font-medium text-lg">
          No s'han trobat resultats
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Prova de canviar els filtres o la categoria seleccionada.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {visibleResources.map((resource: IntResource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isBookmarked={isBookmarked(resource)}
            toggleBookmark={toggleBookmark}
          />
        ))}
      </div>
    </div>
  );
};
