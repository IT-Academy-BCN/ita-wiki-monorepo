import type { FC } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";

interface PendingRequestProps {
  contributor: ApiContributor;
  project: number;
}

const PendingRequest: FC<PendingRequestProps> = () => null;

export default PendingRequest;
