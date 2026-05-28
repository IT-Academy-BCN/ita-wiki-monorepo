import type { FC } from "react";
import githubLogo from "../../../assets/github-logo.svg";
import type { ApiContributor } from "../../../types/codeConnectTypes";

interface PendingRequestProps {
  contributor: ApiContributor;
  roleIcon?: string;
}

const PendingRequest: FC<PendingRequestProps> = ({ contributor, roleIcon }) => (
  <li className="flex items-center p-3 border-b last:border-b-0">
    <div className="flex items-center gap-2 flex-1">
      <span className="text-[16px] font-semibold">{contributor.user.name}</span>
      <img src={githubLogo} alt="GitHub" className="w-[18px] h-[18px]" />
    </div>
    <div className="flex-1 flex justify-center">
      {roleIcon && (
        <img
          src={roleIcon}
          alt={contributor.programming_role}
          className="w-[70px] h-[35px] object-contain"
        />
      )}
    </div>
    <div className="flex items-center gap-2 flex-1 justify-end" />
  </li>
);

export default PendingRequest;
