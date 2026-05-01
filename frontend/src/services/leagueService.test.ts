import { describe, it, expect } from "vitest";
import { getLeagueRanking } from "./leagueService";
import type { Liga } from "../types/league";

describe("getLeagueRanking (mock version)", () => {
  it("returns an array of ligass", async () => {
    const result = await getLeagueRanking();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("each league has the required fields", async () => {
    const result = await getLeagueRanking();
    const league: Liga = result[0];

    expect(league).toHaveProperty("id");
    expect(league).toHaveProperty("user_id");
    expect(league).toHaveProperty("points");
    expect(league).toHaveProperty("created_at");
    expect(league).toHaveProperty("updated_at");
  });
});
