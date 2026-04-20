import { Category } from "../../../types";
import sql_vector from "../../../assets/technologies/sql-logo.svg?react";
import python_vector from "../../../assets/technologies/python-logo.svg?react";
import js_vector from "../../../assets/technologies/javascript-logo.svg?react";
import java_vector from "../../../assets/technologies/java-logo.svg?react";
import php_vector from "../../../assets/technologies/php-logo.svg?react";
import angular_vector from "../../../assets/technologies/angular-logo.svg?react";
import react_vector from "../../../assets/technologies/react-logo.svg?react";
import node_vector from "../../../assets/technologies/node-logo.svg?react";

import { FC, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

export const contentResourcesForm: { icon: SvgIcon; label: Category }[] = [
  { icon: node_vector, label: "Node" },
  { icon: react_vector, label: "React" },
  { icon: angular_vector, label: "Angular" },
  { icon: js_vector, label: "JavaScript" },
  { icon: java_vector, label: "Java" },
  { icon: php_vector, label: "PHP" },
  { icon: python_vector, label: "Data Science" },
  { icon: sql_vector, label: "BBDD" },
];
