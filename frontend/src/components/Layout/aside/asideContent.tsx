import { Category } from "../../../types";
import CircleIcon from "../../../assets/circle-icon.svg?react";

import { HomeIcon } from "../../../icons/HomeIcon";
import { ResourcesIcon } from "../../../icons/ResourcesIcon";
import { TechTestsIcon } from "../../../icons/TechTestsIcon";
import { CodeConnectIcon } from "../../../icons/CodeConnectIcon";

import { FC, JSX, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

const categories: Category[] = [
  "Node",
  "React",
  "Angular",
  "JavaScript",
  "Java",
  "PHP",
  "Data Science",
  "BBDD",
];

export const asideContent: { icon: SvgIcon; label: Category }[] =
  categories.map((label) => ({
    icon: CircleIcon,
    label,
  }));

export const AsideNavbarData: {
  label: string;
  ref: string;
  icon: JSX.Element;
}[] = [
  {
    label: "Inici",
    ref: "/",
    icon: <HomeIcon className="w-full h-full" />,
  },
  {
    label: "Recursos",
    ref: "/resources/React",
    icon: <ResourcesIcon className="w-full h-full" />,
  },
  {
    label: "Proves tècniques",
    ref: "/resources/technical-test/all-tech-tests",
    icon: <TechTestsIcon className="w-full h-full" />,
  },
  {
    label: "Codeconnect",
    ref: "/codeconnect",
    icon: <CodeConnectIcon className="w-full h-full" />,
  },
];
