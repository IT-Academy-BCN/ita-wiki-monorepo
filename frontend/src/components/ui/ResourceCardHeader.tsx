import BookmarkIconComponent from "../resources/BookmarkIconComponent";
import { displayLanguageIcon } from "../../utils/iconUtils";
import type { Category, IntUser } from "../../types";

export interface ResourceCardHeaderProps {
  user: IntUser | null;
  category: Category;
  title: string;
  isBookmarked: boolean | undefined;
  handleBookmarkClick: () => void;
  hasBookmarkPermission: boolean | null;
}

const ResourceCardHeader = ({
  user,
  category,
  title,
  isBookmarked,
  handleBookmarkClick,
  hasBookmarkPermission,
}: ResourceCardHeaderProps) => {
  const categoryIcon: string = displayLanguageIcon(category);

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          {categoryIcon && (
            <img
              src={categoryIcon}
              alt={`Icona de ${category}`}
              className="w-7 h-7 object-contain"
            />
          )}
        </div>

        <div
          onClick={handleBookmarkClick}
          data-testid="bookmark-button"
          className={`${hasBookmarkPermission ? "cursor-pointer" : "cursor-not-allowed opacity-70"} text-gray-400 hover:text-gray-600 transition-colors`}
          title={
            !user
              ? "Inicia sessió per desar recursos"
              : !hasBookmarkPermission
                ? "No tens permisos per desar recursos. Contacta amb un admin."
                : undefined
          }
        >
          <BookmarkIconComponent marked={isBookmarked} />
        </div>
      </div>

      <div className="text-xl font-bold text-gray-900 leading-tight">
        {title}
      </div>
    </div>
  );
};

export default ResourceCardHeader;
