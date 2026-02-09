import { Category } from "../../../types";
import CircleIcon from "../../../assets/circle-icon.svg?react";

import { HomeIcon } from "../../../icons/HomeIcon";
import { ResourcesIcon } from "../../../icons/ResourcesIcon";
import { TechTestsIcon } from "../../../icons/TechTestsIcon";
import { CodeConnectIcon } from "../../../icons/CodeConnectIcon";

import { FC, JSX, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

export const asideContent: { icon: SvgIcon; label: Category }[] = [
  { icon: CircleIcon, label: "Node" },
  { icon: CircleIcon, label: "React" },
  { icon: CircleIcon, label: "Angular" },
  { icon: CircleIcon, label: "JavaScript" },
  { icon: CircleIcon, label: "Java" },
  { icon: CircleIcon, label: "PHP" },
  { icon: CircleIcon, label: "Data Science" },
  { icon: CircleIcon, label: "BBDD" },
];

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
