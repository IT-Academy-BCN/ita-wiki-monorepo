import { useState } from "react";

const languages = [
  "Node",
  "React",
  "Angular",
  "JavaScript",
  "Java",
  "PHP",
  "Data Science",
  "BBDD",
];

interface LanguageTagsBarProps {
  onSelect?: (language: string | null) => void;
}

const LanguageTagsBar = ({ onSelect }: LanguageTagsBarProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (language: string) => {
    const newSelected = selected === language ? null : language;
    setSelected(newSelected);
    onSelect?.(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((language) => (
        <button
          key={language}
          onClick={() => handleClick(language)}
          className={`px-5 py-2 rounded-full border text-sm transition-colors
            ${
              selected === language
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
        >
          {language}
        </button>
      ))}
    </div>
  );
};

export default LanguageTagsBar;
