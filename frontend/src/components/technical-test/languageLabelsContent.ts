import sql_vector from "../../assets/technologies/sql-logo.svg?react";
import python_vector from "../../assets/technologies/python-logo.svg?react";
import ts_vector from "../../assets/technologies/typescript-logo.svg?react";
import js_vector from "../../assets/technologies/javascript-logo.svg?react";
import java_vector from "../../assets/technologies/java-logo.svg?react";
import php_vector from "../../assets/technologies/php-logo.svg?react";
import react_vector from "../../assets/technologies/react-logo.svg?react";

import { FC, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

export const contentForTechnicalTest: { icon: SvgIcon; label: string }[] = [
  { icon: react_vector, label: "React" },
  { icon: sql_vector, label: "SQL" },
  { icon: js_vector, label: "JavaScript" },
  { icon: ts_vector, label: "TypeScript" },
  { icon: java_vector, label: "Java" },
  { icon: php_vector, label: "PHP" },
  { icon: python_vector, label: "Python" },
];
