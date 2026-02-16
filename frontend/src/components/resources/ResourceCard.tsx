import { useState } from "react";
import ResourceCardHeader from "../ui/ResourceCardHeader";
import ResourceCardBody from "../ui/ResourceCardBody";
import { IntResource } from "../../types";
import { useUserContext } from "../../context/UserContext";
import { canBookmark } from "../../data/permission/tempRolesPremission";
import GenericModal from "../ui/Modal/GenericModal";

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
      <ResourceCardBody
        tags={tags}
        type={type}
        likeCount={like_count}
        formattedDate={formattedDate}
      />
      
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
