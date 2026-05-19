import { useEffect, useState } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";
import {
  fetchProjectContributors,
  updateContributorStatus,
} from "../../../api/endPointContributors";

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
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetchProjectContributors(projectId)
      .then(setContributors)
      .catch(() => {});
  }, [projectId, tick]);

  const isOwner = currentUserId === ownerId;
  const isAcceptedMember = contributors.some(
    (c) => c.user_id === currentUserId && c.status === "accepted",
  );

  if (!currentUserId || (!isOwner && !isAcceptedMember)) return null;

  const handleAction = async (
    contributorId: number,
    status: "accepted" | "rejected",
  ) => {
    const ok = await updateContributorStatus(projectId, contributorId, status);
    if (ok) setTick((t) => t + 1);
    else alert("No s'ha pogut actualitzar l'estat. Torna-ho a intentar.");
  };

  const pending = contributors.filter((c) => c.status === "pending");

  return (
    <div className="mb-8 p-4 bg-pink-50 rounded-lg">
      <h3 className="text-[22px] font-extrabold mb-5">
        Sol·licituds pendents:
      </h3>
      <ul className="flex flex-col gap-3">
        {pending.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-4 p-3 border rounded-lg"
          >
            <span className="font-semibold">[{c.user.name}]</span>
            <span className="text-sm text-gray-500">{c.programming_role}</span>
            <div className="flex gap-2">
              <button
                onClick={() => void handleAction(c.id, "accepted")}
                className="px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm"
              >
                Acceptar
              </button>
              <button
                onClick={() => void handleAction(c.id, "rejected")}
                className="px-3 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm"
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
