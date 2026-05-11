import type { LigaResponse } from "../types/league";

const mockData: LigaResponse = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    weekly_points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 2,
    user_id: 102,
    username: "Marc",
    points: 88,
    weekly_points: 88,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 3,
    user_id: 103,
    username: "Laia",
    points: 75,
    weekly_points: 75,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

export async function getLeagueRanking(): Promise<LigaResponse> {
  return Promise.resolve(mockData);
}
