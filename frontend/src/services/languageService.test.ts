// src/services/languageService.test.ts

import { describe, expect, test } from "vitest";
import { getLanguages } from "./languageService";

describe("languageService (mock version)", () => {
  test("should return a list of languages", async () => {
    const result = getLanguages();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("each language should have id, code and name", async () => {
    const result = getLanguages();

    result.forEach((lang) => {
      expect(lang).toHaveProperty("id");
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("name");
    });
  });

  test("should include some expected languages", async () => {
    const result = getLanguages();
    const languageNames = result.map((lang) => lang.name);

    expect(languageNames).toContain("React");
    expect(languageNames).toContain("JavaScript");
    expect(languageNames).toContain("Python");
  });
});
