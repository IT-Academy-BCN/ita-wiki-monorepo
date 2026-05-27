import type { FC } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";
import { AcceptButton } from "./AcceptButton";

interface PendingRequestProps {
  contributor: ApiContributor;
  projectId: number;
}

const PendingRequest: FC<PendingRequestProps> = ({
  contributor,
  projectId,
}) => {
  return (
    <li className="flex items-center justify-between px-4 py-3">
      <span className="font-medium">{contributor.user.name}</span>
      <AcceptButton projectId={projectId} contributorId={contributor.id} />
    </li>
  );
};

export default PendingRequest;
