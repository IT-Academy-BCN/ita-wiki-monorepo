import type { ProjectButtonProps } from "../../../types/codeConnectTypes";

function ProjectButton({ children, onClick, isSelected }: ProjectButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`border-2 cursor-pointer rounded-full w-12 h-12 border-primary text-2xl text-primary flex items-center justify-center transition-colors duration-300 ${
        isSelected
          ? "bg-primary text-white border-solid"
          : "border-dotted hover:bg-primary hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default ProjectButton;
