import { useState } from "react";
import { useParams } from "react-router";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";
import { useResources } from "../context/ResourcesContext";
import { useResourceFilter } from "../hooks/useResourceFilter";
import { useMinLoading } from "../hooks/useMinLoading";
import LanguageTagsBar from "../components/resources/LanguageTagsBar";
import SortDropdown from "../components/resources/SortDropdown";
import FiltersDropdown from "../components/resources/FiltersDropdown";
import ResourceCard from "../components/ui/ResourceCard";
import ResourceCardSkeleton from "../components/resources/ResourcesSkeleton";

type OpenDropdown = "sort" | "filters" | null;

const ResourcesPage = () => {
  const { category } = useParams();
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category || null,
  );

  const { resources, isLoading, isBookmarked, toggleBookmark } = useResources();
  const { filteredResources } = useResourceFilter({
    resources,
    selectedCategory,
  });
  const showLoader = useMinLoading(isLoading, 1500);

  return (
    <ResourcesFiltersProvider>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Recursos de programació</h1>

        <div className="flex justify-between items-start mb-6">
          <LanguageTagsBar
            initialSelected={category}
            onSelect={(lang) => setSelectedCategory(lang)}
          />

          <div className="flex gap-2">
            <SortDropdown
              isOpen={openDropdown === "sort"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
            />
            <FiltersDropdown
              isOpen={openDropdown === "filters"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "filters" ? null : "filters")
              }
            />
          </div>
        </div>

        {showLoader ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ResourceCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No s'han trobat recursos
            {selectedCategory && ` per a ${selectedCategory}`}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isBookmarked={isBookmarked(resource)}
                toggleBookmark={toggleBookmark}
              />
            ))}
          </ul>
        )}
      </div>
    </ResourcesFiltersProvider>
  );
};

export default ResourcesPage;
