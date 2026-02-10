import { useState } from "react";
import { useParams } from "react-router";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";
import LanguageTagsBar from "../components/resources/LanguageTagsBar";
import SortDropdown from "../components/resources/SortDropdown";
import FiltersDropdown from "../components/resources/FiltersDropdown";

type OpenDropdown = "sort" | "filters" | null;

const ResourcesPage = () => {
  const { category } = useParams();
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category || null,
  );

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

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          Nou component de cards (pendent)
          {selectedCategory && (
            <p className="mt-2">Filtre actiu: {selectedCategory}</p>
          )}
        </div>
      </div>
    </ResourcesFiltersProvider>
  );
};

export default ResourcesPage;
