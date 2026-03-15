import DropdownItem from "./DropdownItem";
import SortIcon, { SortIconName } from "./SortIcon";
import OrdenarIcon from "../../assets/ordenarIcon.svg?react";

interface SortDropdownProps {
  isOpen?: boolean;
  isActive?: boolean;
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

const SortDropdown = ({
  isOpen = false,
  isActive = false,
  onToggle,
}: SortDropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-pressed={isActive}
        className={[
          "inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-[#DCDFE4] text-sm font-medium cursor-pointer transition-colors duration-150",
          isActive
            ? "bg-[#282828] text-white"
            : "bg-white text-[#282828] hover:bg-gray-50",
        ].join(" ")}
      >
        <span>Ordenar</span>
        <OrdenarIcon aria-hidden="true" />
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
