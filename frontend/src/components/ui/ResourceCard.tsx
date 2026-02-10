import { useState } from "react";
import { Calendar } from "lucide-react";
import { IntResource } from "../../types";
import { useUserContext } from "../../context/UserContext";
import BookmarkIconComponent from "../resources/BookmarkIconComponent";
import { canBookmark } from "../../data/permission/tempRolesPremission";
// import LikeIcon from "../resources/LikeIcon";
// import { useLikeResources } from "../../hooks/useLikeResources";
import GenericModal from "./Modal/GenericModal";
import ContentTypeBadge from "../resources/ContentTypeBadge";
import { displayLanguageIcon } from "../../utils/iconUtils";
import heartIcon from "../../assets/heart.svg"

interface ResourceCardProps {
  resource: IntResource;
  isBookmarked?: boolean;
  toggleBookmark?: (resource: IntResource) => void;
}

const ResourceCard = ({
  resource,
  isBookmarked,
  toggleBookmark,
}: ResourceCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const { title, type, category, created_at, tags, like_count } = resource;

  const { user } = useUserContext();

  const categoryIcon: string = displayLanguageIcon(category)

//   const { voteCount, handleLike, disabled, isLikedByUser } = useLikeResources(resource);

  const hasBookmarkPermission = user && canBookmark(user.role);

  const handleBookmarkClick = () => {
    if (!user || !canBookmark(user.role)) {
      setShowModal(true);
      return;
    }

    if (toggleBookmark) {
      toggleBookmark(resource);
    }
  };

//   const handleLikeDisabled = () => {
//     setShowModal(true);
//     return;
//   };

  const formattedDate =
    typeof created_at === "string" && isNaN(Date.parse(created_at))
      ? created_at
      : created_at
        ? new Date(created_at).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Data desconeguda";

  return (
    <div>
        <div>
            {categoryIcon ? (
            <img 
                src={categoryIcon} 
                alt={`Icona de ${category}`} 
                className="w-6 h-6" 
            />
            ) : null}        
          <div
            onClick={handleBookmarkClick}
            className={`${hasBookmarkPermission ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
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
        <div>
            {title}
        </div>
        {tags && (
            <div>
                {tags.map((tag, index) => (
                    <div key={index}>{tag}</div>
                ))}
            </div>
        )}
        <div>
          <ContentTypeBadge type={type} />
          <div>
              <img 
                src={heartIcon}
                alt="heart-icon"
                className="w-6 h-6" 
              />
              <div>{like_count}</div>
          </div>
          <span className="flex items-center gap-1">
              <Calendar size={16} />
              {formattedDate}
          </span>
        </div>

      {/* Modal */}
      <GenericModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Permisos insuficients"
        size="md"
        showPrimaryButton
        primaryButtonText="D'acord"
        primaryButtonAction={() => setShowModal(false)}
      >
        <p>No tens permisos per realitzar aquesta acció</p>
      </GenericModal>
    </div>
  );
};

export default ResourceCard;