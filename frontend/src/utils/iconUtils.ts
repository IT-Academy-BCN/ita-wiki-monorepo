import react from "../assets/react.svg";
import php from "../assets/logo-php-1.svg"; 
import angular from "../assets/angular.svg";
import javascript from "../assets/javascript.svg";
import python from "../assets/pythonVector.svg";
import java from "../assets/logo-java-1.svg";
import typescript from "../assets/TypescriptVector.svg";

export const displayLanguageIcon = (language: string | undefined | null): string => {
  if (!language) return ""; 
  
  switch (language.toLowerCase()) {
    case "javascript": return javascript;
    case "python": return python;
    case "java": return java;
    case "react": return react;
    case "angular": return angular;
    case "php": return php;
    case "typescript": return typescript;
    default: return ""; 
  }
};