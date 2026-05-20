import type { LigaResponse, Ranking } from "../types/league";

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

export async function getLeagueRanking(): Promise<
  Omit<Ranking, "league_id">[]
> {
  return Promise.resolve(mockData);
}

const mockLeaguesData = {
  "1": [
    {
      position: 1,
      user_id: 7,
      username: "ckoelpin",
      points_weekly: 99,
      league_id: 1,
    },
  ],
  "2": [
    {
      position: 1,
      user_id: 3,
      username: "mentor_test",
      points_weekly: 48,
      league_id: 2,
    },
  ],
  "3": [
    {
      position: 1,
      user_id: 2,
      username: "admin_test",
      points_weekly: 24,
      league_id: 3,
    },
    {
      position: 2,
      user_id: 1,
      username: "superadmin_test",
      points_weekly: 9,
      league_id: 3,
    },
  ],
};
export const fetchLeagueRanking = async (): Promise<LigaResponse> => {
  return Promise.resolve(mockLeaguesData);
};
