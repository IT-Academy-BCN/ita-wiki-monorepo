import classNames from "classnames";
import { Link } from "react-router";
import { ReactNode } from "react";

interface AsideConfigLinkProps {
  path: string;
  label: string;
  isActive: boolean;
  icon: ReactNode;
}

export const AsideConfigLink = ({
  path,
  label,
  isActive,
  icon,
}: AsideConfigLinkProps) => {
  return (
    <li
      className={classNames(
        "transition-colors",
        {
          "bg-primary/15": isActive,
          "": !isActive,
        },
        "px-4 py-3 rounded-2xl",
      )}
    >
      <Link
        to={path}
        className={classNames(
          "!transition-colors flex items-center gap-2 text-sm !font-bold",
          {
            "!text-primary !font-extrabold": isActive,
            "!text-black hover:!text-primary": !isActive,
          },
        )}
      >
        <span className="w-[1.25rem] h-[1.25rem] shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
        {label}
      </Link>
    </li>
  );
};
