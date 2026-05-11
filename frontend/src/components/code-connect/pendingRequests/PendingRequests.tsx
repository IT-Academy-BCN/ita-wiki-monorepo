import { useEffect, useState } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";
import {
  fetchProjectContributors,
  updateContributorStatus,
} from "../../../api/endPointCodeConnect";

interface PendingRequestsProps {
  projectId: number;
  ownerId: number;
  currentUserId?: number;
}

const PendingRequests = ({
  projectId,
  ownerId,
  currentUserId,
}: PendingRequestsProps) => {
  const [contributors, setContributors] = useState<ApiContributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);


  const loadContributors = async () => {
    setIsLoading(true);
    const data = await fetchProjectContributors(projectId);
    setContributors(data);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadContributors();
  }, [projectId]);

  if (isLoading) return null;

  const isOwner = currentUserId === ownerId;
  const isAcceptedMember = contributors.some(
    (c) => c.user_id === currentUserId && c.status === "accepted",
  );

  if (!currentUserId || (!isOwner && !isAcceptedMember)) return null;

  const pendingContributors = contributors.filter(
    (c) => c.status === "pending",
  );

    const handleAction = async (
      contributorId: number,
      status: "accepted" | "rejected",
    ) => {
    setIsSubmitting(contributorId);
    const ok = await updateContributorStatus(projectId, contributorId, status);
    if (ok) {
      await loadContributors();
    } else {
      alert("No s'ha pogut actualitzar l'estat. Torna-ho a intentar.");
    }
    setIsSubmitting(null);
  };

  return (
    <div className="mb-8 p-4 bg-pink-50 rounded-lg">
      <h3 className="text-[22px] font-extrabold mb-5">
        Sol·licituds pendents:
      </h3>
      <ul className="flex flex-col gap-3">
        {pendingContributors.map((contributor) => (
          <li
            key={contributor.id}
            className="flex items-center justify-between gap-4 p-3 border rounded-lg"
          >
            <span className="font-semibold">[{contributor.user.name}]</span>
            <span className="text-sm text-gray-500">
              {contributor.programming_role}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => void handleAction(contributor.id, "accepted")}
                disabled={isSubmitting === contributor.id}
                className="px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting === contributor.id ? "..." : "Acceptar"}
              </button>
              <button
                onClick={() => void handleAction(contributor.id, "rejected")}
                disabled={isSubmitting === contributor.id}
                className="px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting === contributor.id ? "..." : "Rebutjar"}
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;
