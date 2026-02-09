import { describe, it, expect, vi, afterEach } from "vitest";
import { getLanguages } from "./languageService";

describe("languageService (mock version)", () => {
  afterEach(() => {
    // Evita que algun test deixi timers/spies “enganxats”
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should return a list of languages", async () => {
    const result = await getLanguages();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("each language should have id, code and name", async () => {
    const result = await getLanguages();

    result.forEach((lang) => {
      expect(lang).toHaveProperty("id");
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("name");
    });
  });

  it("should include some expected languages", async () => {
    const result = await getLanguages();
    const languageNames = result.map((lang) => lang.name);

    expect(languageNames).toContain("React");
    expect(languageNames).toContain("JavaScript");
    expect(languageNames).toContain("Python");
  });

  it("should simulate async delay", async () => {
    vi.useFakeTimers();

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

    const promise = getLanguages();

    // Comprovem que programa el timeout de 300ms
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy.mock.calls[0][1]).toBe(300);

    // Avancem el temps perquè la Promise es resolgui
    vi.advanceTimersByTime(300);
    await promise;
  });
});
