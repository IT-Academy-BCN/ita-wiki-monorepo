import { Category } from "../../../types";
import CircleIcon from "../../../assets/circle-icon.svg?react";

import HomeIcon from "../../../assets/homeIcon.svg?react";
import ResourcesIcon from "../../../assets/resourcesIcon.svg?react";
import TechTestsIcon from "../../../assets/techTestsIcon.svg?react";
import CodeConnectIcon from "../../../assets/codeConnectIcon.svg?react";
import LigasIcon from "../../../assets/ligasIcon.svg?react";
import SettingsIcon from "../../../assets/settingsIcon.svg?react";
import QuestionIcon from "../../../assets/questionIcon.svg?react";
import InfoIcon from "../../../assets/infoIcon.svg?react";

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
  {
    label: "Ligas",
    ref: "/ligas",
    icon: <LigasIcon className="w-full h-full" />,
  },
];

export const AsideConfigData: {
  label: string;
  ref: string;
  icon: JSX.Element;
}[] = [
  {
    label: "Configuració",
    ref: "#",
    icon: <SettingsIcon className="w-full h-full" />,
  },
  {
    label: "Ajuda",
    ref: "#",
    icon: <QuestionIcon className="w-full h-full" />,
  },
  {
    label: "Informació",
    ref: "#",
    icon: <InfoIcon className="w-full h-full" />,
  },
];
