import DropdownItem from "./DropdownItem";
import SortIcon, { SortIconName } from "./SortIcon";

interface SortDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const sortByOptions: { icon: SortIconName; label: string }[] = [
  { icon: "heart", label: "Likes" },
  { icon: "calendar", label: "Data de creació" },
];

const orderOptions: { icon: SortIconName; label: string }[] = [
  { icon: "chevronUp", label: "Ascendent" },
  { icon: "chevronDown", label: "Descendent" },
];

const SortDropdown = ({ isOpen = false, onToggle }: SortDropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        Ordenar
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          {sortByOptions.map((option) => (
            <DropdownItem
              key={option.label}
              icon={<SortIcon name={option.icon} />}
              label={option.label}
            />
          ))}

          <div className="border-t border-gray-200 my-1" />

          {orderOptions.map((option) => (
            <DropdownItem
              key={option.label}
              icon={<SortIcon name={option.icon} />}
              label={option.label}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
