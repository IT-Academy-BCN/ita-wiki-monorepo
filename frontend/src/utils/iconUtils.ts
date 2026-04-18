import react from "../assets/technologies/react-logo.svg";
import php from "../assets/technologies/php-logo.svg";
import angular from "../assets/technologies/angular-logo.svg";
import javascript from "../assets/technologies/javascript-logo.svg";
import python from "../assets/technologies/python-logo.svg";
import java from "../assets/technologies/java-logo.svg";
import typescript from "../assets/technologies/typescript-logo.svg";

export const displayLanguageIcon = (
  language: string | undefined | null,
): string => {
  if (!language) return "";

  switch (language.toLowerCase()) {
    case "javascript":
      return javascript;
    case "python":
      return python;
    case "java":
      return java;
    case "react":
      return react;
    case "angular":
      return angular;
    case "php":
      return php;
    case "typescript":
      return typescript;
    default:
      return "";
  }
};
