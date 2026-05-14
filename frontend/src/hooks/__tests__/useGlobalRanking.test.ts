import { describe, expect, it } from "vitest";
import { Ranking } from "../../types/league";
import { groupByLeague } from "../../utils/leagueUtils";

const mockData: Ranking[] = [
  {
    position: 1,
    user_id: 101,
    username: "Sasha",
    points: 94,
    points_weekly: 30,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
    league_id: 1,
  },
  {
    position: 2,
    user_id: 102,
    username: "Pixie",
    points: 88,
    points_weekly: 20,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
    league_id: 1,
  },
  {
    position: 1,
    user_id: 103,
    username: "Maya",
    points: 99,
    points_weekly: 20,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
    league_id: 2,
  },
];

describe("groupByLeague", () => {
  it("groups entries by league_id", () => {
    const result = groupByLeague(mockData);
    expect(result).toHaveLength(2);
  });

  it("converts weekly points into points (so the same List component can process it) and removes the weeklu_point property", () => {
    const result = groupByLeague(mockData);
    const league1 = result.find(([id]) => id === "1");
    expect(league1).toBeDefined();
    expect(league1?.[1][0].points).toBe(30);
    expect(league1?.[0]).not.toHaveProperty("points_weekly");
  });
  it("preserves all other fields", () => {
    const result = groupByLeague(mockData);
    const league2 = result.find(([id]) => id === "2");
    expect(league2?.[1][0]).toMatchObject({
      username: "Maya",
      user_id: 103,
      league_id: 2,
      status: "Junior developer",
      language: "React",
    });
  });
});
