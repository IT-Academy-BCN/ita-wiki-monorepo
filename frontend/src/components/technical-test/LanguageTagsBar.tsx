import { useState } from "react";
import { contentForTechnicalTest } from "./languageLabelsContent";

interface LanguageTagsBarProps {
  initialSelected?: string | null;
  onSelect?: (language: string | null) => void;
}

const LanguageTagsBar = ({
  initialSelected = null,
  onSelect,
}: LanguageTagsBarProps) => {
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const handleClick = (language: string) => {
    const newSelected = selected === language ? null : language;
    setSelected(newSelected);
    onSelect?.(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {contentForTechnicalTest.map(({ label }) => (
        <button
          key={label}
          onClick={() => handleClick(label)}
          className={`px-5 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
            selected === label
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageTagsBar;
