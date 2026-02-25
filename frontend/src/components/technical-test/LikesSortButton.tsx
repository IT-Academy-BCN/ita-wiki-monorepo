import { FC } from "react";
import SortLikesIcon from "../../assets/sortLikesIcon.svg?react";
import ChevronDownIcon from "../../assets/chevronDownIcon.svg?react";

interface LikesSortButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}

const LikesSortButton: FC<LikesSortButtonProps> = ({
  isActive = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        "inline-flex items-center gap-2 px-4 h-9 rounded-lg border text-sm font-medium",
        "transition-colors duration-150 cursor-pointer border-[#DCDFE4]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#282828]",
        isActive ? "bg-[#282828] text-white" : "bg-white text-[#282828]",
      ].join(" ")}
    >
      <SortLikesIcon aria-hidden="true" />
      <span>Likes</span>
      <ChevronDownIcon aria-hidden="true" />
    </button>
  );
};

export default LikesSortButton;
