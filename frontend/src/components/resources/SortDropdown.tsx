interface SortDropdownProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

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
          <button className="w-full px-6 py-2 text-left text-sm flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#B91879] hover:text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Likes
          </button>

          <button className="w-full px-6 py-2 text-left text-sm flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#B91879] hover:text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Data de creació
          </button>

          <div className="border-t border-gray-200 my-1"></div>

          <button className="w-full px-6 py-2 text-left text-sm flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#B91879] hover:text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            Ascendent
          </button>

          <button className="w-full px-6 py-2 text-left text-sm flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#B91879] hover:text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Descendent
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
