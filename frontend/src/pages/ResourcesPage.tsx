import { useState } from "react";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";
import LanguageTagsBar from "../components/resources/LanguageTagsBar";
import SortDropdown from "../components/resources/SortDropdown";
import FiltersDropdown from "../components/resources/FiltersDropdown";

type OpenDropdown = "sort" | "filters" | null;

const ResourcesPage = () => {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <ResourcesFiltersProvider>
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        <h1 className="text-2xl font-bold mb-6">Recursos de programació</h1>

        {/* Container superior - 3 columnas */}
        <div className="flex justify-between items-start mb-6">
          {/* Col 1: Tags de lenguajes */}
          <LanguageTagsBar onSelect={(lang) => setSelectedCategory(lang)} />

          {/* Col 2 + 3: Botones dropdown */}
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

        {/* TODO: Conectar nuevo componente de cards */}
        {/* Props disponibles: selectedCategory */}
        {/* Hooks disponibles: useResourceFilter, useResources, useMinLoading */}
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
