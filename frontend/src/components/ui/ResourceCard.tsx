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

  const { title, type, category, created_at, tags } = resource;

  const { user } = useUserContext();

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
          <div>{displayLanguageIcon(category)}</div>
        
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
              Likes
          </div>
          <span className="flex items-center gap-1">
              <Calendar size={16} />
              {formattedDate}
          </span>
          {/* <div
            onClick={() => (disabled ? handleLikeDisabled() : handleLike())}
            className={`flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg px-4 py-1 hover:border-2 hover:border-[#c20087] ${
                disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
            >
            <LikeIcon active={isLikedByUser} />

            <span
                className={`text-sm font-medium ${
                isLikedByUser ? "text-green-custom" : "text-black"
                }`}
            >
                {voteCount}
            </span>
          </div> */}
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