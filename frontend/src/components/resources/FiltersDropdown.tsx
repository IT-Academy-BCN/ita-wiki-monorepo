interface FiltersDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const FiltersDropdown = ({
  isOpen = false,
  onToggle,
}: FiltersDropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
      >
        Filtres
        <span className="text-xs">▼</span>
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
