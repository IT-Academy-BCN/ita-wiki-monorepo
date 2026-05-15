import { describe, expect, test } from "vitest";
import { getLeagueRanking } from "./leagueService";

describe("leagueService (mock version)", () => {
  test("should return an array", async () => {
    const result = await getLeagueRanking();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("each item should be a [string, array] tuple", async () => {
    const result = await getLeagueRanking();

    result.forEach(([id, entries]) => {
      expect(typeof id).toBe("string");
      expect(Array.isArray(entries)).toBe(true);
    });
  });

  test("points should be a number", async () => {
    const result = await getLeagueRanking();

    result.forEach(([, entries]) => {
      entries.forEach((liga) => {
        expect(typeof liga.points).toBe("number");
      });
    });
  });

  test("should return at least one entry", async () => {
    const result = await getLeagueRanking();

    expect(result.length).toBeGreaterThan(0);
  });
});
