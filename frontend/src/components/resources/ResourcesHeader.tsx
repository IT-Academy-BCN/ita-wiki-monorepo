import { useState } from "react";
import LanguageTagsBar from "./LanguageTagsBar";
import SortDropdown from "./SortDropdown";
import FiltersDropdown from "./FiltersDropdown";

type OpenDropdown = "sort" | "filters" | null;

interface ResourcesHeaderProps {
  initialCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

const ResourcesHeader = ({
  initialCategory,
  onCategoryChange,
}: ResourcesHeaderProps) => {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  return (
    <div className="flex justify-between items-start mb-6">
      <LanguageTagsBar
        initialSelected={initialCategory}
        onSelect={onCategoryChange}
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
  );
};

export default ResourcesHeader;
