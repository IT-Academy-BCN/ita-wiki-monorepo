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

  if (pendingContributors.length === 0) return null;

  const handleAction = async (
    contributorId: number,
    status: "accepted" | "rejected",
  ) => {
    const ok = await updateContributorStatus(projectId, contributorId, status);
    if (ok) await loadContributors();
  };

  return (
    <div className="mt-8 border-t pt-6">
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
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Acceptar
              </button>
              <button
                onClick={() => void handleAction(contributor.id, "rejected")}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Rebutjar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;
