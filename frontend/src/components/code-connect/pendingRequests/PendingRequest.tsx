import type { FC } from "react";
import type { ApiContributor } from "../../../types/codeConnectTypes";

interface PendingRequestProps {
  contributor: ApiContributor;
  roleIcon?: string;
}

const PendingRequest: FC<PendingRequestProps> = ({ contributor, roleIcon }) => (
  <li className="flex items-center p-3 border-b last:border-b-0">
    <div className="flex-1" />
    <div className="flex-1 flex justify-center">
      {roleIcon && (
        <img
          src={roleIcon}
          alt={contributor.programming_role}
          className="w-[70px] h-[35px] object-contain"
        />
      )}
    </div>
    <div className="flex-1" />
  </li>
);

export default PendingRequest;
