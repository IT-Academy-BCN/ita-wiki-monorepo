import { useState } from "react";
import LanguageTagsBar from "./LanguageTagsBar.tsx";
import LikesSortButton from "./LikesSortButton";
import FiltersButton, { FiltersValue } from "./FiltersButton";

interface TechnicalTestsHeaderProps {
  initialCategory?: string;
  onCategoryChange?: (category: string | null) => void;
  onSortByLikes?: (active: boolean) => void;
  onFilter?: (filters: FiltersValue) => void;
}

const TechnicalTestsHeader = ({
  initialCategory,
  onCategoryChange,
  onSortByLikes,
  onFilter,
}: TechnicalTestsHeaderProps) => {
  const [sortByLikes, setSortByLikes] = useState(false);

  const handleLikesToggle = () => {
    const next = !sortByLikes;
    setSortByLikes(next);
    onSortByLikes?.(next);
  };

  return (
    <div className="flex justify-between items-start mb-6">
      <LanguageTagsBar
        initialSelected={initialCategory ?? null}
        onSelect={onCategoryChange}
      />

      <div className="flex items-center gap-2">
        <LikesSortButton isActive={sortByLikes} onClick={handleLikesToggle} />
        <FiltersButton onConfirm={onFilter} />
      </div>
    </div>
  );
};

export default TechnicalTestsHeader;
