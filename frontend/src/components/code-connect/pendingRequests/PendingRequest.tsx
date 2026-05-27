import type { FC } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";

interface PendingRequestProps {
  contributor: ApiContributor;
  projectId: number;
}

const PendingRequest: FC<PendingRequestProps> = () => null;

export default PendingRequest;
