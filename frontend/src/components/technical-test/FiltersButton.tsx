import { FC, useState } from "react";
import FilterIcon from "../../assets/iconFilterTechnicalTest.svg?react";
import ChevronDownIcon from "../../assets/chevronDownIcon.svg?react";
import testLevel1 from "../../assets/testsLevel.svg";
import testLevel2 from "../../assets/testsLevel2.svg";
import testLevel3 from "../../assets/testsLevel3.svg";

export interface FiltersValue {
  difficulty: string | null;
  year: number | null;
}

interface FiltersButtonProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onConfirm?: (filters: FiltersValue) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Fàcil", icon: testLevel1 },
  { value: "medium", label: "Mitjana", icon: testLevel2 },
  { value: "hard", label: "Difícil", icon: testLevel3 },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 2023 },
  (_, i) => 2024 + i,
);

const FiltersButton: FC<FiltersButtonProps> = ({
  isOpen = false,
  onToggle,
  onConfirm,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const hasActiveFilters = selectedDifficulty !== null || selectedYear !== null;

  const handleConfirm = () => {
    onConfirm?.({ difficulty: selectedDifficulty, year: selectedYear });
    onToggle?.();
  };

  return (
    <div className="relative" data-testid="filters-button-container">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        data-testid="filters-button"
        className={[
          "inline-flex items-center gap-2 px-4 h-9 rounded-lg border text-sm font-medium",
          "transition-colors duration-150 cursor-pointer border-[#DCDFE4]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#282828]",
          isOpen || hasActiveFilters
            ? "bg-[#282828] text-white"
            : "bg-white text-[#282828]",
        ].join(" ")}
      >
        <FilterIcon aria-hidden="true" />
        <span>Filtres</span>
        <ChevronDownIcon aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          data-testid="filters-dropdown"
          className="absolute right-0 mt-2 w-80 bg-white border border-[#DCDFE4] rounded-2xl shadow-lg z-10 p-6 flex flex-col gap-5"
        >
          <div>
            <p className="text-base font-bold text-[#282828] mb-3">
              Dificultat
            </p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  data-testid={`difficulty-${opt.value}`}
                  onClick={() =>
                    setSelectedDifficulty(
                      selectedDifficulty === opt.value ? null : opt.value,
                    )
                  }
                  className={[
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-150 cursor-pointer",
                    selectedDifficulty === opt.value
                      ? "bg-[#282828] text-white border-[#282828]"
                      : "bg-white text-[#282828] border-[#DCDFE4]",
                  ].join(" ")}
                >
                  <img
                    src={opt.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-4"
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-base font-bold text-[#282828] mb-3">Any</p>
            <div className="flex flex-wrap gap-2">
              {YEAR_OPTIONS.map((year) => (
                <button
                  key={year}
                  type="button"
                  data-testid={`year-${year}`}
                  onClick={() =>
                    setSelectedYear(selectedYear === year ? null : year)
                  }
                  className={[
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-150 cursor-pointer",
                    selectedYear === year
                      ? "bg-[#282828] text-white border-[#282828]"
                      : "bg-white text-[#282828] border-[#DCDFE4]",
                  ].join(" ")}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              data-testid="filters-confirm"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-[#B91879] text-white text-sm font-semibold rounded-lg hover:bg-[#a0156a] transition-colors duration-150 cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersButton;
