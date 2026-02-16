import { useState } from "react";
import { Calendar } from "lucide-react";
import ResourceCardHeader from "./ResourceCardHeader";
import { IntResource } from "../../types";
import { useUserContext } from "../../context/UserContext";
import { canBookmark } from "../../data/permission/tempRolesPremission";
import GenericModal from "./Modal/GenericModal";
import ContentTypeBadge from "../resources/ContentTypeBadge";
import heartIcon from "../../assets/heart.svg";

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

  const hasBookmarkPermission: boolean | null = user && canBookmark(user.role);

  const handleBookmarkClick = () => {
    if (!user || !canBookmark(user.role)) {
      setShowModal(true);
      return;
    }

    if (toggleBookmark) {
      toggleBookmark(resource);
    }
  };

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 max-w-sm">
      <ResourceCardHeader
        user={user}
        category={category}
        title={title}
        isBookmarked={isBookmarked}
        handleBookmarkClick={handleBookmarkClick}
        hasBookmarkPermission={hasBookmarkPermission}
      />
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white"
            >
              {typeof tag === "string" ? tag : tag.name}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-2 text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ContentTypeBadge type={type} />
        </div>

        <div className="flex items-center gap-1.5">
          <img
            src={heartIcon}
            alt="heart-icon"
            className="w-5 h-5 opacity-60"
          />
          <span className="text-sm">{like_count}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto text-sm">
          <Calendar size={18} className="text-gray-400" />
          {formattedDate}
        </div>
      </div>

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
