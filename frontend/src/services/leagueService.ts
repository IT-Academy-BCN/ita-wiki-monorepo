import type { Ranking } from "../types/league";

const mockData: Omit<Ranking, "league_id">[] = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    points_weekly: 94,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 2,
    user_id: 102,
    username: "Marc",
    points: 88,
    points_weekly: 88,
    status: "Junior developer",
    language: "Java",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 3,
    user_id: 103,
    username: "Laia",
    points: 75,
    points_weekly: 75,
    status: "Junior developer",
    language: "PHP",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

const mockEachLeagueData: [string, Omit<Ranking, "points_weekly">[]][] = [
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

export async function getLeagueRanking(): Promise<
  Omit<Ranking, "league_id">[]
> {
  return Promise.resolve(mockData);
}

export async function getEachLeagueRanking(): Promise<
  [string, Omit<Ranking, "points_weekly">[]][]
> {
  return Promise.resolve(mockEachLeagueData);
}
