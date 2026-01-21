import { useContext, useEffect, useState } from "react";
import { LikeContext } from "../context/LikeContext";
import { useLikeToggle } from "./useLikeToggle";
import { IntResource } from "../types";
import { useUserContext } from "../context/UserContext";
import { useResources } from "../context/ResourcesContext";

export function useLikeResources(resource: IntResource) {
  const { likedResourceIds, setLikedResourceIds } = useContext(LikeContext);
  const { toggleLike } = useLikeToggle();
  const { user } = useUserContext();
  const { updateResourceLikeCount } = useResources();

  const allowedToVote = user?.role == "student" ? true : false;

  const resourceId = Number(resource.id);

  const [localCount, setLocalCount] = useState<number>(
    resource.like_count ?? 0,
  );

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!syncing) {
      setLocalCount(resource.like_count ?? 0);
    }
  }, [likedResourceIds, resourceId, syncing, resource.like_count]);

  const rollback = (wasLiked: boolean) => {
    setLocalCount((prev) => prev + (wasLiked ? -1 : 1)); // Restablecer el contador optimista
    setLikedResourceIds(likedResourceIds);
  };

  const handleLike = async () => {
    if (!allowedToVote || syncing) return;

    const wasLiked = likedResourceIds.includes(resourceId);
    const newCount = localCount + (wasLiked ? -1 : 1);

    setLocalCount(newCount);
    setSyncing(true);

    const optimisticIds = wasLiked
      ? likedResourceIds.filter((id) => id !== resourceId)
      : [...likedResourceIds, resourceId];
    setLikedResourceIds(optimisticIds);

    try {
      const result = await toggleLike(resourceId, wasLiked);
      if (!result?.success) {
        rollback(wasLiked);
      } else {
        await updateResourceLikeCount(resourceId, newCount);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      rollback(wasLiked);
    } finally {
      setSyncing(false);
    }
  };

  return {
    voteCount: localCount,
    handleLike,
    disabled: !allowedToVote,
    isLikedByUser: likedResourceIds.includes(resourceId),
  };
}
