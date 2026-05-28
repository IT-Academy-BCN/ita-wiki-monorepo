import { useRef, useEffect, useState } from "react";
import DropdownButtonComponent from "./DropdownButtonComponent";
import { DropdownOption } from "../../types/ticketingTypes";

interface DropdownMenuProps {
  currentValue: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const DropdownMenu = ({
  currentValue,
  options,
  onSelect,
  disabled = false,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <DropdownButtonComponent
        title={currentValue}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        className="mx-0"
      />
      {isOpen && (
        <div className="absolute z-50 mt-1 w-36 rounded-md border border-border bg-white shadow-lg">
          {options.map((option) => (
            <DropdownButtonComponent
              key={option.value}
              title={option.label}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
