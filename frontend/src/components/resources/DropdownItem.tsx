interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const DropdownItem = ({ icon, label, onClick }: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-2 text-left text-sm flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#B91879] hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
};

export default DropdownItem;
