import testLevel1 from "../assets/testsLevel.svg";
import testLevel2 from "../assets/testsLevel2.svg";
import testLevel3 from "../assets/testsLevel3.svg";

export const getLevelIcon = (difficulty: string | null | undefined) => {
  switch (difficulty) {
    case "easy":
      return testLevel1;
    case "medium":
      return testLevel2;
    case "hard":
      return testLevel3;
    default:
      return testLevel1;
  }
};
