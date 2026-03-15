import FiltresIcon from "../../assets/filtresIcon.svg?react";

interface FiltersDropdownProps {
  isOpen?: boolean;
  isActive?: boolean;
  onToggle?: () => void;
}

const FiltersDropdown = ({
  isOpen = false,
  isActive = false,
  onToggle,
}: FiltersDropdownProps) => {
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
        <span>Filtres</span>
        <FiltresIcon aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Tipus
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                Video
              </button>
              <button className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                Blog
              </button>
              <button className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                Curs
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Etiquetes
            </p>
            <input
              type="text"
              placeholder="Buscar etiquetes..."
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#B91879] placeholder:text-gray-400"
            />
          </div>

          <div className="border-t border-gray-200"></div>

          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Els meus recursos
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                Guardats
              </button>
              <button className="px-3 py-1 rounded-full text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                Creats per mi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersDropdown;
