import { useEffect, useState } from "react";
import { fetchProjectContributors } from "../../../api/endPointContributors";
import type { ApiContributor } from "../../../types/codeConnectTypes";
import PendingRequest from "./PendingRequest";

interface PendingRequestListProps {
  projectId: number;
  languageFrontend?: string;
  languageBackend?: string;
}

const PendingRequestList = ({
  projectId,
  languageFrontend,
  languageBackend,
}: PendingRequestListProps) => {
  const getRoleIcon = (role: string) => {
    if (role === "Frontend Developer") return languageFrontend;
    if (role === "Backend Developer") return languageBackend;
    return undefined;
  };
  const [pending, setPending] = useState<ApiContributor[]>([]);

  useEffect(() => {
    fetchProjectContributors(projectId).then((contributors) => {
      setPending(contributors.filter((c) => c.status === "pending"));
    });
  }, [projectId]);

  if (pending.length === 0) return null;

  return (
    <div className="mb-8 p-4 bg-pink-50 rounded-lg">
      <h3 className="text-[16px] font-extrabold mb-5">
        Peticions de col·laboració:
      </h3>
      <ul className="flex flex-col gap-3">
        {pending.map((contributor) => (
          <PendingRequest
            key={contributor.id}
            contributor={contributor}
            roleIcon={getRoleIcon(contributor.programming_role)}
          />
        ))}
      </ul>
    </div>
  );
};

export default PendingRequestList;
