import { describe, test, expect } from "vitest";
import { createElement, isValidElement } from "react";
import {
  contentTechsFrontCodeConnect,
  contentTechsBackCodeConnect,
} from "../techsLabelsContent";

const frontIconLabelMap = [
  { label: "React", icon: "react_logo" },
  { label: "Angular", icon: "angular_logo" },
  { label: "Svelte", icon: "javascript_logo" },
  { label: "Vue", icon: "javascript_logo" },
  { label: "JavaScript", icon: "javascript_logo" },
];

const backIconLabelMap = [
  { label: "Node", icon: "node_logo" },
  { label: "PHP", icon: "php_logo" },
  { label: "Java", icon: "java_logo" },
  { label: "Python", icon: "python_logo" },
  { label: "SQL", icon: "sql_logo" },
];

describe("contentTechsFrontCodeConnect Tests", () => {
  test("verifies each frontend technology has the correct icon assigned", () => {
    expect(contentTechsFrontCodeConnect).toHaveLength(frontIconLabelMap.length);

    frontIconLabelMap.forEach(({ label, icon }, index) => {
      const iconValue = contentTechsFrontCodeConnect[index].icon;

      expect(contentTechsFrontCodeConnect[index].label).toBe(label);
      expect(iconValue, `${label} should use ${icon} icon`).toBeDefined();

      expect(["function", "object"]).toContain(typeof iconValue);

      const element = createElement(iconValue);
      expect(isValidElement(element)).toBe(true);
    });
  });

  test("has correct length and all items have required properties", () => {
    expect(contentTechsFrontCodeConnect).toHaveLength(frontIconLabelMap.length);

    contentTechsFrontCodeConnect.forEach((item) => {
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);

      expect(item.icon).toBeDefined();
      expect(["function", "object"]).toContain(typeof item.icon);

      const element = createElement(item.icon);
      expect(isValidElement(element)).toBe(true);
    });
  });
});

describe("contentTechsBackCodeConnect Tests", () => {
  test("verifies each backend technology has the correct icon assigned", () => {
    expect(contentTechsBackCodeConnect).toHaveLength(backIconLabelMap.length);

    backIconLabelMap.forEach(({ label, icon }, index) => {
      const iconValue = contentTechsBackCodeConnect[index].icon;

      expect(contentTechsBackCodeConnect[index].label).toBe(label);
      expect(iconValue, `${label} should use ${icon} icon`).toBeDefined();

      expect(["function", "object"]).toContain(typeof iconValue);

      const element = createElement(iconValue);
      expect(isValidElement(element)).toBe(true);
    });
  });

  test("has correct length and all items have required properties", () => {
    expect(contentTechsBackCodeConnect).toHaveLength(backIconLabelMap.length);

    contentTechsBackCodeConnect.forEach((item) => {
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);

      expect(item.icon).toBeDefined();
      expect(["function", "object"]).toContain(typeof item.icon);

      const element = createElement(item.icon);
      expect(isValidElement(element)).toBe(true);
    });
  });
});
