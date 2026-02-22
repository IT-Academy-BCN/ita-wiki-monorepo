import LanguageTagsBar from "./LanguageTagsBar";

interface TechnicalTestsHeaderProps {
  initialCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

const TechnicalTestsHeader = ({
  initialCategory,
  onCategoryChange,
}: TechnicalTestsHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <LanguageTagsBar
        initialSelected={initialCategory ?? null}
        onSelect={onCategoryChange}
      />

      {/* Botons d'acció — pendents d'implementar */}
      <div />
    </div>
  );
};

export default TechnicalTestsHeader;
