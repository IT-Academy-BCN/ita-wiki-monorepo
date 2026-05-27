import { Category } from "../../types";
import JavaIcon from "@/assets/technologies/java-logo.svg?react";
import PhpIcon from "@/assets/technologies/php-logo.svg?react";
import ReactIcon from "@/assets/technologies/react-logo.svg?react";
import AngularIcon from "@/assets/technologies/angular-logo.svg?react";
import { FC, SVGProps } from "react";

export type FilterItem = {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: Category;
};

export const filtersContent: FilterItem[] = [
  { icon: JavaIcon, label: "Java" },
  { icon: PhpIcon, label: "PHP" },
  { icon: ReactIcon, label: "React" },
  { icon: AngularIcon, label: "Angular" },
];
