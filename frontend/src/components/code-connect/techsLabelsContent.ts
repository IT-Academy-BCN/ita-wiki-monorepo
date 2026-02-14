import react_logo from "../../assets/technologies/react-logo.svg?react";
import angular_logo from "../../assets/technologies/angular-logo.svg?react";
import javascript_logo from "../../assets/technologies/javascript-logo.svg?react";
import node_logo from "../../assets/technologies/node-logo.svg?react";
import php_logo from "../../assets/technologies/php-logo.svg?react";
import java_logo from "../../assets/technologies/java-logo.svg?react";
import python_logo from "../../assets/technologies/python-logo.svg?react";
import sql_logo from "../../assets/technologies/sql-logo.svg?react";
import { FC, SVGProps } from "react";

type SvgIcon = FC<SVGProps<SVGSVGElement>>;

export const contentTechsFrontCodeConnect: { icon: SvgIcon; label: string }[] =
  [
    { icon: react_logo, label: "React" },
    { icon: angular_logo, label: "Angular" },
    { icon: javascript_logo, label: "Svelte" },
    { icon: javascript_logo, label: "Vue" },
    { icon: javascript_logo, label: "JavaScript" },
  ];

export const contentTechsBackCodeConnect: { icon: SvgIcon; label: string }[] = [
  { icon: node_logo, label: "Node" },
  { icon: php_logo, label: "PHP" },
  { icon: java_logo, label: "Java" },
  { icon: python_logo, label: "Python" },
  { icon: sql_logo, label: "SQL" },
];
