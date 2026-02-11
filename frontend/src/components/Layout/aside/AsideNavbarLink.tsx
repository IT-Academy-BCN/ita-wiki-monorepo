import classNames from "classnames";
import { Link } from "react-router";
import { ReactNode } from "react";

interface AsideNavbarLinkProps {
  path: string;
  label: string;
  isActive: boolean;
  icon: ReactNode;
}

export const AsideNavbarLink = ({
  path,
  label,
  isActive,
  icon,
}: AsideNavbarLinkProps) => {
  return (
    <li
      className={classNames(
        "transition-colors",
        {
          "bg-primary/15": isActive,
          "": !isActive,
        },
        "ps-4 pe-6 py-3 rounded-2xl",
      )}
    >
      <Link
        to={path}
        className={classNames(
          "!transition-colors flex items-center gap-3 text-lg !font-bold",
          {
            "!text-primary !font-extrabold": isActive,
            "!text-black hover:!text-primary": !isActive,
          },
        )}
      >
        <span className="w-[2rem] h-[2rem] [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
        {label}
      </Link>
    </li>
  );
};
