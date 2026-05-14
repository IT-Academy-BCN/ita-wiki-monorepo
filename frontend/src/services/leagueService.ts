import type { Ranking } from "../types/league";

const mockData: [string, Omit<Ranking, "points_weekly">[]][] = [
  [
    "1",
    [
      {
        position: 1,
        user_id: 101,
        username: "Júlia",
        points: 94,
        status: "Junior developer",
        language: "React",
        created_at: "2026-04-24T00:00:00Z",
        updated_at: "2026-04-24T00:00:00Z",
        league_id: 1,
      },
      {
        position: 2,
        user_id: 102,
        username: "Marc",
        points: 88,
        status: "Junior developer",
        language: "Java",
        created_at: "2026-04-24T00:00:00Z",
        updated_at: "2026-04-24T00:00:00Z",
        league_id: 1,
      },
    ],
  ],
  [
    "2",
    [
      {
        position: 3,
        user_id: 103,
        username: "Laia",
        points: 75,
        status: "Junior developer",
        language: "PHP",
        created_at: "2026-04-24T00:00:00Z",
        updated_at: "2026-04-24T00:00:00Z",
        league_id: 2,
      },
    ],
  ],
];

export async function getLeagueRanking() {
  return Promise.resolve(mockData);
}
