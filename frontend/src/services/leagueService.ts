import type { Liga } from "../types/league";

const mockData: Liga[] = [
  {
    id: 1,
    user_id: 10,
    points: 120,
    created_at: "2026-04-27T10:00:00.000Z",
    updated_at: "2026-04-27T10:00:00.000Z",
  },
  {
    id: 2,
    user_id: 11,
    points: 95,
    created_at: "2026-04-27T10:00:00.000Z",
    updated_at: "2026-04-27T10:00:00.000Z",
  },
  {
    id: 3,
    user_id: 12,
    points: 80,
    created_at: "2026-04-27T10:00:00.000Z",
    updated_at: "2026-04-27T10:00:00.000Z",
  },
];

export async function getLeagueRanking(): Promise<Liga[]> {
  return Promise.resolve(mockData);
}
