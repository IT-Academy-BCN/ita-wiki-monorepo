import { describe, expect, test } from "vitest";
import { getEachLeagueRanking, getLeagueRanking } from "./leagueService";

describe("getLeagueRanking", () => {
  test("should return an array", async () => {
    const result = await getLeagueRanking();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("each item should have position, user_id and points", async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(liga).toHaveProperty("position");
      expect(liga).toHaveProperty("user_id");
      expect(liga).toHaveProperty("points");
    });
  });

  test("each item should have created_at and updated_at", async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(liga).toHaveProperty("created_at");
      expect(liga).toHaveProperty("updated_at");
    });
  });

  test("points should be a number", async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(typeof liga.points).toBe("number");
    });
  });

  test("should return at least one entry", async () => {
    const result = await getLeagueRanking();

    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getEachLeagueRanking", () => {
  test("should return an array", async () => {
    const result = await getEachLeagueRanking();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("each item should be a [string, array] tuple", async () => {
    const result = await getEachLeagueRanking();

    result.forEach(([id, entries]) => {
      expect(typeof id).toBe("string");
      expect(Array.isArray(entries)).toBe(true);
    });
  });
});
