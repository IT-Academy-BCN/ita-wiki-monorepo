import { describe, expect, test } from "vitest";
import {
  contentTechsBackCodeConnect,
  contentTechsFrontCodeConnect,
  type TechnologyItem,
} from "../techsLabelsContent";

const frontIconLabelMap = [
  { label: "React", iconName: "react_vector" },
  { label: "Angular", iconName: "angular_vector" },
  { label: "Svelte", iconName: "svelte_vector" },
  { label: "Vue", iconName: "vue_vector" },
  { label: "JavaScript", iconName: "js_vector" },
  { label: "Other" },
];

const backIconLabelMap = [
  { label: "Node", iconName: "node_vector" },
  { label: "PHP", iconName: "php_vector" },
  { label: "Java", iconName: "java_vector" },
  { label: "Python", iconName: "python_vector" },
  { label: "SQL", iconName: "sql_vector" },
  { label: "Other" },
];

const checkTechsLabels = (
  contentTech: TechnologyItem[],
  map: typeof frontIconLabelMap | typeof backIconLabelMap,
) => {
  test("verifies each technology has the correct icon assigned", () => {
    map.forEach(({ label, iconName }, index) => {
      expect(contentTech[index].label).toBe(label);
      if (iconName) {
        expect(typeof contentTech[index].icon).toBe("function");
        expect(
          contentTech[index].icon,
          `${label} should use ${iconName} icon`,
        ).toBeDefined();
      } else {
        expect(contentTech[index].icon).toBeUndefined();
      }
    });
  });

  test("has correct length and all items have required properties", () => {
    expect(contentTech).toHaveLength(map.length);

    contentTech.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);
      if (item.icon) expect(typeof item.icon).toBe("function");
    });
  });
};

describe("contentTechsFrontCodeConnect Tests", () => {
  checkTechsLabels(contentTechsFrontCodeConnect, frontIconLabelMap);
});

describe("contentTechsBackCodeConnect Tests", () => {
  checkTechsLabels(contentTechsBackCodeConnect, backIconLabelMap);
});
