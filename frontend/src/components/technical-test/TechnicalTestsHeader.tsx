import { useState } from "react";
import LanguageTagsBar from "./LanguageTagsBar";

type OpenDropdown = "sort" | "filters" | null;

interface TechnicalTestsHeaderProps {
  initialCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

const TechnicalTestsHeader = ({
  initialCategory,
  onCategoryChange,
}: TechnicalTestsHeaderProps) => {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  return (
    <div className="flex justify-between items-start mb-6">
      <LanguageTagsBar
        initialSelected={initialCategory ?? null}
        onSelect={onCategoryChange}
      />
      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
            className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            Ordenar
            <span className="text-xs">▼</span>
          </button>
          {openDropdown === "sort" && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <p className="text-sm text-gray-400 text-center py-4">
                Pròximament
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "filters" ? null : "filters")
            }
            className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            Filtres
            <span className="text-xs">▼</span>
          </button>
          {openDropdown === "filters" && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <p className="text-sm text-gray-400 text-center py-4">
                Pròximament
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTestsHeader;
