import { useMemo } from "react";
import { useSearchParams, useParams } from "react-router";
import { IntResource } from "../types";

interface UseResourceFilterProps {
  resources: IntResource[];
  selectedResourceTypes?: string[];
  selectedTags?: string[];
  selectedCategory?: string | null;
}

export const useResourceFilter = ({
  resources,
  selectedResourceTypes = [],
  selectedTags = [],
  selectedCategory,
}: UseResourceFilterProps) => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const filteredResources = useMemo(() => {
    if (!resources) return [];

    return resources.filter((resource) => {
      const normalize = (value: string) =>
        value.trim().toLowerCase().replace(/\s+/g, "-");

      const categoryToUse =
        selectedCategory !== undefined ? selectedCategory : category;
      const categoryMatch =
        !categoryToUse || resource.category === categoryToUse;
      const typeMatch =
        selectedResourceTypes.length === 0 ||
        selectedResourceTypes.some(
          (selectedType) => resource.type === selectedType,
        );
      const searchMatch =
        !searchQuery ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase());

      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tag) =>
          resource.tags?.some((t) => {
            const tagName = typeof t === "string" ? t : t.name;
            return normalize(tagName) === normalize(tag);
          }),
        );

      return categoryMatch && typeMatch && searchMatch && tagMatch;
    });
  }, [
    resources,
    category,
    selectedResourceTypes,
    searchQuery,
    selectedTags,
    selectedCategory,
  ]);

  return {
    filteredResources,
  };
};
